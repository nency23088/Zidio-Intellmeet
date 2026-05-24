import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import {
  transcribeMeeting,
  summarizeMeeting,
  getSummary,
  getTranscript,
  getActionItems,
  getChatHistory,
} from '../controllers/ai.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.use(protect);

router.post('/transcribe/:meetingId', upload.single('audio'), transcribeMeeting);
router.post('/summarize/:meetingId', summarizeMeeting);
router.get('/summary/:meetingId', getSummary);
router.get('/transcript/:meetingId', getTranscript);
router.get('/action-items/:meetingId', getActionItems);
router.get('/chat-history/:meetingId', getChatHistory);

export default router;
