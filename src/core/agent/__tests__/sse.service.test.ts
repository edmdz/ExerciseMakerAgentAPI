import { SseService } from '../sse.service';
import { ISseEvent, IStatusUpdatePayload } from '../types/sse.types';
import { Response } from 'express';

// Create a mock Express Response object
const createMockResponse = () => {
  const res: Partial<Response> = {
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    writableEnded: false,
  };
  return res as Response;
};

describe('SseService', () => {
  let mockResponse: Response;
  let sseService: SseService;

  beforeEach(() => {
    mockResponse = createMockResponse();
    sseService = new SseService(mockResponse);
  });

  it('should set the correct SSE headers upon instantiation', () => {
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
    expect(mockResponse.flushHeaders).toHaveBeenCalledTimes(1);
  });

  it('should send a correctly formatted event string to the response stream', () => {
    const event: ISseEvent<IStatusUpdatePayload> = {
      type: 'status_update',
      payload: { message: 'Test in progress...' },
    };

    sseService.send(event);

    const expectedJsonString = JSON.stringify(event);
    const expectedSseFormat = `data: ${expectedJsonString}\n\n`;

    expect(mockResponse.write).toHaveBeenCalledTimes(1);
    expect(mockResponse.write).toHaveBeenCalledWith(expectedSseFormat);
  });

  it('should close the response stream when close() is called', () => {
    sseService.close();
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
  });

  it('should not attempt to write to a closed stream', () => {
    // Simulate a closed stream
    (mockResponse as any).writableEnded = true;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const event: ISseEvent<IStatusUpdatePayload> = {
      type: 'status_update',
      payload: { message: 'This should not be sent' },
    };

    sseService.send(event);

    expect(mockResponse.write).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Attempted to write to a closed SSE stream.');
    consoleWarnSpy.mockRestore();
  });

  it('should not attempt to close a stream that is already closed', () => {
    (mockResponse as any).writableEnded = true;
    sseService.close();
    expect(mockResponse.end).not.toHaveBeenCalled();
  });
});
