import { IExercise } from './types/exercise.types';
import { BodyPart, Equipment, Target } from './types/exercise.enums';
import { ExerciseRepository, IExerciseRepository } from './exercise.repository';

export class ExerciseService {
  constructor(private readonly exerciseRepository: IExerciseRepository = new ExerciseRepository()) {}

  async findExercises(filters: { bodyPart?: BodyPart, target?: Target, equipment?: Equipment }): Promise<IExercise[]> {
    let exercises = await this.exerciseRepository.findByCriteria(filters);

    if (filters.target) {
      exercises = exercises.filter(ex => ex.target === filters.target);
    }

    if (filters.equipment) {
      exercises = exercises.filter(ex => ex.equipment === filters.equipment);
    }

    return exercises;
  }

  async getExerciseDetails(id: string): Promise<IExercise | undefined> {
    const exercises = await this.exerciseRepository.findAll();
    return exercises.find(ex => ex.id === id);
  }
}