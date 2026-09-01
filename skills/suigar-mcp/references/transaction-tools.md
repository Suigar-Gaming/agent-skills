# MCP Transaction Tools Specification

Use this specification for `@suigar/mcp` transaction routing, modes, common inputs, and game-specific fields.

## Modes

Use the lightest mode that answers the request:

| Mode | Use when |
| --- | --- |
| `read-only` | The user needs a resolved plan without transaction bytes. |
| `build` | The user needs unsigned base64 bytes for a wallet or app to sign. |
| `dry-run` | The user needs raw and summarized Sui simulation data for the unsigned transaction. |
| `execute` | The user explicitly wants MCP to execute through paired browser-wallet approval or a local session wallet. |

App-capable clients may render the bundled Suigar Transaction Inspector UI. All tool responses should include text `content` and `structuredContent`.

## Common Inputs

- `network` defaults to `testnet`; only `testnet` and `mainnet` are supported.
- `providerUrl` can override the Sui gRPC endpoint.
- `config` accepts SDK-style `packageIds`, `objectIds`, and coin-metadata overrides. Game, referral, and core packages use `@suigar/*` MVR names by default, with optional `packageIds` entries for explicit package overrides; `nftV1` remains network configured. Put a custom price-info object id beside its coin as `coins.sui.priceInfoObjectId` or `coins.usdc.priceInfoObjectId`; singleton ids such as `sweetHouse` and `nftV1Factory` belong in `objectIds`.
- `partner` is a top-level partner wallet address forwarded through `suigar({ partner })`.
- `owner` accepts a Sui address, SuiNS name, or SuiNS subname in build, dry-run, paired-wallet execute, NFT, wallet, SweetHouse, and referral reads.
- `coinType` defaults to the SDK-configured SUI coin type.
- `amount`, `stake`, and `cashStake` are currency amounts, such as `1` or `1.5`, not base units.
- `gasBudget` is in MIST.
- `executionWallet` is `"connected"` or `"session"` for execute mode. `"connected"` opens browser approval; `"session"` signs and submits with the local session wallet.
- `sessionWalletId` selects a named local session wallet when supported and defaults to the first wallet.

Transaction tools that accept `metadata` require JSON-compatible strings, numbers, or booleans. Send large integer metadata values as strings.

`useGasCoin` is for transaction tools that source native SUI coins, including native SUI bets, NFT V1 mint, and SweetHouse deposit, when overriding Mysten's default coin intent behavior. PvP Coinflip cancel and SweetHouse redeem/claim flows do not accept `useGasCoin`.

Do not pass explicit coin object ids. The MCP package intentionally uses SDK public transaction builders.

## Standard Game Tools

- `build_coinflip_transaction`: `owner`, `stake`, `side`
- `build_keno_transaction`: `owner`, `stake`, `configId`, `picks`
- `build_limbo_transaction`: `owner`, `stake`, `targetMultiplier`
- `build_plinko_transaction`: `owner`, `stake`, `configId`
- `build_range_transaction`: `owner`, `stake`, `leftPoint`, `rightPoint`, optional `outOfRange`
- `build_soccer_transaction`: `owner`, `stake`, `configId`, `countryId`, `shotZoneId`
- `build_wheel_transaction`: `owner`, `stake`, `configId`

Use `read_game_metadata` before showing or validating live stake limits, RTP, Keno/Plinko/Wheel configs, Soccer configs/countries/shot zones, Range bounds, or non-default `betCount`. MCP rejects `betCount` above the on-chain maximum for Keno, Limbo, Plinko, Range, Soccer, and Wheel. Coinflip does not publish a maximum.

For natural-language Soccer country requests, match the returned country name in `parameters.countries.contents[].value` and pass its `key` as `countryId`; do not guess an ID or substitute an ISO code.

## PvP Coinflip Tools

- `build_pvp_coinflip_create_transaction`: `owner`, `stake`, `creatorSide`, optional `isPrivate`
- `build_pvp_coinflip_join_transaction`: `owner`, `gameId`, optional `coinType`
- `build_pvp_coinflip_cancel_transaction`: `owner`, `gameId`, optional `coinType`

PvP Coinflip create uses the MCP field name `creatorSide`; the SDK builder receives that value as `side`. PvP Coinflip cancel does not accept `metadata` or `useGasCoin`.

For PvP join, expect live object reads while building or dry-running because the SDK resolves the current game stake from the game object.

## NFT, Referral, And SweetHouse Tools

- `build_nft_v1_mint_transaction`: `owner`, `specId`, optional `gasBudget`, optional `useGasCoin`
- `build_referral_commission_claim_transaction`: `owner`, optional `coinType`
- `build_referral_level_up_usd_rewards_claim_transaction`: `owner`
- `build_sweethouse_deposit_transaction`: `owner`, `amount`, optional `coinType`, optional `gasBudget`, optional `useGasCoin`
- `build_sweethouse_redeem_request_transaction`: `owner`, `amount`, optional `coinType`, optional `gasBudget`
- `build_sweethouse_claim_own_redeem_request_after_delay_transaction`: `owner`, `requestId`, optional `coinType`, optional `gasBudget`

NFT V1 minting resolves the selected spec's SUI price from the configured NFT factory when building.

Referral claim builders transfer the claimed coin to `owner`. Use `get_referral_commission` or `get_referral_level_up_usd_rewards` before presenting claimable amounts.

SweetHouse tools support `mode: "read-only"` to explain targets and required inputs without transaction bytes; build, dry-run, and execute modes require SDK-required fields. SweetHouse delayed claim `requestId` must be a Sui object id, and the signer must be the request creator.
