import { IHistoryEntry, ISessionService } from './session.interface';

// 30 minutes in milliseconds
const SESSION_EXPIRATION_TIME = 30 * 60 * 1000; 
// Cleanup interval (e.g., every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

interface ISessionData {
  history: IHistoryEntry[];
  expiresAt: number;
}

class SessionService implements ISessionService {
  private sessions: Map<string, ISessionData> = new Map();
  private cleanupTimer: NodeJS.Timeout;

  constructor() {
    this.cleanupTimer = setInterval(() => {
      this.clearExpiredSessions();
    }, CLEANUP_INTERVAL);
  }

  getHistory(sessionId: string): IHistoryEntry[] {
    const session = this.sessions.get(sessionId);
    return session ? session.history : [];
  }

  updateHistory(sessionId: string, history: IHistoryEntry[]): void {
    const newExpiresAt = Date.now() + SESSION_EXPIRATION_TIME;
    const sessionData: ISessionData = {
      history,
      expiresAt: newExpiresAt,
    };
    this.sessions.set(sessionId, sessionData);
  }

  clearSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  private clearExpiredSessions(): void {
    const now = Date.now();
    console.log('Running session cleanup...');
    for (const [sessionId, sessionData] of this.sessions.entries()) {
      if (now > sessionData.expiresAt) {
        this.sessions.delete(sessionId);
        console.log(`Expired session ${sessionId} has been cleared.`);
      }
    }
  }

  // Method to gracefully stop the cleanup timer (e.g., during shutdown)
  public stopCleanup(): void {
    clearInterval(this.cleanupTimer);
  }
}

export const sessionService = new SessionService();