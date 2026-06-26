---
name: suigar
description: Use when helping users configure or operate the Suigar MCP server for Sui casino transaction builders, game metadata, and read-only or dry-run flows.
---

# Suigar

Use this skill when a user wants to install, configure, or operate the Suigar MCP server.

The MCP server package is `@suigar/mcp`. It exposes read helpers and transaction builders for Suigar games on Sui. It does not custody keys, sign transactions, or execute transactions for the user.

## MCP Client Config

Configure the user's MCP client with this server:

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

After editing MCP client config, tell the user to restart or reload the client so it starts the server.

## Tool Routing

Start with read tools:

- `read_config`: inspect network, package ids, coins, and supported MCP tool names.
- `read_game_metadata`: inspect a game's package id, settings id, execution surface, and MCP support.

Use on-chain transaction builders only for supported games:

- `build_coinflip_transaction`
- `build_limbo_transaction`
- `build_plinko_transaction`
- `build_wheel_transaction`
- `build_range_transaction`
- `build_pvp_coinflip_create_transaction`
- `build_pvp_coinflip_join_transaction`
- `build_pvp_coinflip_cancel_transaction`

## Supported Surfaces

- On-chain: `coinflip`, `limbo`, `plinko`, `wheel`, `range`, `pvp-coinflip`
- Unsupported: `slots`

Slots are backend-driven and intentionally have no MCP build tool for now. Do not invent a slots transaction. Use `read_game_metadata` if the user asks why a game is unavailable.

## Build Modes

Use the lightest mode that answers the user:

- `read-only`: resolve config and transaction plan without building.
- `build`: build and serialize a transaction for the user's wallet or app to sign.
- `dry-run`: simulate on-chain with a read-only client.

The MCP server can build and dry-run transactions, but the user or their application must sign and submit them.

## Transaction Inputs

For gameplay builders:

- Use the owner's Sui address as `owner`.
- Use a configured coin type from `read_config` unless the user gives a specific coin.
- For partner attribution, pass `partner` as a top-level input.
- Do not manually set `metadata.partner` or `metadata.referrer`; reserved attribution metadata is ignored.
- If explicit coin object ids are required, pass object ids through the builder's coin source input instead of treating every coin as gas.

The native gas shortcut only applies to `0x2::sui::SUI`. Other gameplay coins must come from owned coin objects.

## Defaults

`@suigar/mcp` ships with SDK-backed testnet and mainnet defaults. A normal user does not need Suigar repository `.env` files.

Use environment overrides only when the user is intentionally testing a custom deployment or local repo setup.
