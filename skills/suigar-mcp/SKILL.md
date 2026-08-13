---
name: suigar-mcp
description: Install, configure, operate, or troubleshoot the @suigar/mcp server, bundled MCP App, or plugin bundle for Suigar. Use when adding direct MCP configuration or installing the Codex, Claude Code, or Cursor plugin; reading config, live game metadata, wallet balances, coin objects, NFT V1 catalog/ownership, or referral rewards; building standard, PvP, referral-claim, or NFT V1 mint transaction plans including Soccer; using read-only/build/dry-run/execute modes; pairing browser wallets; managing local session wallets; handling SuiNS owner inputs; or explaining MCP safety boundaries.
license: MIT
metadata:
  author: suigar
  version: '1.6.0'
  short-description: Operate the Suigar MCP server
  tags:
    - suigar
    - sui
    - mcp
    - transactions
---

# Suigar MCP

Use this skill for `@suigar/mcp` operation. If the user is writing application code that imports `@suigar/sdk`, use `installation`, `create-standard-games`, `create-pvp-games`, or `suigar-nft` instead.

The MCP server is a thin layer over `@suigar/sdk`. It reads Suigar config, game metadata, wallet balances, coin objects, NFTs, and referral rewards; builds unsigned transactions; dry-runs unsigned transactions; and can execute only through an explicit paired-wallet approval or a user-created local session wallet.

## Install or Add the Plugin

For the fastest direct installation across detected coding agents, use the package's `add-mcp` command:

```bash
npx add-mcp @suigar/mcp --name suigar
```

Use manual stdio configuration only when the user needs to configure one MCP client explicitly or their environment does not support `add-mcp`:

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

Use the plugin bundle when the user wants marketplace installation or the bundled client integration. The package ships manifests for Codex, Claude Code, and Cursor; those manifests register the version-pinned `@suigar/mcp` stdio server automatically.

For Codex, add the public Suigar marketplace from GitHub:

```bash
codex plugin marketplace add Suigar-Gaming/ts-sdks --ref main
```

The repository marketplace resolves the plugin at `packages/mcp/plugin`. After adding it, install or enable `suigar` from the Suigar source in the Plugins directory. Use a local path only while developing unpublished changes in a checkout.

For Claude Code, add the public Suigar marketplace from GitHub and install the plugin:

```text
/plugin marketplace add Suigar-Gaming/ts-sdks@main
/plugin install suigar@suigar
```

For Cursor, install through the Suigar repository marketplace at `https://github.com/Suigar-Gaming/ts-sdks` and reload Cursor. Do not tell users to manually edit the generated plugin manifests or their version-pinned `.mcp.json`.

## Tool Routing

Start with read tools when network, coin, package, or game support is unclear:

- `read_config`: inspect network, provider URL, package ids, configured coins, and supported games.
- `read_game_metadata`: inspect one required game id's live on-chain parameters, package id, default or requested coin type, transaction surface, and support notes. Pass `ignoreCache: true` to refresh SDK-cached parameters.
- `list_nfts`: read the NFT V1 catalog and matching NFTs owned by one required address or SuiNS name. It returns display-friendly identifiers and NFT image URLs.
- `get_wallet_balances`: list aggregate balances for the connected wallet, a local session wallet, or an explicit owner.
- `list_wallet_coins`: list paginated coin objects for the connected wallet, a local session wallet, or an explicit owner.
- `get_connection_status`: inspect paired browser-wallet connection state.
- `get_session_wallet`: inspect the local session wallet public address, balances, and funding links without exposing its private key.
- `get_execution_status`: check the browser approval status for an execute-mode transaction request.
- `get_referral_commission`: simulate the commission claimable by one referrer for a selected or default coin type.
- `get_referral_level_up_usd_rewards`: simulate the USD level-up rewards claimable by one referrer.

Use transaction tools for supported on-chain games, referrals, NFT V1 minting, and wallet setup flows:

- `setup_session_wallet`
- `fund_session_wallet`
- `suigar_login`
- `suigar_logout`
- `build_coinflip_transaction`
- `build_limbo_transaction`
- `build_plinko_transaction`
- `build_range_transaction`
- `build_soccer_transaction`
- `build_wheel_transaction`
- `build_pvp_coinflip_create_transaction`
- `build_pvp_coinflip_join_transaction`
- `build_pvp_coinflip_cancel_transaction`
- `build_referral_commission_claim_transaction`
- `build_referral_level_up_usd_rewards_claim_transaction`
- `build_nft_v1_mint_transaction`

Do not invent tools for unsupported games. Slots are backend-driven and are not exposed as an MCP transaction builder.

## Modes

Use the lightest mode that answers the request:

| Mode | Use when |
| --- | --- |
| `read-only` | The user needs a resolved plan without transaction bytes. |
| `build` | The user needs unsigned base64 bytes for a wallet or app to sign. |
| `dry-run` | The user needs raw and summarized Sui simulation data for the unsigned transaction. |
| `execute` | The user explicitly wants MCP to execute through paired browser-wallet approval or a local session wallet. |

All tool responses should include text `content` and `structuredContent`. App-capable clients may render the bundled Suigar Transaction Inspector UI.

Use `read_game_metadata` before showing or validating live stake limits, RTP, or Plinko, Soccer, or Wheel configuration. It requires `game`; use `read_config` instead for broad discovery.

Use `list_nfts` for read-only NFT V1 browsing. App-capable hosts render the catalog and owned NFTs in separate views; unsupported image URLs remain available as text.

