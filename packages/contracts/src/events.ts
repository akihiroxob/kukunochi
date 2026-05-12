import { z } from "zod";

export const datePrecisionSchema = z.enum([
  "day",
  "month",
  "year",
  "decade",
  "century",
  "unknown",
]);

export const sourceInputSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).optional(),
  publisher: z.string().min(1).optional(),
  publishedAt: z.string().datetime().optional(),
});

export const createEventRequestSchema = z.object({
  title: z.string().min(1),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  datePrecision: datePrecisionSchema.default("day"),
  dateNote: z.string().optional(),
  summary: z.string().optional(),
  tags: z.array(z.string().min(1)).default([]),
  sources: z.array(sourceInputSchema).default([]),
});

export const eventListItemSchema = z.object({
  eventId: z.string(),
  representativeVersionId: z.string(),
  title: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  datePrecision: datePrecisionSchema,
  summary: z.string().nullable(),
  tags: z.array(z.string()),
  sourceCount: z.number().int().nonnegative(),
});

export const createEventResponseSchema = z.object({
  eventId: z.string(),
  eventVersionId: z.string(),
});

export const listEventsResponseSchema = z.object({
  events: z.array(eventListItemSchema),
});

export type DatePrecision = z.infer<typeof datePrecisionSchema>;
export type CreateEventRequest = z.infer<typeof createEventRequestSchema>;
export type CreateEventResponse = z.infer<typeof createEventResponseSchema>;
export type EventListItem = z.infer<typeof eventListItemSchema>;
export type ListEventsResponse = z.infer<typeof listEventsResponseSchema>;
