
import { SessionService } from '../session.service';
import { IHistoryEntry } from '../session.interface';

// Use fake timers to control setInterval and Date.now()
jest.useFakeTimers();

describe('SessionService', () => {
  let sessionService: SessionService;
  const sessionId = 'test-session-123';
  const mockHistory: IHistoryEntry[] = [
    { role: 'user', parts: [{ text: 'Hello' }] },
    { role: 'model', parts: [{ text: 'Hi there!' }] },
  ];

  beforeEach(() => {
    sessionService = new SessionService();
  });

  afterEach(() => {
    sessionService.stopCleanup(); // Stop the timer after each test
    jest.clearAllTimers();
  });

  it('should return an empty array for a new session', () => {
    const history = sessionService.getHistory('new-session');
    expect(history).toEqual([]);
  });

  it('should update and retrieve a session history', () => {
    sessionService.updateHistory(sessionId, mockHistory);
    const history = sessionService.getHistory(sessionId);
    expect(history).toEqual(mockHistory);
  });

  it('should clear a session successfully', () => {
    sessionService.updateHistory(sessionId, mockHistory);
    const wasCleared = sessionService.clearSession(sessionId);
    const history = sessionService.getHistory(sessionId);

    expect(wasCleared).toBe(true);
    expect(history).toEqual([]);
  });

  it('should return false when trying to clear a non-existent session', () => {
    const wasCleared = sessionService.clearSession('non-existent');
    expect(wasCleared).toBe(false);
  });

  it('should not clear a session before it expires', () => {
    sessionService.updateHistory(sessionId, mockHistory);

    // Advance timers by less than the expiration time
    jest.advanceTimersByTime(15 * 60 * 1000); // 15 minutes

    const history = sessionService.getHistory(sessionId);
    expect(history).toEqual(mockHistory);
  });

  it('should automatically clear a session after it expires', () => {
    sessionService.updateHistory(sessionId, mockHistory);

    // Advance timers just past the expiration time (30 mins) and the cleanup interval (5 mins)
    jest.advanceTimersByTime(35 * 60 * 1000 + 1);

    const history = sessionService.getHistory(sessionId);
    expect(history).toEqual([]);
  });

  it('should reset the expiration timer on history update', () => {
    sessionService.updateHistory(sessionId, mockHistory);

    // Advance time by 20 minutes
    jest.advanceTimersByTime(20 * 60 * 1000);

    // Update the history again, which should reset the timer
    sessionService.updateHistory(sessionId, [...mockHistory, { role: 'user', parts: [{ text: 'Another message' }] }]);

    // Advance time by another 20 minutes. The session should still be alive.
    jest.advanceTimersByTime(20 * 60 * 1000);

    const history = sessionService.getHistory(sessionId);
    expect(history.length).toBe(3);
  });
});
