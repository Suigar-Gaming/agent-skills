---
name: installation
description: Set up, scaffold, or fix the base @suigar/sdk integration for Suigar game apps on Sui. Use when installing the v2 SDK with the current Mysten Sui TypeScript SDK, wiring the suigar() Sui client extension, configuring networks/package/object/registry ids or coin metadata, serializing transactions, reading SDK config or live game parameters, using public exports, parsing Suigar events, or safely checking and converting generated Move float and i64 values. Use this before standard or PvP game skills when the client setup is missing or questionable.
license: MIT
metadata:
  author: suigar
  version: "1.4.0"
  short-description: Set up the Suigar SDK
  tags:
    - suigar
    - sui
    - sdk
    - installation
---

# Suigar SDK Installation

Use this skill for application code that imports `@suigar/sdk`. If the task is about installing, configuring, operating, or troubleshooting `@suigar/mcp`, its bundled MCP App, or its plugin bundle, use the `suigar-mcp` skill instead.

> Source constraint: Prefer public Suigar SDK entrypoints and installed package docs/source when available. Do not guess private exports or copy internal helpers into app code.

## Default Workflow

1. Confirm the app already uses the current Mysten Sui client APIs.
2. Install or verify `@suigar/sdk`, `@mysten/sui`, and `@mysten/bcs`.
3. Extend the existing Sui client with `suigar()`.
4. Keep all Suigar transaction creation and serialization on that extended client instance.
5. Use `client.suigar.getConfig()` for supported coins, package ids, and price info when the UI or diagnostics need resolved config.
6. Route game transaction work to `create-standard-games` or `create-pvp-games` after setup is correct. Route NFT V1 catalog or ownership reads to `suigar-nft-lookup`.

## Public Surface

The package exposes these public entrypoints:

- `@suigar/sdk`
- `@suigar/sdk/games`
- `@suigar/sdk/utils`

Use these public imports:

```ts
import { suigar } from '@suigar/sdk';
import type { SuigarCoin, SuigarNetwork } from '@suigar/sdk';
import { GAMES, type StandardGame, type PvPGame } from '@suigar/sdk/games';
import {
	fromMoveFloat,
	fromMoveI64,
	isMoveFloat,
	isMoveI64,
	parseGameDetails,
	parseGameEvent,
} from '@suigar/sdk/utils';
```

The package root exposes `suigar`, `SuigarClient`, `SUPPORTED_SUI_NETWORKS`, `SuigarCoin`, and `SuigarNetwork`. Game ids and game-specific option types live in `@suigar/sdk/games`. Parser and numeric helpers live in `@suigar/sdk/utils`.

Use these game-specific public types when useful: `GAMES`, `Game`, `StandardGame`, `PvPGame`, `CoinSide`, `PvPCoinflipAction`, `BuildCoinflipTransactionOptions`, `BuildLimboTransactionOptions`, `BuildPlinkoTransactionOptions`, `BuildRangeTransactionOptions`, `BuildSoccerTransactionOptions`, `BuildWheelTransactionOptions`, `BuildCreatePvPCoinflipTransactionOptions`, `BuildJoinPvPCoinflipTransactionOptions`, and `BuildCancelPvPCoinflipTransactionOptions`.

Use these utilities instead of local replacements when relevant: `fromMoveI64`, `fromMoveFloat`, `isMoveI64`, `isMoveFloat`, `parseCoinType`, `parseGameDetails`, `parseGameEvent`, `toBigInt`, `toU16`, `toU8`, `DEFAULT_GAS_BUDGET_MIST`, `RANGE_POINT_LIMIT`, `DEFAULT_RANGE_SCALE`, and `DEFAULT_LIMBO_MULTIPLIER_SCALE`.

Utility behavior worth preserving:

- `toBigInt(value)` normalizes non-negative integer-like values to `bigint` and rejects invalid or negative values.
- `toU8(value)` and `toU16(value)` validate finite integer inputs in their unsigned ranges.
- `parseCoinType(type)` extracts the normalized first generic coin type from a Move object type string.
- `parseGameDetails(gameId, gameDetails)` decodes standard `BetResultEvent.game_details` while preserving on-chain keys.
- `isMoveI64(value)` and `isMoveFloat(value)` guard unknown generated BCS values before `fromMoveI64()` or `fromMoveFloat()` converts them.

Do not import individual runtime game builders from `@suigar/sdk`. Use the registered extension:

```ts
client.suigar.tx.createBetTransaction(gameId, options);
client.suigar.tx.createPvPCoinflipTransaction(action, options);
client.suigar.serializeTransactionToBase64(tx);
```

