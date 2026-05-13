import type { EventListItem } from "@kukunochi/contracts";
import type { EventRepository } from "../domain/EventRepository";

export class ListEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(): Promise<EventListItem[]> {
    const events = await this.eventRepository.list();

    return events
      .map((event) => {
        const representativeVersion = [...event.versions].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.sourceCount !== a.sourceCount) return b.sourceCount - a.sourceCount;
          return b.createdAt.localeCompare(a.createdAt);
        })[0];

        if (!representativeVersion) {
          return null;
        }

        return {
          eventId: event.id,
          representativeVersionId: representativeVersion.id,
          title: representativeVersion.title,
          startDate: representativeVersion.startDate,
          endDate: representativeVersion.endDate,
          datePrecision: representativeVersion.datePrecision,
          summary: representativeVersion.summary,
          tags: representativeVersion.tags,
          sourceCount: representativeVersion.sourceCount,
        } satisfies EventListItem;
      })
      .filter((event): event is EventListItem => event !== null)
      .sort((a, b) => (a.startDate ?? "9999-12-31").localeCompare(b.startDate ?? "9999-12-31"));
  }
}
