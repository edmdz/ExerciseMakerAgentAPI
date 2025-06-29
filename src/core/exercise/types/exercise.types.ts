/**
 * Representa un único ejercicio con toda su información detallada.
 * Esta estructura corresponde a la información almacenada en la base de datos
 * (o el archivo exercises.json).
 */
export interface IExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  gifUrl: string;
  instructions: string[];
  secondaryMuscles?: string[]; // Opcional, para más detalle
  category?: string;          // Opcional, ej. "strength", "cardio"
}
