# Suigar Skill

Agent skill for configuring and operating the Suigar MCP server.

The skill teaches compatible coding agents how to use `@suigar/mcp`, the Suigar MCP server package for Sui casino game metadata and transaction builders.

## Install

From GitHub:

```bash
npx skills add Suigar-Gaming/suigar-skill
```

For Codex, globally:

```bash
npx skills add Suigar-Gaming/suigar-skill --agent codex --global --yes
```

For a local checkout:

```bash
npx skills add .
```

## What It Configures

The skill tells agents to configure MCP clients with:

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

The MCP server builds and dry-runs transactions. It does not sign, submit, or custody private keys.

## Supported Games

On-chain MCP builders:

- `coinflip`
- `limbo`
- `plinko`
- `wheel`
- `range`
- `pvp-coinflip`

`slots` is intentionally unsupported in MCP for now because it is backend-driven.
