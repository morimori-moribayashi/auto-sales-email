import z from "zod";

export const filterSchema = z.object({
  pattern_name: z.string(),
  filter_string: z.string(),
  description: z.string(),
  expected_results: z.string().array(),
});

export const schema = z.object({
  summary: z.object({
    experience_level: z.string(),
    core_skills: z.string().array(),
    strengths: z.string(),
  }),
  filters: filterSchema.array(),
  usage_recommendation: z.string(),
});

export type emailFilter = z.infer<typeof schema>;