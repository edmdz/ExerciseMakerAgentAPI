/**
 * Define los tipos de eventos permitidos que el backend puede enviar al cliente
 * a través de Server-Sent Events, según el protocolo de comunicación.
 */
export type SseEventType =
  | 'status_update'
  | 'error'
  | 'agent_message_start'
  | 'text_chunk'
  | 'agent_message_end'
  | 'ui_action';

/**
 * Estructura genérica para cualquier evento SSE.
 * @template T El tipo del payload específico para este evento.
 */
export interface ISseEvent<T> {
  type: SseEventType;
  payload: T;
}

// --- Definiciones de Payloads Específicos ---
export interface IStatusUpdatePayload {
  message: string; // ej. "Buscando ejercicios..."
}

export interface IErrorPayload {
  message: string; // Mensaje de error para mostrar al usuario
}

export interface ITextChunkPayload {
  content: string; // Fragmento del texto de la IA
}

/**
 * Payload para el evento que comanda a la UI a realizar una acción compleja.
 * @template D El tipo de los datos necesarios para la acción.
 */
export interface IUiActionPayload<D> {
  action_name: 'build_routine'; // En el futuro podría haber más acciones
  data: D;
}

// --- Interfaces para los servicios ---
/**
 * Define el contrato para el servicio que gestiona el envío de eventos SSE.
 * Esto permite desacoplar el orquestador del objeto `res` de Express.
 */
export interface ISseService {
  send<T>(event: ISseEvent<T>): void;
  close(): void;
}
