import { z, type ZodType } from 'zod'

export const ResponseValidationErrorSchema = z.object({
  error: z.literal("Server Validation Error"),
  message: z.string(),
  details: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
      expectedType: z.string().optional(),
      received: z.any().optional(),
    }),
  ),
})

export function buildSchema<T extends ZodType>(
  schema: T,
): { schema: T; type: z.infer<T> } {
  return { schema, type: {} as z.infer<T> }
}
