import { z } from "zod";

export const quizSubmitSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        optionIndex: z.number().int().min(0).max(3),
      })
    )
    .min(10)
    .max(10),
});

export const interestsSchema = z.object({
  interests: z.array(z.string()).min(3),
});

export const createGroupSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});

export const voteSchema = z.object({
  recommendationId: z.string(),
  value: z.union([z.literal(1), z.literal(-1)]),
});
