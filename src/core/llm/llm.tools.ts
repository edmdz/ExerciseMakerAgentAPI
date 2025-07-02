import { FunctionDeclaration } from '@google/genai';
import { bodyParts, equipments, targets } from '../exercise/types/exercise.enums';

/**
 * Defines the schema for the `find_exercises` tool.
 * This tool allows the agent to search for exercises based on specific criteria.
 */
export const findExercisesTool = {
  name: 'find_exercises',
  description: 'Busca en la base de datos una lista de ejercicios que coincidan con los criterios del usuario.',
  parameters: {
    type: 'object',
    properties: {
      bodyParts: {
        type: 'array',
        description: 'List of main body parts to be exercised. At least one is required',
        items: {
          type: 'string',
          enum: bodyParts,
        },
      },
      equipments: {
        type: 'array',
        description: 'List of equipment types available or preferred for the exercises.',
        items: {
          type: 'string',
          enum: equipments,
        },
      },
      targets: {
        type: 'array',
        description: 'List of specific muscles or more detailed targets.',
        items: {
          type: 'string',
          enum: targets,
        },
      },
    },
    required: ['bodyParts'],
  },
};

/**
 * Defines the schema for the `create_exercise_routine` tool.
 * This tool structures the final exercise routine. The schema mirrors the IExerciseRoutine interface.
 */
export const createExerciseRoutineTool = {
  name: 'create_exercise_routine',
  description: 'Usa esta función para ensamblar la rutina de ejercicios final una vez que tengas la lista de ejercicios de la herramienta `find_exercises`.',
  parameters: {
    type: 'object',
    properties: {
      routineTitle: { type: 'string', description: 'Título principal para la rutina de ejercicios.' },
      introduction: { type: 'string', description: 'Mensaje de bienvenida y presentación de la rutina.' },
      summary: {
        type: 'object',
        properties: {
          level: { type: 'string', enum: ['Principiante', 'Intermedio', 'Avanzado'] },
          mainGoal: { type: 'string', description: 'El objetivo principal de la rutina.' },
          frequency: { type: 'number', description: 'Días de entrenamiento por semana.' },
          durationPerSession: { type: 'string', description: 'Duración estimada por sesión (ej. \'45-60 minutos\').' },
          equipment: { type: 'string', description: 'Equipamiento general requerido (ej. \'Gimnasio completo\').' },
        },
        required: ['level', 'mainGoal', 'frequency', 'durationPerSession', 'equipment'],
      },
      dailyWorkouts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day: { type: 'number', description: 'Número del día de entrenamiento.' },
            dayTitle: { type: 'string', description: 'Título para el día de entrenamiento (ej. \'Día 1: Empuje\').' },
            dayFocus: { type: 'string', description: 'Músculos principales a trabajar ese día.' },
            exercises: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'ID del ejercicio de la base de datos.' },
                  name: { type: 'string', description: 'Nombre del ejercicio.' },
                  sets: { type: 'number', description: 'Número de series.' },
                  reps: { type: 'string', description: 'Rango de repeticiones (ej. \'8-12\').' },
                  note: { type: 'string', description: 'Nota opcional sobre la técnica o el enfoque.' },
                },
                required: ['id', 'name', 'sets', 'reps'],
              },
            },
          },
          required: ['day', 'dayTitle', 'dayFocus', 'exercises'],
        },
      },
      finalNotes: {
        type: 'object',
        properties: {
          warmUp: { type: 'string', description: 'Instrucciones para el calentamiento.' },
          coolDown: { type: 'string', description: 'Instrucciones para el enfriamiento.' },
          progression: { type: 'string', description: 'Cómo el usuario debe progresar.' },
          technique: { type: 'string', description: 'Consejos generales de técnica.' },
          rest: { type: 'string', description: 'Recomendaciones de descanso entre días.' },
        },
        required: ['warmUp', 'coolDown', 'progression', 'technique', 'rest'],
      },
      conclusion: { type: 'string', description: 'Mensaje final motivador.' },
    },
    required: ['routineTitle', 'introduction', 'summary', 'dailyWorkouts', 'finalNotes', 'conclusion'],
  },
};

/**
 * An array containing all the tools available to the agent.
 */
export const agentTools = [findExercisesTool as FunctionDeclaration, createExerciseRoutineTool as FunctionDeclaration];