import z from 'zod';

export const zodLoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const zodRegisterSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const zodProblemSchema = z.object({
  title: z.string().nonempty('Title is required').min(3, 'Title must be at least 3 characters'),

  description: z.string().min(10, 'Description must be at least 10 characters'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  companies: z.array(z.string()).optional(),
  constraints: z.string().min(1, 'Constraints are required'),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      })
    )
    .min(1, 'At least one test case is required'),
  examples: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().min(1, 'Explanation is required'),
      })
    )
    .min(1, 'At least one test case is required'),
  codeSnippets: z
    .object({
      JAVASCRIPT: z.string().optional(),
      PYTHON: z.string().optional(),
      JAVA: z.string().optional(),
    })
    .refine((data) => Object.values(data).some((value) => value && value.trim() !== ''), {
      message: 'At least one code snippet is required',
    }),
  referenceSolutions: z
    .object({
      JAVASCRIPT: z.string().optional(),
      PYTHON: z.string().optional(),
      JAVA: z.string().optional(),
    })
    .refine((data) => Object.values(data).some((value) => value && value.trim() !== ''), {
      message: 'At least one language solution is required',
    }),
});
