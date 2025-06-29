
import { ExerciseService } from '../exercise.service';
import { ExerciseRepository } from '../exercise.repository';
import { IExercise } from '../types/exercise.types';

// Mocking ExerciseRepository
jest.mock('../exercise.repository');
const MockedExerciseRepository = ExerciseRepository as jest.MockedClass<typeof ExerciseRepository>;

const mockExercises: IExercise[] = [
  { id: '0001', name: '3/4 sit-up', bodyPart: 'waist', equipment: 'body weight', target: 'abs', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0001.gif', instructions: [] },
  { id: '0002', name: '45° side bend', bodyPart: 'waist', equipment: 'body weight', target: 'abs', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0002.gif', instructions: [] },
  { id: '1368', name: 'weighted russian twist', bodyPart: 'waist', equipment: 'weighted', target: 'abs', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/1368.gif', instructions: [] },
  { id: '0211', name: 'barbell press', bodyPart: 'chest', equipment: 'barbell', target: 'pectorals', gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0211.gif', instructions: [] },
];

describe('ExerciseService', () => {
  let service: ExerciseService;
  let repositoryMock: jest.Mocked<ExerciseRepository>;

  beforeEach(() => {
    repositoryMock = new MockedExerciseRepository() as jest.Mocked<ExerciseRepository>;
    service = new ExerciseService(repositoryMock);
  });

  it('should filter exercises sequentially', async () => {
    repositoryMock.findByCriteria.mockResolvedValue(mockExercises.filter(e => e.bodyPart === 'waist'));

    const result = await service.findExercises({ bodyPart: 'waist', target: 'abs', equipment: 'weighted' });

    expect(repositoryMock.findByCriteria).toHaveBeenCalledWith({ bodyPart: 'waist', target: 'abs', equipment: 'weighted' });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1368');
  });

  it('should return an exercise by id', async () => {
    repositoryMock.findAll.mockResolvedValue(mockExercises);

    const result = await service.getExerciseDetails('0211');

    expect(repositoryMock.findAll).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result?.id).toBe('0211');
  });
});
