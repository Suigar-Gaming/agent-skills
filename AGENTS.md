# AGENTS.md

## Repository overview

This repository contains skills for coding agents building with Suigar on Sui. They cover SDK integration, MCP server operation, game-specific transaction rules, and Suifrens rendering and animation.

## Creating or updating a skill

### Directory structure

```text
skills/
  {skill-name}/
    SKILL.md
    scripts/
    references/
    lib/
```

- `skills/{skill-name}/` uses kebab-case and must match the `name` in frontmatter.
- `SKILL.md` is required and must use that exact uppercase filename.
- `scripts/`, `references/`, and `lib/` are optional. Add them only when they directly support the skill.

### SKILL.md format

```md
---
name: { skill-name }
description: Use when {specific Suigar task, product surface, or trigger}.
---

# {Skill Title}

{Concise instructions for the agent.}
```

The `description` tells agents when to use the skill. Name the Suigar task: SDK setup, standard game transactions, a specific PvP game flow, MCP server operation, or skill discovery.

### Suigar skill boundaries

- Use `installation` for base `@suigar/sdk` setup, client extension wiring, config, serialization, and public exports.
- Use `event-parsing` for Suigar event decoding, `BetResultEvent.game_details`, generated BCS event helpers, and raw Move float or i64 conversion.
- Use `create-standard-games` for standard single-player game transactions: `coinflip`, `keno`, `limbo`, `plinko`, `range`, `soccer`, and `wheel`.
- Use `create-pvp-games` for PvP game flows. Read the specification for the selected game. It currently includes `references/pvp-coinflip.md` for create, join, cancel, lobby listing, and object/event parsing. Add another specification when a new PvP game is supported.
- Use `suigar-nft` for application-side NFT V1 ownership, catalog lookups, and mint transaction building using SDK-resolved package/object ids, BCS helpers, and `client.suigar.tx.nftV1.mint`.
- Use `sweethouse` for public pool deposits, redeem requests, and delayed self-claims.
- Use `referrals` for SDK partner attribution and referral reward claims.
- Use `suigar-mcp` for installing, configuring, operating, or troubleshooting the `@suigar/mcp` server, bundled MCP App, or its Codex, Claude Code, and Cursor plugin bundle.
- Use `suifrens-display` for character rendering, accessories, kits, gestures, SVG exports and the Fastify SVG/PNG example.
- Use `suifrens-animation` for playback, custom sequences, battle sprites and duel scripts. Keep presentation separate from on-chain outcomes.
- Keep SDK and MCP guidance separate. MCP skills should describe tool usage, read-only/build/dry-run modes, and unsigned transaction behavior. SDK skills should describe application code that imports `@suigar/sdk`.

### Context efficiency

- Keep each `SKILL.md` concise and under 500 lines.
- Move detailed reference material to directly linked files under `references/`.
- Prefer public Suigar imports: `@suigar/sdk`, `@suigar/sdk/games`, and `@suigar/sdk/utils`.
- Keep SDK architecture details out of these skills unless they are needed for public usage guidance.
- Do not add README files inside individual skills.

### Script requirements

If a skill needs scripts:

- Bash scripts use `#!/bin/bash` and `set -e`.
- Node scripts use `#!/usr/bin/env node` and `.mjs`.
- Write status messages to stderr and machine-readable output to stdout.
- Clean up temporary files with traps when scripts create them.
- Reference scripts by relative path, such as `node scripts/{script}.mjs`.

## End-user installation

Document installation through skills.sh-compatible commands:

Browse available skills:

```bash
npx skills list Suigar-Gaming/agent-skills --list
```

Install a specific skill:

```bash
npx skills add Suigar-Gaming/agent-skills --skill suigar-mcp
```

Install all skills:

```bash
npx skills add Suigar-Gaming/agent-skills
```

For manual installs, copy a skill folder into the target agent's native skills directory.
