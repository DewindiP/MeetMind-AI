const { z } = require("zod");
const prisma = require("../config/prisma");
const HttpError = require("../utils/http-error");

async function ensureOwnedMeeting(meetingId, userId) {
  const meeting = await prisma.meeting.findFirst({
    where: { id: meetingId, ownerId: userId },
    select: { id: true },
  });

  if (!meeting) throw new HttpError(404, "Meeting not found.");
}

const createSchema = z.object({
  title: z.string().trim().min(1).max(300),
  description: z.string().max(10000).nullable().optional(),
  assignee: z.string().trim().max(150).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
});

const updateSchema = createSchema.partial();

async function createActionItem(req, res) {
  const parsed = createSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0].message);
  }

  await ensureOwnedMeeting(req.params.id, req.user.id);

  const data = { ...parsed.data };
  if (data.dueDate) data.dueDate = new Date(data.dueDate);

  const actionItem = await prisma.actionItem.create({
    data: { ...data, meetingId: req.params.id },
  });

  res.status(201).json({ success: true, data: { actionItem } });
}

async function updateActionItem(req, res) {
  const parsed = updateSchema.safeParse(req.body);

  if (!parsed.success || Object.keys(req.body || {}).length === 0) {
    throw new HttpError(400, "Provide valid action item fields to update.");
  }

  await ensureOwnedMeeting(req.params.id, req.user.id);

  const data = { ...parsed.data };
  if (data.dueDate) data.dueDate = new Date(data.dueDate);

  const result = await prisma.actionItem.updateMany({
    where: { id: req.params.itemId, meetingId: req.params.id },
    data,
  });

  if (!result.count) throw new HttpError(404, "Action item not found.");

  const actionItem = await prisma.actionItem.findUnique({
    where: { id: req.params.itemId },
  });

  res.json({ success: true, data: { actionItem } });
}

async function deleteActionItem(req, res) {
  await ensureOwnedMeeting(req.params.id, req.user.id);

  const result = await prisma.actionItem.deleteMany({
    where: { id: req.params.itemId, meetingId: req.params.id },
  });

  if (!result.count) throw new HttpError(404, "Action item not found.");

  res.json({ success: true, message: "Action item deleted successfully." });
}

module.exports = {
  createActionItem,
  updateActionItem,
  deleteActionItem,
};