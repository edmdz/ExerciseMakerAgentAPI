// Recibe peticiones HTTP, delega al Orquestador
import { Request, Response } from 'express';
import { agentOrchestrator } from '../../core/agent/agent.orchestrator';
import { SseService } from '../../core/agent/sse.service';
import { sessionService } from '../../core/session/session.service';

/**
 * Handles the streaming chat endpoint.
 * Its only job is to validate the request, instantiate services,
 * and delegate the core logic to the AgentOrchestrator.
 */
export const handleStreamChat = (req: Request, res: Response): void => {
  // 1. Validate request
  const { message } = req.body;
  const sessionId = req.headers['session-id'] as string || `session_${Date.now()}`;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message must be a non-empty string.' });
    return;
  }

  // 2. Instantiate the SSE service for this specific request
  const sseService = new SseService(res);

  // 3. Delegate to the orchestrator. No `await` is needed because
  //    the method handles the response stream itself.
  agentOrchestrator.processUserMessage(message, sessionId, sseService);
};

/**
 * Handles clearing the memory for a specific session.
 */
export const clearChatMemory = (req: Request, res: Response): void => {
    const sessionId = req.headers['session-id'] as string;
    if (!sessionId) {
        res.status(400).json({ error: 'session-id header is required.' });
        return;
    }

    const wasCleared = sessionService.clearSession(sessionId);
    if (wasCleared) {
        res.status(200).json({ success: true, message: `Session ${sessionId} cleared.` });
    } else {
        res.status(404).json({ success: false, message: `Session ${sessionId} not found.` });
    }
};