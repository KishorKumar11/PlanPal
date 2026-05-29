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

// yyyy-mm-dd
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected yyyy-mm-dd");

export const dateWindowSchema = z
  .object({
    start: dateOnly,
    end: dateOnly,
  })
  .refine((v) => v.start <= v.end, { message: "start must be on or before end" })
  .refine(
    (v) => {
      const days =
        (Date.parse(v.end) - Date.parse(v.start)) / (1000 * 60 * 60 * 24);
      return days <= 13; // inclusive 14-day window max
    },
    { message: "window cannot exceed 14 days" }
  );

export const availabilitySchema = z.object({
  // explicit submission; empty array means "free on no days"
  dates: z.array(dateOnly).max(14),
});

export const setDateSchema = z.object({
  date: dateOnly,
});

export const planNotesSchema = z.object({
  notes: z.string().max(500),
});
