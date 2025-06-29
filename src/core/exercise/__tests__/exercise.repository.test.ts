
import { ExerciseRepository } from '../exercise.repository';
import { IExercise } from '../types/exercise.types';
import * as fs from 'fs';

// Mocking fs.readFileSync
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

const mockExercises: IExercise[] = [
  { id: '0001', name: '3/4 sit-up', bodyPart: 'waist', equipment: 'body weight', target: 'abs', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0001.gif', instructions: [] },
  { id: '0002', name: '45° side bend', bodyPart: 'waist', equipment: 'body weight', target: 'abs', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0002.gif', instructions: [] },
  { id: '1368', name: 'weighted russian twist', bodyPart: 'waist', equipment: 'weighted', target: 'abs', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/1368.gif', instructions: [] },
  { id: '0211', name: 'barbell press', bodyPart: 'chest', equipment: 'barbell', target: 'pectorals', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0211.gif', instructions: [] },
];

describe('ExerciseRepository', () => {
  beforeEach(() => {
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockExercises));
  });

  it('should load exercises from a file', async () => {
    const repo = new ExerciseRepository();
    const exercises = await repo.findAll();
    expect(exercises.length).toBe(4);
  });

  it('should find exercises by bodyPart', async () => {
    const repo = new ExerciseRepository();
    const exercises = await repo.findByCriteria({ bodyPart: 'chest' });
    expect(exercises.length).toBe(1);
    expect(exercises[0].bodyPart).toBe('chest');
  });

  it('should find exercises by target', async () => {
    const repo = new ExerciseRepository();
    const exercises = await repo.findByCriteria({ target: 'abs' });
    expect(exercises.length).toBe(3);
  });

  it('should find exercises by equipment', async () => {
    const repo = new ExerciseRepository();
    const exercises = await repo.findByCriteria({ equipment: 'barbell' });
    expect(exercises.length).toBe(1);
  });

  it('should return all exercises if no criteria is provided', async () => {
    const repo = new ExerciseRepository();
    const exercises = await repo.findByCriteria({});
    expect(exercises.length).toBe(4);
  });
});
