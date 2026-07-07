---
name: suigar-mcp
description: Install, configure, operate, or troubleshoot the @suigar/mcp server and bundled MCP App for Suigar. Use when adding the MCP server to Claude/Codex/Cursor or another MCP client, reading config or game metadata, building unsigned standard or PvP transaction plans, using read-only/build/dry-run modes, handling SuiNS owner inputs, or explaining MCP safety boundaries and unsupported games.
license: MIT
metadata:
  author: suigar
  version: "1.1.0"
  short-description: Operate the Suigar MCP server
  tags:
    - suigar
    - sui
    - mcp
    - transactions
---

# Suigar MCP

Use this skill for `@suigar/mcp` operation. If the user is writing application code that imports `@suigar/sdk`, use `installation`, `create-standard-games`, or `create-pvp-games` instead.

The MCP server is a thin layer over `@suigar/sdk`. It reads Suigar config and game metadata, builds unsigned transactions, and can dry-run unsigned transactions. It never signs, submits, executes, or custodies private keys.

## Install

Configure MCP clients with the published package:

```json
{
  "mcpServers": {
    "suigar": {
      "command": "npx",
      "args": ["-y", "@suigar/mcp"]
    }
  }
}
```

After changing MCP client config, tell the user to restart or reload the client so it starts the server.

## Tool Routing

Start with read tools when network, coin, package, or game support is unclear:

- `read_config`: inspect network, provider URL, package ids, configured coins, and supported games.
- `read_game_metadata`: inspect one game's package id, default or requested coin type, transaction surface, and support notes.

Use transaction tools only for supported on-chain games:

- `build_coinflip_transaction`
- `build_limbo_transaction`
- `build_plinko_transaction`
- `build_range_transaction`
- `build_wheel_transaction`
- `build_pvp_coinflip_create_transaction`
- `build_pvp_coinflip_join_transaction`
- `build_pvp_coinflip_cancel_transaction`

Do not invent tools for unsupported games. Slots are backend-driven and are not exposed as an MCP transaction builder.

## Modes

Use the lightest mode that answers the request:

| Mode | Use when |
|---|---|
| `read-only` | The user needs a resolved plan without transaction bytes. |
| `build` | The user needs unsigned base64 bytes for a wallet or app to sign. |
| `dry-run` | The user needs raw and summarized Sui simulation data for the unsigned transaction. |

All tool responses should include text `content` and `structuredContent`. App-capable clients may render the bundled Suigar Transaction Inspector UI.

## Common Inputs

- `network` defaults to `testnet`; only `testnet` and `mainnet` are supported.
- `providerUrl` can override the Sui gRPC endpoint.
- `config` accepts SDK-style package, registry, coin, and price-info overrides.
- `partner` is a top-level partner wallet address forwarded through `suigar({ partner })`.
- `owner` accepts a Sui address, SuiNS name, or SuiNS subname in build and dry-run modes.
- `coinType` defaults to the SDK-configured SUI coin type.
- `stake` and `cashStake` are currency amounts, such as `1` or `1.5`, not base units.
- `metadata` values must be JSON-compatible strings, numbers, or booleans. Send large integer metadata values as strings.
- `gasBudget` is in MIST.
- `useGasCoin` is only for native SUI bet coin handling when overriding Mysten's default coin intent behavior.

Do not pass explicit coin object ids. The MCP package intentionally uses SDK public transaction builders.

## Game Inputs

Standard game fields:

- Coinflip: `side: "heads" | "tails"`
- Limbo: `targetMultiplier: number`
- Plinko: `configId: number`
- Range: `leftPoint: number`, `rightPoint: number`, optional `outOfRange`
- Wheel: `configId: number`

PvP coinflip fields:

- Create: `owner`, `stake`, `creatorSide`, optional `isPrivate`
- Join: `owner`, `gameId`, optional `coinType`
- Cancel: `owner`, `gameId`, optional `coinType`

PvP coinflip create uses the MCP field name `creatorSide`; the SDK builder receives that value as `side`.

## Gotchas

- Keep MCP usage read-only with respect to user assets: inspect, build unsigned bytes, or dry-run only.
- Use `read_config` before building when network, coin, package ids, or supported games are uncertain.
- Pass partner attribution as top-level `partner`; do not set `metadata.partner` or `metadata.referrer`.
- Use PvP tools for PvP coinflip. Do not route PvP coinflip through standard game builders.
- For PvP join, expect live object reads while building or dry-running because the SDK resolves the current game stake from the game object.
- Surface tool errors with the missing field, unsupported config, network, or coin detail needed for retry.
