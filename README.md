# Suigar Agent Skills

A collection of skills for AI coding agents working with Suigar on Sui. Skills are packaged instructions that extend agent capabilities.

Skills follow the [Agent Skills](https://agentskills.io/) format.

[![skills.sh](https://skills.sh/b/Suigar-Gaming/agent-skills)](https://skills.sh/Suigar-Gaming/agent-skills)

## Installation

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

## Available Skills

### installation

Set up `@suigar/sdk` in an application, wire the `suigar()` client extension, resolve config, serialize transactions, and use public SDK exports correctly.

**Use when:**

- Installing or scaffolding the base Suigar SDK integration
- Configuring `SuiGrpcClient` with `suigar()`
- Working with SDK config, supported coins, or serialization
- Parsing Suigar events through public SDK utilities

### referrals

Configure partner attribution and claim referral rewards through `@suigar/sdk`.

**Use when:**

- Configuring `suigar({ partner })` with a partner wallet address
- Checking claimable referral commission or level-up USD rewards
- Building unsigned referral claim transactions
- Correcting referral values incorrectly placed in game metadata

### suigar-nft

Read the Suigar NFT V1 catalog, list owned NFTs, and build NFT V1 mint transactions using SDK-resolved package and object ids plus BCS helpers.

**Use when:**

- Listing an owner's NFT V1 objects
- Reading and decoding the NFT V1 catalog factory
- Building `client.suigar.tx.nftV1.mint` from a catalog `specId`
- Deriving the NFT type with the active SDK BCS helper
- Keeping NFT reads network-aware without hard-coded package ids

### create-standard-games

Build standard single-player Suigar game flows on top of `@suigar/sdk`.

**Use when:**

- Building `coinflip`, `limbo`, `plinko`, `range`, `soccer`, or `wheel` bet transactions
- Mapping UI inputs to `client.suigar.tx.createGameBet`
- Reviewing standard game amount, metadata, or coin handling
- Fixing AI-generated standard Suigar game code

### create-pvp-games

Build PvP game flows on top of `@suigar/sdk`. The skill includes a dedicated PvP coinflip specification and can grow with one specification per future PvP game.

**Use when:**

- Creating, joining, or canceling PvP coinflip matches
- Listing unresolved PvP coinflip lobby games
- Reading PvP coinflip game objects or events
- Keeping PvP transaction flows separate from standard game builders

### suigar-mcp

Install, configure, operate, or troubleshoot the `@suigar/mcp` server, bundled MCP App, or plugin bundle for Codex, Claude Code, and Cursor.

**Use when:**

- Adding the Suigar MCP server to an MCP client
- Installing the Suigar plugin from a supported marketplace
- Reading Suigar config or game metadata through MCP tools
- Pairing browser wallets, checking balances, or listing coin objects
- Setting up, inspecting, or funding a local session wallet
- Browsing the NFT V1 catalog and a wallet's matching NFTs through `list_nfts`
- Building NFT V1 mint transactions through `build_nft_v1_mint_transaction`
- Building, dry-running, or explicitly executing transactions in read-only, build, dry-run, or execute mode
- Explaining MCP support boundaries for Suigar games

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**

```text
Set up Suigar in this app
```

```text
Build a coinflip transaction
```

```text
Configure the Suigar MCP server
```

```text
Install the local Suigar plugin in Codex
```

```text
Add a PvP coinflip lobby flow
```

```text
List this wallet's Suigar NFT V1 objects
```

```text
Mint a Suigar NFT V1 from this catalog specId
```

```text
Use the Suigar MCP to read the testnet config and list supported games
```

```text
Build a read-only Suigar MCP transaction plan for a 1 SUI coinflip on heads
```

```text
Dry-run a Suigar MCP limbo transaction for this wallet with a 2.5x target multiplier
```

```text
Use Suigar MCP to build an unsigned PvP coinflip create transaction for 1 SUI on tails
```

```text
Use Suigar MCP to set up a local session wallet and show its balances
```

## Development Checks

Install dependencies with pnpm:

```bash
pnpm install
```

Run skill evals with OpenAI:

```bash
OPENAI_API_KEY=... pnpm run eval
```

Run evals for one skill:

```bash
OPENAI_API_KEY=... pnpm run eval -- --skill installation
```

## Skill Structure

Each skill contains:

- `SKILL.md` - Instructions for the agent
- `scripts/` - Helper scripts for automation (optional)
- `references/` - Supporting documentation (optional)

## License

MIT
