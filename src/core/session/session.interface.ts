/**
 * Define el formato de una parte de la conversación, compatible con Gemini.
 */
export interface IConversationPart {
    text?: string;
    functionCall?: { name: string; args: any; };
    functionResponse?: { name: string; response: any; };
}

/**
 * Define una entrada completa en el historial de conversación.
 */
export interface IHistoryEntry {
    role: 'user' | 'model' | 'function';
    parts: IConversationPart[];
}

/**
 * Define el contrato para el servicio de gestión de sesiones/memoria.
 * La implementación inicial será en memoria, pero esta interfaz permite
 * cambiarla a Redis o una base de datos sin afectar al resto del sistema.
 */
export interface ISessionService {
  getHistory(sessionId: string): IHistoryEntry[];
  updateHistory(sessionId: string, history: IHistoryEntry[]): void;
  clearSession(sessionId: string): boolean;
}
