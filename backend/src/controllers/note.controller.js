const { z } = require("zod");
const prisma = require("../config/prisma");
const HttpError = require("../utils/http-error");

async function findOwnedMeeting(meetingId, userId) {
  const meeting = await prisma.meeting.findFirst({
    where: { id: meetingId, ownerId: userId },
    select: { id: true },
  });

  if (!meeting) throw new HttpError(404, "Meeting not found.");
  return meeting;
}

async function createNote(req, res) {
  const parsed = z.object({
    content: z.string().trim().min(1).max(50000),
  }).safeParse(req.body);

  if (!parsed.success) throw new HttpError(400, "Note content is required.");

  await findOwnedMeeting(req.params.id, req.user.id);

  const note = await prisma.meetingNote.create({
    data: {
      meetingId: req.params.id,
      content: parsed.data.content,
    },
  });

  res.status(201).json({ success: true, data: { note } });
}

async function updateNote(req, res) {
  const parsed = z.object({
    content: z.string().trim().min(1).max(50000),
  }).safeParse(req.body);

  if (!parsed.success) throw new HttpError(400, "Valid note content is required.");

  await findOwnedMeeting(req.params.id, req.user.id);

  const result = await prisma.meetingNote.updateMany({
    where: { id: req.params.noteId, meetingId: req.params.id },
    data: { content: parsed.data.content },
  });

  if (!result.count) throw new HttpError(404, "Note not found.");

  const note = await prisma.meetingNote.findUnique({
    where: { id: req.params.noteId },
  });

  res.json({ success: true, data: { note } });
}

async function deleteNote(req, res) {
  await findOwnedMeeting(req.params.id, req.user.id);

  const result = await prisma.meetingNote.deleteMany({
    where: { id: req.params.noteId, meetingId: req.params.id },
  });

  if (!result.count) throw new HttpError(404, "Note not found.");

  res.json({ success: true, message: "Note deleted successfully." });
}

module.exports = { createNote, updateNote, deleteNote };