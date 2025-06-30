import { Response } from 'express';
import { ISseEvent, ISseService } from './types/sse.types';

/**
 * Implements the ISseService interface to handle Server-Sent Events (SSE).
 * This service abstracts the Express `res` object, providing a clean interface
 * for sending formatted events to the client.
 */
export class SseService implements ISseService {
  /**
   * @param res The Express response object to write events to.
   */
  constructor(private res: Response) {
    // Set the necessary headers to establish an SSE connection.
    this.res.setHeader('Content-Type', 'text/event-stream');
    this.res.setHeader('Cache-Control', 'no-cache');
    this.res.setHeader('Connection', 'keep-alive');
    this.res.flushHeaders(); // Send headers immediately.
  }

  /**
   * Sends a structured event to the client.
   * The event object is serialized to JSON and formatted according to the SSE protocol.
   * @param event The event object to send, conforming to the ISseEvent interface.
   */
  send<T>(event: ISseEvent<T>): void {
    if (this.res.writableEnded) {
        console.warn('Attempted to write to a closed SSE stream.');
        return;
    }
    const jsonString = JSON.stringify(event);
    this.res.write(`data: ${jsonString}\n\n`);
  }

  /**
   * Closes the SSE connection gracefully.
   */
  close(): void {
    if (!this.res.writableEnded) {
        this.res.end();
    }
  }
}