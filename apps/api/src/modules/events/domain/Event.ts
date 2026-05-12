export type DatePrecision = "day" | "month" | "year" | "decade" | "century" | "unknown";

export type EventVersion = {
  id: string;
  eventId: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  datePrecision: DatePrecision;
  dateNote: string | null;
  summary: string | null;
  tags: string[];
  sourceCount: number;
  score: number;
  createdAt: string;
};

export type Event = {
  id: string;
  versions: EventVersion[];
  createdAt: string;
};

export type CreateEventWithInitialVersionInput = {
  title: string;
  startDate?: string;
  endDate?: string;
  datePrecision: DatePrecision;
  dateNote?: string;
  summary?: string;
  tags: string[];
  sources: Array<{
    url: string;
    title?: string;
    publisher?: string;
    publishedAt?: string;
  }>;
};
