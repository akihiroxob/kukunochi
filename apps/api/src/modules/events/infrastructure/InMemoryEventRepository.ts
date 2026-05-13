import type { CreateEventWithInitialVersionInput, Event } from "../domain/Event";
import type { EventRepository } from "../domain/EventRepository";

export class InMemoryEventRepository implements EventRepository {
  private readonly events = new Map<string, Event>();
  private sequence = 1;

  constructor() {
    void this.createWithInitialVersion({
      title: "鎌倉幕府の成立",
      startDate: "1185-01-01",
      datePrecision: "year",
      summary: "源頼朝による武家政権の成立を示す出来事。",
      tags: ["鎌倉時代", "武家政権"],
      sources: [],
    });
  }

  async createWithInitialVersion(input: CreateEventWithInitialVersionInput) {
    const now = new Date().toISOString();
    const eventId = String(this.sequence++);
    const eventVersionId = String(this.sequence++);

    const event: Event = {
      id: eventId,
      createdAt: now,
      versions: [
        {
          id: eventVersionId,
          eventId,
          title: input.title,
          startDate: input.startDate ?? null,
          endDate: input.endDate ?? null,
          datePrecision: input.datePrecision,
          dateNote: input.dateNote ?? null,
          summary: input.summary ?? null,
          tags: input.tags,
          sourceCount: input.sources.length,
          score: input.sources.length,
          createdAt: now,
        },
      ],
    };

    this.events.set(eventId, event);

    return { eventId, eventVersionId };
  }

  async list() {
    return [...this.events.values()];
  }

  async findById(eventId: string) {
    return this.events.get(eventId) ?? null;
  }
}
