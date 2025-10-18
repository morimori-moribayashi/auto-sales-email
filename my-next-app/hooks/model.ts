import { z } from 'zod';

// Planning Response Schema
export const PlanningResponseSchema = z.object({
  strategies: z.array(z.string())
});

// Gmail Filter Response Schema
export const GmailFilterResponseSchema = z.object({
  filters: z.array(z.string())
});

// Mail Title List Response Schema
export const MailTitleListResponseSchema = z.object({
  threads: z.array(z.string())
});

// Evaluation Response Schema
export const EvaluationResponseSchema = 
z.object({
  threadsWithGradings :z.array(z.object({
  subject: z.string(),
  body: z.string(),
  from: z.string(),
  date: z.string(),
  score: z.number(),
  grade: z.string(),
  required: z.object({
    score: z.number(),
    max: z.number(),
    items: z.array(z.object({
      score: z.number(),
      name: z.string(),
      req: z.string(),
      actual: z.string()
    }))
  }),
  preferred: z.object({
    score: z.number(),
    max: z.number(),
    items: z.array(z.object({
      score: z.number(),
      name: z.string(),
      req: z.string(),
      actual: z.string()
    }))
  }),
  analysis: z.object({
    strengths: z.array(z.string()),
    risks: z.array(z.string()),
    actions: z.array(z.string())
  })
}))
});


// Error Response Schema
export const ErrorResponseSchema = z.object({
  message: z.string(),
  stack: z.string().optional()
});

const gmailThreadSchema = z.object({
  subject: z.string(),
  body: z.string(),
  from: z.string(),
  date: z.date(),
})

export const gmailThreadSchemaWithId = z.object({
  subject: z.string(),
  body: z.string(),
  from: z.string(),
  date: z.date(),
  id: z.string(),
})

// Type exports
export type PlanningResponse = z.infer<typeof PlanningResponseSchema>;
export type GmailFilterResponse = z.infer<typeof GmailFilterResponseSchema>;
export type MailTitleListResponse = z.infer<typeof MailTitleListResponseSchema>;
export type gmailThreadsResponse = z.infer<typeof gmailThreadSchema>;
export type EvaluationResponse = z.infer<typeof EvaluationResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type gmailThreadWithId = z.infer<typeof gmailThreadSchemaWithId>;    