import { z } from "zod";

export const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.string(),
  tags: z.array(z.string()),
  examples: z.record(
    z.string(),
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string()
    })
  ),
  constraints: z.string(),
  testcases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ).min(1), 
  codeSnippets: z.record(z.string(), z.string()),
  referenceSolution: z.record(z.string(), z.string())
});