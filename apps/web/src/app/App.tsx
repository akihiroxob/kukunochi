import { useEffect, useState } from "react";
import type { CreateEventRequest, EventListItem, ListEventsResponse } from "@kukunochi/contracts";

type FormState = {
  title: string;
  startDate: string;
  datePrecision: CreateEventRequest["datePrecision"];
  summary: string;
  tags: string;
};

const initialFormState: FormState = {
  title: "",
  startDate: "",
  datePrecision: "day",
  summary: "",
  tags: "",
};

export function App() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadEvents() {
    const response = await fetch("/api/events");
    if (!response.ok) {
      throw new Error("Failed to load events.");
    }
    const data = (await response.json()) as ListEventsResponse;
    setEvents(data.events);
  }

  useEffect(() => {
    void loadEvents().catch((error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load events.");
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const request: CreateEventRequest = {
      title: form.title,
      startDate: form.startDate || undefined,
      datePrecision: form.datePrecision,
      summary: form.summary || undefined,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      sources: [],
    };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to create event.");
      }

      setForm(initialFormState);
      await loadEvents();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create event.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">kukunochi MVP</p>
        <h1>出来事を蓄積し、年表として見る</h1>
        <p>
          最初のサンプルは Event と EventVersion の境界を保ちつつ、Hono API と Vite React UI の接続を確認するためのものです。
        </p>
      </header>

      <section className="grid">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Event登録</h2>
          <label>
            タイトル
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </label>
          <label>
            開始日
            <input
              type="date"
              value={form.startDate}
              onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
            />
          </label>
          <label>
            日付精度
            <select
              value={form.datePrecision}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  datePrecision: event.target.value as CreateEventRequest["datePrecision"],
                }))
              }
            >
              <option value="day">day</option>
              <option value="month">month</option>
              <option value="year">year</option>
              <option value="decade">decade</option>
              <option value="century">century</option>
              <option value="unknown">unknown</option>
            </select>
          </label>
          <label>
            要約
            <textarea
              value={form.summary}
              onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            />
          </label>
          <label>
            タグ（カンマ区切り）
            <input
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            />
          </label>
          <button disabled={isSubmitting}>{isSubmitting ? "登録中..." : "登録する"}</button>
          {errorMessage ? <p className="error">{errorMessage}</p> : null}
        </form>

        <section className="card timeline">
          <h2>Event年表</h2>
          {events.length === 0 ? (
            <p>まだEventがありません。</p>
          ) : (
            <ol>
              {events.map((event) => (
                <li key={event.eventId}>
                  <time>{event.startDate ?? "日付不明"}</time>
                  <div>
                    <h3>{event.title}</h3>
                    {event.summary ? <p>{event.summary}</p> : null}
                    <p className="meta">
                      {event.datePrecision} / sources: {event.sourceCount}
                    </p>
                    {event.tags.length > 0 ? (
                      <div className="tags">
                        {event.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </section>
    </main>
  );
}