Referral amount reads are read-only simulations of the SDK's real claim transaction. They require `owner`; commission accepts an optional `coinType` and defaults to configured SUI, while level-up USD rewards use configured USDC. They return `0` when a claim cannot be simulated or is unavailable. For SDK application integration or partner attribution, use [referrals](../referrals/SKILL.md).

Wallet tools manage two different wallet paths. Use `suigar_login`, `suigar_logout`, and `get_connection_status` for paired browser-wallet approval flows. Use `setup_session_wallet`, `get_session_wallet`, and `fund_session_wallet` for a persistent local session wallet; recovery phrases and imported `suiprivkey...` values stay on the localhost setup page and never pass through MCP.

## Common Inputs

- `network` defaults to `testnet`; only `testnet` and `mainnet` are supported.
- `providerUrl` can override the Sui gRPC endpoint.
- `config` accepts SDK-style `packageIds`, `objectIds`, `registryIds`, and coin-metadata overrides. Put a custom price-info object id beside its coin as `coins.sui.priceInfoObjectId` or `coins.usdc.priceInfoObjectId`; singleton ids such as `sweetHouse` and `nftV1Factory` belong in `objectIds`.
- `partner` is a top-level partner wallet address forwarded through `suigar({ partner })`.
- `owner` accepts a Sui address, SuiNS name, or SuiNS subname in build, dry-run, paired-wallet execute, NFT, wallet, and referral reads. In `mode: "execute"` with `executionWallet: "session"`, `owner` is optional and must match the selected session wallet if provided.
- `coinType` defaults to the SDK-configured SUI coin type.
- `stake` and `cashStake` are currency amounts, such as `1` or `1.5`, not base units.
- `betCount` defaults to `1`. For Limbo, Plinko, Range, Soccer, and Wheel, MCP reads the current game parameters and rejects a value above that game's on-chain maximum; Coinflip does not publish a maximum.
- `metadata` values must be JSON-compatible strings, numbers, or booleans. Send large integer metadata values as strings.
- `gasBudget` is in MIST.
- `useGasCoin` is only for native SUI bet coin handling when overriding Mysten's default coin intent behavior.
- `executionWallet` is `"connected"` or `"session"` for execute mode. `"connected"` opens browser approval; `"session"` signs and submits with the local session wallet.
- `sessionWalletId` selects a named local session wallet when supported and defaults to the first wallet.
- Wallet pairing inputs include optional `webUrl`, `timeoutMs`, `maxBodyBytes`, `open`, and `noOpen`; `open` and `noOpen` are mutually exclusive.

Referral claim builders require `owner`; commission claims optionally accept `coinType`, while level-up USD reward claims use configured USDC. Their SDK-built transaction transfers the claimed coin to `owner`.

NFT V1 minting requires `owner` and `specId`; the MCP tool resolves the selected spec's SUI price from the configured NFT factory when building.

Do not pass explicit coin object ids. The MCP package intentionally uses SDK public transaction builders.

## Game Inputs

Standard game fields:

- Coinflip: `side: "heads" | "tails"`
- Limbo: `targetMultiplier: number`
- Plinko: `configId: number` from live `parameters.configs`
- Range: `leftPoint: number`, `rightPoint: number`, optional `outOfRange`; validate against live bounds
- Soccer: `configId: number` from `parameters.configs`; resolve the user's country name against `parameters.countries.contents[].value` and pass its `key` as `countryId`; use `shotZoneId: number` from the selected config's `shot_zone_ids`
- Wheel: `configId: number` from live `parameters.configs`

PvP coinflip fields:

- Create: `owner`, `stake`, `creatorSide`, optional `isPrivate`
- Join: `owner`, `gameId`, optional `coinType`
- Cancel: `owner`, `gameId`, optional `coinType`

PvP coinflip create uses the MCP field name `creatorSide`; the SDK builder receives that value as `side`.

NFT V1 mint fields:

- Mint: `owner`, `specId`, optional `gasBudget`, optional `useGasCoin`

## Gotchas

- Keep MCP usage read-only with respect to user assets unless the user explicitly requests `execute` mode or session-wallet setup/funding.
- Paired-wallet `execute` opens browser approval. Session-wallet `execute` signs and submits directly from the local session wallet key stored in the OS keychain, so use it only for a dedicated low-funded wallet the user intentionally set up.
- Use `read_config` before building when network, coin, package ids, or supported games are uncertain.
- Pass partner attribution as top-level `partner`; do not set `metadata.partner` or `metadata.referrer`.
- Use PvP tools for PvP coinflip. Do not route PvP coinflip through standard game builders.
- Use `read_game_metadata` before supplying any live game input or non-default `betCount`. It provides the valid Plinko/Wheel configs, Soccer configs/countries/shot zones, and limits used by MCP's on-chain maximum validation for Limbo, Plinko, Range, Soccer, and Wheel. For a natural-language Soccer country request, match the returned country name and pass its key as `countryId`; do not guess an ID or substitute an ISO code.
- For PvP join, expect live object reads while building or dry-running because the SDK resolves the current game stake from the game object.
- `list_nfts` is read-only. Use `build_nft_v1_mint_transaction` for NFT V1 mint plans, builds, dry-runs, or explicit execute-mode requests.
- Use `get_referral_commission` or `get_referral_level_up_usd_rewards` before presenting a claimable referral amount. Use the matching referral claim transaction tool only for a plan, build, dry-run, or explicit execute-mode request.
- Surface tool errors with the missing field, unsupported config, network, or coin detail needed for retry.
