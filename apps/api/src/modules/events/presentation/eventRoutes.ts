import { createEventRequestSchema } from "@kukunochi/contracts";
import { Hono } from "hono";
import type { CreateEventWithInitialVersionUseCase } from "../application/CreateEventWithInitialVersionUseCase";
import type { ListEventsUseCase } from "../application/ListEventsUseCase";

export function createEventRoutes(deps: {
  createEventWithInitialVersionUseCase: CreateEventWithInitialVersionUseCase;
  listEventsUseCase: ListEventsUseCase;
}) {
  const app = new Hono();

  app.get("/", async (c) => {
    const events = await deps.listEventsUseCase.execute();
    return c.json({ events });
  });

  app.post("/", async (c) => {
    const json = await c.req.json();
    const parsed = createEventRequestSchema.safeParse(json);

    if (!parsed.success) {
      return c.json(
        {
          code: "VALIDATION_ERROR",
          message: "Invalid event input.",
          details: parsed.error.flatten(),
        },
        400,
      );
    }

    const result = await deps.createEventWithInitialVersionUseCase.execute(parsed.data);
    return c.json(result, 201);
  });

  return app;
}
