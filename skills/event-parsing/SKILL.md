---
name: event-parsing
description: Parse Suigar SDK events and raw generated numeric values. Use when decoding BetResultEvent.game_details, handling parseSuigarEvent, parseGameEvent, parseGameDetails, PvP Coinflip event BCS helpers, SweetHouse redeem events, or converting raw Move float and i64 values safely.
license: MIT
metadata:
  author: suigar
  version: '1.0.0'
  short-description: Parse Suigar events
  tags:
    - suigar
    - sui
    - sdk
    - events
---

# Suigar Event Parsing

Use this skill for application code that imports `@suigar/sdk` and parses Suigar events or raw generated numeric structs. If the task is only SDK setup, use `installation` first. If the user is using `@suigar/mcp` tool output, use `suigar-mcp` instead.

> Source constraint: Use public SDK utilities and generated BCS helpers. Do not hand-decode `BetResultEvent.game_details` or copy SDK numeric struct guards into app code.

## Default Workflow

1. Confirm the event source includes BCS bytes when payload decoding is needed.
2. Prefer `parseSuigarEvent(event)` for supported game events.
3. Use generated BCS helpers for direct event parsing when the app needs specific event payloads.
4. Use `parseGameDetails({ game, gameDetails })` for manual `BetResultEvent.game_details` decoding.
5. Use raw Move numeric guards only for generated BCS values that did not come from SDK-normalized reads.
6. For the canonical parser and numeric conversion patterns, read [references/events.md](references/events.md).

## Boundaries

- Standard game and PvP bet result events use the shared game-event parsing path.
- SweetHouse redeem events use `client.suigar.bcs.RedeemRequestCreatedEvent`.
- `client.suigar.getGameParameters()` already returns generated Move float fields as JavaScript numbers.
- Parsed `u64` and `u128` game detail values return `bigint` to preserve precision.
