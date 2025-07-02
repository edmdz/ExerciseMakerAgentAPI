import { FunctionCall } from '@google/genai';
import { ISessionService } from '../session/session.interface';
import { ExerciseService } from '../exercise/exercise.service';
import { GeminiService } from '../llm/gemini.service';
import { ISseService } from './types/sse.types';
import { agentTools } from '../llm/llm.tools';
import { systemPrompt } from '../llm/llm.prompts';

/**
 * The AgentOrchestrator is the main brain of the application.
 * It coordinates the conversation flow, tool execution, and communication
 * with the client via SSE.
 */
export class AgentOrchestrator {
  constructor(
    // Dependency Injection for easier testing and maintenance
    private readonly sessionService: ISessionService,
    private readonly exerciseService: ExerciseService,
    private readonly geminiService: GeminiService,
  ) { }

  /**
   * Processes a user's message, orchestrating the entire AI response.
   * @param message The text from the user.
   * @param sessionId The unique ID for the user's session.
   * @param sseService The service to send real-time events to the client.
   */
  async processUserMessage(
    message: string,
    sessionId: string,
    sseService: ISseService,
  ): Promise<void> {
    try {
      const history = this.sessionService.getHistory(sessionId);
      history.push({ role: 'user', parts: [{ text: message }] });

      let shouldContinueProcessing = true;
      let isFirstTextChunk = true;

      // The "Tool Cycle": This loop continues as long as a tool (like find_exercises)
      // indicates that more processing is needed.
      while (shouldContinueProcessing) {
        shouldContinueProcessing = false; // Assume we'll stop unless a tool tells us otherwise.
        let executedFunctionCall: FunctionCall | null = null;

        const stream = this.geminiService.generateStream(history, agentTools, systemPrompt);

        for await (const part of stream) {
          if (part.text) {
            // If this is the first piece of text we're sending, start the message block.
            if (isFirstTextChunk) {
              sseService.send({ type: 'agent_message_start', payload: {} });
              isFirstTextChunk = false;
            }
            sseService.send({ type: 'text_chunk', payload: { content: part.text } });
          }

          if (part.functionCall) {
            // A function call was received. We'll execute it after the stream finishes.
            executedFunctionCall = part.functionCall;
          }
        }

        // --- Stream for this turn is complete, now execute tools if any ---
        if (executedFunctionCall) {
          const { name = '', args } = executedFunctionCall;
          history.push({ role: 'model', parts: [{ functionCall: { name, args } }] });

          switch (name) {
            case 'find_exercises':
              console.log(`[AgentOrchestrator] Executing tool: ${name}`);
              sseService.send({ type: 'status_update', payload: { message: 'Buscando ejercicios...' } });

              const exercises = await this.exerciseService.findExercises(args || {});

              history.push({
                role: 'function',
                parts: [{ functionResponse: { name, response: { exercises } } }],
              });

              // Crucial: Tell the loop to run again because the agent now needs to process
              // the exercise list to create a routine.
              shouldContinueProcessing = true;
              break;

            case 'create_exercise_routine':
              console.log(`[AgentOrchestrator] Executing tool: ${name}`);
              sseService.send({ type: 'status_update', payload: { message: '¡Rutina lista! Presentando...' } });

              // We don't "execute" this tool. We use its arguments as the final payload.
              sseService.send({
                type: 'ui_action',
                payload: { action_name: 'build_routine', data: args },
              });

              // The final routine is the last function response we need to record.
              history.push({
                role: 'function',
                parts: [{ functionResponse: { name, response: { success: true } } }],
              });
              break;

            default:
              console.warn(`[AgentOrchestrator] Unknown tool called: ${name}`);
            // Handle unknown tool case if necessary
          }
        }
      } // End of while loop

      // If we sent any text, make sure to close the message block.
      if (!isFirstTextChunk) {
        sseService.send({ type: 'agent_message_end', payload: {} });
      }

      this.sessionService.updateHistory(sessionId, history);

    } catch (error) {
      console.error('[AgentOrchestrator] An error occurred:', error);
      sseService.send({ type: 'error', payload: { message: 'Ha ocurrido un error al procesar tu solicitud.' } });
    } finally {
      console.log(`[AgentOrchestrator] Closing SSE stream for session ${sessionId}.`);
      sseService.close();
    }
  }
}

// --- Singleton Pattern ---
// We create a single instance of the orchestrator and its dependencies
// to be used throughout the application.

import { sessionService } from '../session/session.service';
import { geminiService } from '../llm/gemini.service';
import { ExerciseRepository } from '../exercise/exercise.repository';

export const agentOrchestrator = new AgentOrchestrator(
  sessionService,
  new ExerciseService(new ExerciseRepository()),
  geminiService,
);