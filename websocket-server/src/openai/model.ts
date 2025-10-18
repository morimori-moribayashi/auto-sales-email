import z from "zod";

export const filterSchema = z.object({
  pattern_name: z.string(),
  filter_string: z.string(),
  description: z.string(),
});

export const schema = z.object({
  filters: filterSchema.array(),
});

export type emailFilter = z.infer<typeof schema>;