# Suigar Agent Skills

A collection of skills for AI coding agents working with Suigar on Sui. Skills are packaged instructions that extend agent capabilities.

Skills follow the [Agent Skills](https://agentskills.io/) format.

[![skills.sh](https://skills.sh/b/Suigar-Gaming/agent-skills)](https://skills.sh/Suigar-Gaming/agent-skills)

## Available Skills

### installation

Set up `@suigar/sdk` in an application, wire the `suigar()` client extension, resolve config, serialize transactions, and use public SDK exports correctly.

**Use when:**

- Installing or scaffolding the base Suigar SDK integration
- Configuring `SuiGrpcClient` with `suigar()`
- Working with SDK config, supported coins, partner attribution, or serialization
- Parsing Suigar events through public SDK utilities

### create-standard-games

Build standard single-player casino game flows on top of `@suigar/sdk`.

**Use when:**

- Building `coinflip`, `limbo`, `plinko`, `range`, or `wheel` bet transactions
- Mapping UI inputs to `client.suigar.tx.createBetTransaction`
- Reviewing standard game amount, metadata, coin, or partner handling
- Fixing AI-generated standard Suigar game code

### create-pvp-games

Build PvP game flows on top of `@suigar/sdk`, currently focused on PvP coinflip.

**Use when:**

- Creating, joining, or canceling PvP coinflip matches
- Listing unresolved PvP coinflip lobby games
- Reading PvP coinflip game objects or events
- Keeping PvP transaction flows separate from standard game builders

### suigar-mcp

Install, configure, operate, or troubleshoot the `@suigar/mcp` server and bundled MCP App.

**Use when:**

- Adding the Suigar MCP server to an MCP client
- Reading Suigar config or game metadata through MCP tools
- Building unsigned transactions in read-only, build, or dry-run mode
- Explaining MCP support boundaries for Suigar games

### find-skills

Discover and install reusable agent skills from the skills ecosystem.

**Use when:**

- Users ask whether a skill exists for a workflow
- Searching skills.sh-compatible packages
- Installing skills globally

## Installation

Install all skills:

```bash
npx skills add Suigar-Gaming/agent-skills
```

Install one skill:

```bash
npx skills add Suigar-Gaming/agent-skills --skill suigar-mcp
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**

```text
Set up @suigar/sdk in this app
Build a coinflip transaction with @suigar/sdk
Configure the Suigar MCP server
Add a PvP coinflip lobby flow
```

## Skill Structure

Each skill contains:

- `SKILL.md` - Instructions for the agent
- `scripts/` - Helper scripts for automation (optional)
- `references/` - Supporting documentation (optional)

## License

MIT
