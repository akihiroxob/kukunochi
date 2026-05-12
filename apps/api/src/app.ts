import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { CreateEventWithInitialVersionUseCase } from "./modules/events/application/CreateEventWithInitialVersionUseCase";
import { ListEventsUseCase } from "./modules/events/application/ListEventsUseCase";
import { InMemoryEventRepository } from "./modules/events/infrastructure/InMemoryEventRepository";
import { createEventRoutes } from "./modules/events/presentation/eventRoutes";

export function createApp() {
  const app = new Hono();

  const eventRepository = new InMemoryEventRepository();
  const createEventWithInitialVersionUseCase = new CreateEventWithInitialVersionUseCase(eventRepository);
  const listEventsUseCase = new ListEventsUseCase(eventRepository);

  app.get("/api/health", (c) => c.json({ ok: true, service: "kukunochi-api" }));
  app.route(
    "/api/events",
    createEventRoutes({ createEventWithInitialVersionUseCase, listEventsUseCase }),
  );

  // Production static hosting for the Vite build output.
  // During development, use the Vite dev server instead.
  app.use("/assets/*", serveStatic({ root: "../web/dist" }));
  app.get("*", serveStatic({ path: "../web/dist/index.html" }));

  return app;
}
