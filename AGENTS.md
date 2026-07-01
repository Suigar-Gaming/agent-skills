# AGENTS.md

This file provides guidance to AI coding agents when working with Suigar agent skills.

## Repository Overview

This repository contains skills for AI coding agents that build with Suigar on Sui. Skills are packaged instructions that extend an agent with Suigar SDK integration patterns, MCP server operation guidance, and game-specific transaction guardrails.

## Creating or Updating a Skill

### Directory Structure

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

### SKILL.md Format

```md
---
name: {skill-name}
description: Use when {specific Suigar task, product surface, or trigger}.
---

# {Skill Title}

{Concise instructions for the agent.}
```

The `description` is the trigger surface. Include the concrete Suigar task there: SDK setup, standard game transactions, PvP game flows, MCP server operation, or skill discovery.

### Suigar Skill Boundaries

- Use `installation` for base `@suigar/sdk` setup, client extension wiring, config, serialization, public exports, and event parsing.
- Use `create-standard-games` for standard single-player game transactions: `coinflip`, `limbo`, `plinko`, `range`, and `wheel`.
- Use `create-pvp-games` for PvP game flows, currently PvP coinflip create, join, cancel, lobby listing, and object/event parsing.
- Use `suigar-mcp` for installing, configuring, operating, or troubleshooting `@suigar/mcp` and the bundled MCP App.
Keep SDK and MCP guidance separate. MCP skills should describe tool usage, read-only/build/dry-run modes, and unsigned transaction behavior. SDK skills should describe application code that imports `@suigar/sdk`.

### Context Efficiency

- Keep each `SKILL.md` concise and under 500 lines.
- Move detailed reference material to directly linked files under `references/`.
- Prefer public Suigar imports: `@suigar/sdk`, `@suigar/sdk/games`, and `@suigar/sdk/utils`.
- Keep SDK architecture details out of these skills unless they are needed for public usage guidance.
- Do not add README files inside individual skills.

### Script Requirements

If a skill needs scripts:

- Bash scripts use `#!/bin/bash` and `set -e`.
- Node scripts use `#!/usr/bin/env node` and `.mjs`.
- Write status messages to stderr and machine-readable output to stdout.
- Clean up temporary files with traps when scripts create them.
- Reference scripts by relative path, such as `node scripts/{script}.mjs`.

## End-User Installation

Document installation through skills.sh-compatible commands:

```bash
npx skills add Suigar-Gaming/agent-skills
npx skills add Suigar-Gaming/agent-skills --skill suigar-mcp
```

For manual installs, copy a skill folder into the target agent's native skills directory.
