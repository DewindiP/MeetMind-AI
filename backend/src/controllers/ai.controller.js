const prisma = require("../config/prisma");
const HttpError = require("../utils/http-error");
const { generateMeetingSummary } = require("../services/ai.service");

async function generateSummary(req, res) {
  const meeting = await prisma.meeting.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    include: {
      notes: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!meeting) throw new HttpError(404, "Meeting not found.");

  const combinedNotes = [
    meeting.rawNotes || "",
    ...meeting.notes.map((note) => note.content),
  ].filter(Boolean).join("\n\n");

  if (!combinedNotes.trim()) {
    throw new HttpError(400, "Add meeting notes before generating a summary.");
  }

  const result = await generateMeetingSummary({
    title: meeting.title,
    description: meeting.description,
    attendees: meeting.attendees,
    notes: combinedNotes.slice(0, 30000),
  });

  const updatedMeeting = await prisma.meeting.update({
    where: { id: meeting.id },
    data: {
      summary: result.summary,
      decisions: result.decisions,
    },
  });

  res.json({
    success: true,
    data: {
      meeting: updatedMeeting,
      suggestedActionItems: result.actionItems,
    },
  });
}

module.exports = { generateSummary };