import { FunctionCall } from '@google/genai';

/**
 * Representa una parte del stream de respuesta de Gemini.
 * Puede contener texto o una llamada a función.
 */
export interface IGeminiStreamPart {
  text?: string;
  functionCall?: FunctionCall;
} 