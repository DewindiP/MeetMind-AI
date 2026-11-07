const { z } = require("zod");
const prisma = require("../config/prisma");
const HttpError = require("../utils/http-error");

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(10000).nullable().optional(),
  meetingDate: z.string().datetime().nullable().optional(),
  attendees: z.array(z.string().trim().min(1).max(150)).max(100).optional(),
  rawNotes: z.string().max(50000).nullable().optional(),
});

const updateSchema = createSchema.partial().extend({
  status: z.enum(["DRAFT", "COMPLETED"]).optional(),
});

async function createMeeting(req, res) {
  const parsed = createSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0].message);
  }

  const data = { ...parsed.data };

  if (data.meetingDate) data.meetingDate = new Date(data.meetingDate);

  const meeting = await prisma.meeting.create({
    data: { ...data, ownerId: req.user.id },
  });

  res.status(201).json({ success: true, data: { meeting } });
}

async function listMeetings(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));

  const where = { ownerId: req.user.id };

  const [meetings, total] = await prisma.$transaction([
    prisma.meeting.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { notes: true, actionItems: true } },
      },
    }),
    prisma.meeting.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      meetings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}

async function getMeeting(req, res) {
  const meeting = await prisma.meeting.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    include: {
      notes: { orderBy: { createdAt: "asc" } },
      actionItems: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!meeting) throw new HttpError(404, "Meeting not found.");

  res.json({ success: true, data: { meeting } });
}

async function updateMeeting(req, res) {
  const parsed = updateSchema.safeParse(req.body);

  if (!parsed.success || Object.keys(req.body || {}).length === 0) {
    throw new HttpError(400, "Provide valid fields to update.");
  }

  const existing = await prisma.meeting.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    select: { id: true },
  });

  if (!existing) throw new HttpError(404, "Meeting not found.");

  const data = { ...parsed.data };

  if (data.meetingDate) data.meetingDate = new Date(data.meetingDate);

  const meeting = await prisma.meeting.update({
    where: { id: existing.id },
    data,
  });

  res.json({ success: true, data: { meeting } });
}

async function deleteMeeting(req, res) {
  const result = await prisma.meeting.deleteMany({
    where: { id: req.params.id, ownerId: req.user.id },
  });

  if (result.count === 0) throw new HttpError(404, "Meeting not found.");

  res.json({ success: true, message: "Meeting deleted successfully." });
}

module.exports = {
  createMeeting,
  listMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
};