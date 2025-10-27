import { ValidationPipe } from './validation.pipe';
import { z } from 'zod';

describe('ValidationPipe', () => {
  it('should be defined', () => {
    const mockSchema = z.object({ test: z.string() });
    expect(new ValidationPipe(mockSchema)).toBeDefined();
  });
});
