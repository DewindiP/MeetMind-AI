const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/async-handler");
const meetingController = require("../controllers/meeting.controller");
const noteController = require("../controllers/note.controller");
const actionItemController = require("../controllers/action-item.controller");
const aiController = require("../controllers/ai.controller");

router.use(authenticate);

router.post("/", asyncHandler(meetingController.createMeeting));
router.get("/", asyncHandler(meetingController.listMeetings));
router.get("/:id", asyncHandler(meetingController.getMeeting));
router.patch("/:id", asyncHandler(meetingController.updateMeeting));
router.delete("/:id", asyncHandler(meetingController.deleteMeeting));

router.post("/:id/notes", asyncHandler(noteController.createNote));
router.patch("/:id/notes/:noteId", asyncHandler(noteController.updateNote));
router.delete("/:id/notes/:noteId", asyncHandler(noteController.deleteNote));

router.post("/:id/action-items", asyncHandler(actionItemController.createActionItem));
router.patch("/:id/action-items/:itemId", asyncHandler(actionItemController.updateActionItem));
router.delete("/:id/action-items/:itemId", asyncHandler(actionItemController.deleteActionItem));

router.post("/:id/ai-summary", asyncHandler(aiController.generateSummary));

module.exports = router;