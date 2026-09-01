---
name: suigar-mcp
description: Install, configure, operate, or troubleshoot the @suigar/mcp server, bundled MCP App, or plugin bundle for Suigar. Use when adding direct MCP configuration or installing the Codex, Claude Code, or Cursor plugin; reading config, live game metadata, wallet balances, coin objects, NFT V1 catalog/ownership, or referral rewards; building standard, PvP, referral-claim, NFT V1 mint, or SweetHouse transaction plans including Keno and Soccer; using read-only/build/dry-run/execute modes; pairing browser wallets; managing local session wallets; handling SuiNS owner inputs; or explaining MCP safety boundaries.
license: MIT
metadata:
  author: suigar
  version: '1.9.0'
  short-description: Operate the Suigar MCP server
  tags:
    - suigar
    - sui
    - mcp
    - transactions
---

# Suigar MCP

Use this skill for `@suigar/mcp` operation. If the user is writing application code that imports `@suigar/sdk`, use `installation`, `create-standard-games`, `create-pvp-games`, [sweethouse](../sweethouse/SKILL.md), [suigar-nft](../suigar-nft/SKILL.md), or [referrals](../referrals/SKILL.md) instead.

The MCP server is a thin layer over `@suigar/sdk`. It reads Suigar config, game metadata, wallet balances, coin objects, NFTs, and referral rewards; builds unsigned transactions; dry-runs unsigned transactions; and can execute only through an explicit paired-wallet approval or a user-created local session wallet.

Target the beta package when matching the current MCP surface: `@suigar/mcp@beta` resolves to `1.0.0-beta.27`, which uses `@suigar/sdk@2.0.0-beta.41`.

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

The repository marketplace resolves the plugin at `packages/mcp/plugin`. After adding it, install or enable `suigar-mcp` from the Suigar source in the Plugins directory. Use a local path only while developing unpublished changes in a checkout.

For Claude Code, add the public Suigar marketplace from GitHub and install the plugin:

```text
/plugin marketplace add Suigar-Gaming/ts-sdks@main
/plugin install suigar-mcp@suigar
```

For Cursor, install through the Suigar repository marketplace at `https://github.com/Suigar-Gaming/ts-sdks` and reload Cursor. Do not tell users to manually edit the generated plugin manifests or their version-pinned `.mcp.json`.

## Tool Routing

Start with read tools when network, coin, package, or game support is unclear:

- `read_config`: inspect network, provider URL, NFT V1 package id, configured coins, and supported games.
- `read_game_metadata`: inspect one required game id's live on-chain parameters, package id, default or requested coin type, transaction surface, and support notes. Pass `ignoreCache: true` to refresh SDK-cached parameters.
- `list_nfts`: read the NFT V1 catalog and matching NFTs owned by one required address or SuiNS name. It returns display-friendly identifiers and NFT image URLs.
- `get_wallet_balances`: list aggregate balances for the connected wallet, a local session wallet, or an explicit owner.
- `list_wallet_coins`: list paginated coin objects for the connected wallet, a local session wallet, or an explicit owner.
- `get_connection_status`: inspect paired browser-wallet connection state.
- `get_session_wallet`: inspect the local session wallet public address, balances, and funding links without exposing its private key.
- `get_execution_status`: check the browser approval status for an execute-mode transaction request.
- `get_referral_commission`: simulate the commission claimable by one referrer for a selected or default coin type.
- `get_referral_level_up_usd_rewards`: simulate the USD level-up rewards claimable by one referrer.

Use transaction tools for supported on-chain games, referrals, NFT V1 minting, SweetHouse flows, and wallet setup flows. For modes, required fields, and input gotchas, read [references/transaction-tools.md](references/transaction-tools.md).

- `setup_session_wallet`
- `fund_session_wallet`
- `suigar_login`
- `suigar_logout`
- `build_coinflip_transaction`
- `build_keno_transaction`
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
- `build_sweethouse_deposit_transaction`
- `build_sweethouse_redeem_request_transaction`
- `build_sweethouse_claim_own_redeem_request_after_delay_transaction`

Do not invent tools for unsupported games. Slots are backend-driven and are not exposed as an MCP transaction builder.

## Modes

Use the lightest mode that answers the request. For `read-only`, `build`, `dry-run`, and `execute` behavior, read [references/transaction-tools.md](references/transaction-tools.md).

Use `read_game_metadata` before showing or validating live stake limits, RTP, or Keno, Plinko, Soccer, or Wheel configuration. It requires `game`; use `read_config` instead for broad discovery.

Use `list_nfts` for read-only NFT V1 browsing. App-capable hosts render the catalog and owned NFTs in separate views; unsupported image URLs remain available as text.

Referral amount reads are read-only simulations of the SDK's real claim transaction. They require `owner`; commission accepts an optional `coinType` and defaults to configured SUI, while level-up USD rewards use configured USDC. They return `0` when a claim cannot be simulated or is unavailable. For SDK application integration or partner attribution, use [referrals](../referrals/SKILL.md).

SweetHouse tools build public pool deposits, staked-coin redeem requests, and delayed self-claims for existing redeem requests. Use `mode: "read-only"` to explain targets and required inputs without transaction bytes; build, dry-run, and execute modes require SDK-required fields. For SDK application integration, use [sweethouse](../sweethouse/SKILL.md).

Wallet tools manage two different wallet paths. Use `suigar_login`, `suigar_logout`, and `get_connection_status` for paired browser-wallet approval flows. Use `setup_session_wallet`, `get_session_wallet`, and `fund_session_wallet` for a persistent local session wallet. For approval and session-wallet boundaries, read [references/wallets.md](references/wallets.md).

## Common Inputs And Game Fields

For common MCP inputs, standard game fields, PvP Coinflip fields, NFT mint inputs, referral claim inputs, and SweetHouse fields, read [references/transaction-tools.md](references/transaction-tools.md).

## Gotchas

- Keep MCP usage read-only with respect to user assets unless the user explicitly requests `execute` mode or session-wallet setup/funding.
- Paired-wallet `execute` opens browser approval. Session-wallet `execute` signs and submits directly from the local session wallet key stored in the OS keychain, so use it only for a dedicated low-funded wallet the user intentionally set up. Read [references/wallets.md](references/wallets.md) for wallet-specific behavior.
- Use `read_config` before building when network, coin, NFT V1 package id, or supported games are uncertain.
- Pass partner attribution as top-level `partner`; do not set `metadata.partner` or `metadata.referrer`.
- Use PvP tools for PvP Coinflip. Do not route PvP Coinflip through standard game builders.
- Use `read_game_metadata` before supplying any live game input or non-default `betCount`. It provides the valid Keno/Plinko/Wheel configs, Soccer configs/countries/shot zones, and limits used by MCP's on-chain maximum validation for Keno, Limbo, Plinko, Range, Soccer, and Wheel. For a natural-language Soccer country request, match the returned country name and pass its key as `countryId`; do not guess an ID or substitute an ISO code.
- For PvP join, expect live object reads while building or dry-running because the SDK resolves the current game stake from the game object.
- `list_nfts` is read-only. Use `build_nft_v1_mint_transaction` for NFT V1 mint plans, builds, dry-runs, or explicit execute-mode requests.
- Use `get_referral_commission` or `get_referral_level_up_usd_rewards` before presenting a claimable referral amount. Use the matching referral claim transaction tool only for a plan, build, dry-run, or explicit execute-mode request.
- Use SweetHouse transaction tools for public pool liquidity flows. Do not route deposits or redeem requests through standard game, referral, or NFT builders.
- Surface tool errors with the missing field, unsupported config, network, or coin detail needed for retry.
