import { IExercise } from './types/exercise.types';
import { BodyPart, Equipment, Target } from './types/exercise.enums';
import * as fs from 'fs';
import * as path from 'path';

export interface IExerciseRepository {
  findAll(): Promise<IExercise[]>;
  findByCriteria(filters: { bodyPart?: BodyPart, target?: Target, equipment?: Equipment }): Promise<IExercise[]>;
}

export class ExerciseRepository implements IExerciseRepository {
  private exercises: IExercise[] = [];

  constructor(private readonly filePath: string = path.join(__dirname, '../../../exercises.json')) {
    this.loadExercises();
  }

  private loadExercises(): void {
    try {
      const rawData = fs.readFileSync(this.filePath, 'utf-8');
      this.exercises = JSON.parse(rawData);
    } catch (error) {
      console.error('Failed to load or parse exercises.json:', error);
      this.exercises = [];
    }
  }

  async findAll(): Promise<IExercise[]> {
    return this.exercises;
  }

  async findByCriteria(filters: { bodyPart?: BodyPart, target?: Target, equipment?: Equipment }): Promise<IExercise[]> {
    const { bodyPart, target, equipment } = filters;

    if (bodyPart) {
      return this.exercises.filter(ex => ex.bodyPart === bodyPart);
    }
    if (target) {
      return this.exercises.filter(ex => ex.target === target);
    }
    if (equipment) {
      return this.exercises.filter(ex => ex.equipment === equipment);
    }
    
    return this.exercises;
  }
}