import type { CreateEventRequest } from "@kukunochi/contracts";
import type { EventRepository } from "../domain/EventRepository";

export class CreateEventWithInitialVersionUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  execute(input: CreateEventRequest) {
    return this.eventRepository.createWithInitialVersion(input);
  }
}
