---
name: create-pvp-games
description: Build, scaffold, review, or fix Suigar PvP game flows using @suigar/sdk. Use when selecting the correct PvP game specification, designing shared PvP lobby or event-handling architecture, or adding a supported PvP game flow. For PvP coinflip create, join, cancel, lobby, parameter, object, or event work, read references/pvp-coinflip.md.
license: MIT
metadata:
  author: suigar
  version: "1.4.0"
  short-description: Build Suigar PvP game flows
  tags:
    - suigar
    - sui
    - sdk
    - pvp-games
---

# Create Suigar PvP Games

Use this skill for application code that imports `@suigar/sdk` and works with PvP games. If the user is using MCP tools instead, use `suigar-mcp`.

## Workflow

1. Identify the exact PvP game before choosing SDK builders, parameters, objects, or events.
2. For PvP coinflip, read [the PvP coinflip specification](references/pvp-coinflip.md).
3. For another PvP game, use its dedicated specification when available; do not adapt the coinflip builder, input shape, registry, or events.
4. Keep shared UI concerns—lobby state, connected owner, supported coin metadata, unsigned serialization, and event display—separate from a game's transaction semantics.

## Current Specification

- `pvp-coinflip`: create, join, cancel, unresolved-lobby reads, parameter reads, object reads, and event decoding. Read `references/pvp-coinflip.md`.

## Boundaries

- Treat each PvP game as a separate on-chain flow with its own inputs, builders, state lifecycle, and events.
- Do not route PvP game transactions through `createGameBet`, which is only for standard games.
- Use `client.suigar.getConfig().coins` for supported coin metadata and keep wallet addresses consistent as `owner`.
- Use generated BCS helpers and game-specific SDK parsers rather than hand-decoding Move payloads.
