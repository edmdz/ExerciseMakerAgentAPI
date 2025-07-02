import { Router } from 'express';
import { handleStreamChat, clearChatMemory } from '../controllers/chat.controller';

const router = Router();

/**
 * @route POST /api/chat/stream
 * @description Main endpoint to chat with the AI and receive real-time events.
 */
router.post('/stream', handleStreamChat);

/**
 * @route DELETE /api/chat/memory
 * @description Clears the conversation history for a given session.
 */
router.delete('/memory', clearChatMemory);

export default router;