## Client Setup

Prefer the Sui gRPC client extension pattern:

```ts
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { suigar } from '@suigar/sdk';

const client = new SuiGrpcClient({
	baseUrl: 'https://fullnode.testnet.sui.io:443',
	network: 'testnet',
}).$extend(suigar());
```

If partner attribution is required, configure it once on the extension:

```ts
const client = new SuiGrpcClient({ baseUrl, network }).$extend(
	suigar({ partner: '0xpartner_wallet_address' }),
);
```

`partner` is a wallet address. Do not pass a slug, label, display name, `metadata.partner`, or `metadata.referrer`.

If the app uses a custom extension name, preserve it consistently:

```ts
const client = new SuiGrpcClient({ baseUrl, network }).$extend(
	suigar({ name: 'suigarGames' }),
);

client.suigarGames;
```

If the published defaults lag a deployment, patch config through `suigar({ config })` instead of forking SDK internals:

```ts
const client = new SuiGrpcClient({ baseUrl, network }).$extend(
	suigar({
		config: {
			packageIds: { coinflip: '0x...' },
			objectIds: { sweetHouse: '0x...' },
			coins: {
				sui: {
					coinType: '0x2::sui::SUI',
					decimals: 9,
					priceInfoObjectId: '0x...',
				},
			},
		},
	}),
);
```

## Serialization

Serialize only when a wallet, backend, or transport path needs unsigned bytes:

```ts
const tx = client.suigar.tx.createBetTransaction('coinflip', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	side: 'heads',
});

const base64 = await client.suigar.serializeTransactionToBase64(tx);
```

## Parameters and Events

Use `client.suigar.getGameParameters(game, options?)` when an app needs live on-chain game bounds or RTP parameters. It already converts generated Move float fields to JavaScript numbers.

The SDK caches parsed parameters for `cacheTtl`, which defaults to 30 minutes. Pass `ignoreCache: true` to force an on-chain refresh when stale parameters would be risky.

For raw generated BCS data outside `getGameParameters()`, guard unknown values before converting them:

```ts
if (isMoveFloat(value)) {
	const number = fromMoveFloat(value);
}

if (isMoveI64(value)) {
	const number = fromMoveI64(value);
}
```

Use generated BCS helpers and SDK parsers for events:

```ts
const parsed = parseGameEvent(event);
if (parsed?.eventName === 'BetResultEvent') {
	const decoded = client.suigar.bcs.BetResultEvent.parse(event.bcs);
	const details = parseGameDetails(parsed.gameId, decoded.game_details);
	const price = fromMoveFloat(decoded.adjusted_oracle_usd_coin_price);
}
```

For PvP coinflip, use `client.suigar.bcs.PvPCoinflipGameCreatedEvent`, `PvPCoinflipGameResolvedEvent`, and `PvPCoinflipGameCancelledEvent`.

## Gotchas

- Keep frontends and backends on the same `owner` wallet address used to build transactions.
- Keep amounts as `bigint` once they leave the UI layer.
- Use `client.suigar.getConfig().coins` for supported `coinType` and `decimals`; do not duplicate decimal constants in app code unless runtime config requires it.
- Prefer SDK-resolved supported coin metadata from `client.suigar.getConfig()` for debugging, inspection, or UI coin selectors; simple examples can pass the expected coin type directly.
- Standard games resolve the price-info object id from the selected coin's `priceInfoObjectId` metadata.
- `packageIds` contains only Move package addresses. Use `objectIds` for singleton objects such as `sweetHouse` and `nftV1Factory`, and `registryIds` for dynamic-field registries.
- Use `client.suigar.getConfig().packageIds.nftV1` and `objectIds.nftV1Factory` only for NFT V1 catalog or ownership reads; use `suigar-nft-lookup` for that flow.
- Use `SuigarCoin` and `SuigarNetwork` when app code needs supported coin or network types.
- For object reads, parse object `content`, not `objectBcs`.
- Do not hand-decode `BetResultEvent.game_details`; use `parseGameEvent(event)` and `parseGameDetails(gameId, ...)`.
- Do not move SDK runtime builders out of `client.suigar.tx` or rely on private package paths.

## Implementation Checklist

1. Install and import `@suigar/sdk`, `@mysten/sui`, and `@mysten/bcs`.
2. Extend the current Sui client with `suigar()`.
3. Confirm the client uses the intended supported network.
4. Keep transaction creation and serialization on the same extended client instance.
5. Keep the consuming app on ESM and pass the explicit `network` required by current client constructors.
6. Route game-specific work to the standard or PvP skill after base setup is correct.
