# Domain Model

## Core idea

kukunochi stores many Events as a large timeline.
Narratives then select, order, and explain those Events from a specific question or perspective.

```text
Event = 出来事の同一性
EventVersion = 事実記述の候補
Narrative = 特定の問い・視点に沿ったEventの道筋
```

## Event

Event is identity only.

It represents that a historical or social event exists, but it does not directly hold the factual description.
The factual description belongs to EventVersion.

## EventVersion

EventVersion is a candidate factual description for an Event.

It holds:

- title
- startDate
- endDate
- datePrecision
- dateNote
- summary
- tags
- confidence
- sourceCount
- score

Multiple EventVersions can exist for the same Event.

The representative version is derived from score, source count, and created date.
It is not fixed as canonical in the initial design.

## Source

Source is evidence for EventVersion or Annotation.

The first MVP attaches Source to EventVersion.

## Narrative

Narrative is not the same as Event.

Narrative selects existing Events and arranges them around a specific focus.

Examples:

- Why did the Kamakura shogunate emerge?
- Why did a policy fail?
- How did a conflict escalate?

Narrative is added after Event registration and timeline viewing are working.

## Initial MVP scope

The initial MVP only needs:

- Event
- EventVersion
- Source

Narrative, Annotation, Reaction, Report, and Embedding are later phases.
