/**
 * Representa un ejercicio específico dentro de un día de entrenamiento,
 * incluyendo las series, repeticiones y notas asignadas por el LLM.
 */
export interface IDailyExercise {
  id: string;      // ID para enlazar con los detalles completos del ejercicio (IExercise)
  name: string;    // Nombre del ejercicio para mostrar rápidamente
  sets: number;
  reps: string;    // Se mantiene como string para rangos como "8-12" o "al fallo"
  note?: string;   // Nota opcional del entrenador IA sobre técnica o enfoque
}

/**
 * Representa el plan de entrenamiento para un día específico.
 */
export interface IDailyWorkout {
  day: number;
  dayTitle: string;        // ej. "Día 1: Empuje - Pecho, Hombros y Tríceps"
  dayFocus: string;        // ej. "Pecho y Tríceps"
  exercises: IDailyExercise[];
}

/**
 * La estructura completa de la rutina de ejercicios que se genera
 * y se envía al cliente. Esta es la "forma" de los argumentos de la
 * función `create_exercise_routine` que el LLM debe rellenar.
 */
export interface IExerciseRoutine {
  routineTitle: string;
  introduction: string; // Mensaje de bienvenida y presentación de la rutina
  summary: {
    level: 'Principiante' | 'Intermedio' | 'Avanzado';
    mainGoal: string;
    frequency: number; // Días por semana
    durationPerSession: string; // ej. "45-60 minutos"
    equipment: string; // ej. "Gimnasio completo", "Solo mancuernas"
  };
  dailyWorkouts: IDailyWorkout[];
  finalNotes: {
    warmUp: string;
    coolDown: string;
    progression: string; // Cómo el usuario debe progresar
    technique: string;
    rest: string; // Descanso entre días
  };
  conclusion: string; // Mensaje final motivador
}
