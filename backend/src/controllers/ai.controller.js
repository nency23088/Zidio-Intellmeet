import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import Meeting from '../models/Meeting.js';
import Transcript from '../models/Transcript.js';
import AISummary from '../models/AISummary.js';
import MeetingActionItem from '../models/MeetingActionItem.js';
import ChatMessage from '../models/ChatMessage.js';
import * as meetingIntelligence from '../services/ai/meeting-intelligence.service.js';
import { getIO } from '../socket/index.js';

/**
 * Check if user can access a meeting.
 */
async function assertMeetingAccess(meetingId, userId, role) {
  const meeting = await Meeting.findById(meetingId).lean();
  if (!meeting) throw new AppError('Meeting not found', 404);
  if (role === 'admin') return meeting;
  const isHost = String(meeting.host) === userId;
  const isParticipant = meeting.participants.some((p) => String(p) === userId);
  if (!isHost && !isParticipant) throw new AppError('Access denied', 403);
  return meeting;
}

/**
 * POST /api/ai/transcribe/:meetingId — Upload audio and transcribe.
 */
export const transcribeMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  await assertMeetingAccess(meetingId, req.auth.userId, req.auth.role);

  if (!req.file) throw new AppError('Audio file is required', 400);

  const result = await meetingIntelligence.processMeeting(
    meetingId,
    req.file.buffer,
    req.file.originalname || 'audio.webm',
    (progress) => {
      try {
        const io = getIO();
        io.to(`meeting:${meetingId}`).emit('ai-progress', progress);
      } catch {}
    }
  );

  res.status(200).json({
    message: 'Meeting processed successfully',
    data: result,
  });
});

/**
 * POST /api/ai/summarize/:meetingId — Generate summary from transcript.
 */
export const summarizeMeeting = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  await assertMeetingAccess(meetingId, req.auth.userId, req.auth.role);

  // Get existing transcript
  const transcript = await Transcript.findOne({ meeting: meetingId, status: 'completed' });
  if (!transcript) throw new AppError('No transcript found for this meeting', 404);

  const summary = await meetingIntelligence.generateSummaryFromText(
    meetingId,
    transcript.fullText
  );

  try {
    const io = getIO();
    io.to(`meeting:${meetingId}`).emit('ai-summary-ready', {
      meetingId,
      summary: summary.summary,
    });
  } catch {}

  res.status(200).json({ message: 'Summary generated', data: summary });
});

/**
 * GET /api/ai/summary/:meetingId — Get AI summary.
 */
export const getSummary = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  await assertMeetingAccess(meetingId, req.auth.userId, req.auth.role);

  const summary = await AISummary.findOne({ meeting: meetingId }).lean();
  res.status(200).json({ data: summary || null });
});

/**
 * GET /api/ai/transcript/:meetingId — Get transcript.
 */
export const getTranscript = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  await assertMeetingAccess(meetingId, req.auth.userId, req.auth.role);

  const transcript = await Transcript.findOne({ meeting: meetingId }).lean();
  res.status(200).json({ data: transcript || null });
});

/**
 * GET /api/ai/action-items/:meetingId — Get action items.
 */
export const getActionItems = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  await assertMeetingAccess(meetingId, req.auth.userId, req.auth.role);

  const items = await MeetingActionItem.find({ meeting: meetingId })
    .sort({ priority: -1, createdAt: -1 })
    .lean();
  res.status(200).json({ data: items });
});

/**
 * GET /api/ai/chat-history/:meetingId — Get chat history for a meeting.
 */
export const getChatHistory = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;
  await assertMeetingAccess(meetingId, req.auth.userId, req.auth.role);

  const messages = await ChatMessage.find({ meeting: meetingId })
    .sort({ createdAt: 1 })
    .limit(500)
    .lean();

  const formatted = messages.map((msg) => ({
    _id: msg._id.toString(),
    meetingId: String(msg.meeting),
    senderId: String(msg.sender),
    senderName: msg.senderName,
    text: msg.content,
    type: msg.type,
    timestamp: msg.createdAt.toISOString(),
    reactions: msg.reactions || [],
  }));

  res.status(200).json({ data: formatted });
});
