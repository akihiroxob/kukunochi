import type { CreateEventWithInitialVersionInput, Event } from "./Event";

export type EventRepository = {
  createWithInitialVersion(input: CreateEventWithInitialVersionInput): Promise<{
    eventId: string;
    eventVersionId: string;
  }>;
  list(): Promise<Event[]>;
  findById(eventId: string): Promise<Event | null>;
};
