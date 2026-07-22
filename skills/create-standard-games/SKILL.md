---
name: create-standard-games
description: Build, scaffold, review, or fix standard single-player Suigar game flows using @suigar/sdk. Use when creating coinflip, limbo, plinko, range, soccer, or wheel bet transactions; reading live stake limits, RTP, or game configurations; mapping UI inputs to client.suigar.tx.createBetTransaction; handling stake/cashStake/betCount/metadata; decoding BetResultEvent; or correcting AI-generated code that manually selects coins, invents game builders, or misroutes standard games through MCP or PvP APIs.
license: MIT
metadata:
  author: suigar
  version: "1.3.0"
  short-description: Build standard Suigar game flows
  tags:
    - suigar
    - sui
    - sdk
    - standard-games
---

# Create Standard Suigar Games

Use this skill for application code that imports `@suigar/sdk` and builds standard single-player game transactions. If the app setup is missing, use `installation` first. If the user is using `@suigar/mcp` tools, use `suigar-mcp` instead.

> Source constraint: Treat the SDK public API as the source of truth. Do not invent transaction builders or hand-copy Move call internals into app code.

## Default Workflow

1. Confirm the target game id: `coinflip`, `limbo`, `plinko`, `range`, `soccer`, or `wheel`.
2. Confirm the client has the `suigar()` extension registered.
3. Build the transaction with `client.suigar.tx.createBetTransaction(gameId, options)`.
4. Let the SDK source bet coins through Mysten `coinWithBalance` transaction arguments.
5. Serialize only if the wallet or transport layer needs bytes.
6. Decode emitted results with `client.suigar.bcs.BetResultEvent`, `parseGameEvent`, and `parseGameDetails`.

## Imports and Types

Use game types from `@suigar/sdk/games`:

```ts
import { GAMES, type Game, type StandardGame, type CoinSide } from '@suigar/sdk/games';
```

Do not redefine game id unions unless the local app already has a stricter UI type.

## Shared Options

Every standard bet uses:

- `owner: string`
- `coinType: string`
- `stake: number | bigint`
- `cashStake?: number | bigint`
- `betCount?: number | bigint`
- `metadata?: Record<string, string | number | boolean | bigint | Uint8Array | number[] | null | undefined>`
- `gasBudget?: number | bigint`
- `useGasCoin?: boolean`

Set `useGasCoin` only when the app needs to override Mysten's default native SUI coin intent behavior. Do not pass coin object ids, split coins manually, or add custom bet coin callbacks.

Attribution is an extension-level option: `suigar({ partner?: string })` prepends the partner wallet address to metadata automatically across supported bet flows.

## Game Inputs

| Game | Required inputs | Notes |
|---|---|---|
| `coinflip` | `side: 'heads' | 'tails'` | Preserve the UI-selected side exactly. |
| `limbo` | `targetMultiplier: number` | Pass human decimal values; the SDK applies scale. |
| `plinko` | `configId: number` | Select the id from live `parameters.configs`. |
| `range` | `leftPoint: number`, `rightPoint: number` | Keep points ordered; optional `outOfRange` and `scale`. |
| `soccer` | `configId: number`, `countryId: number`, `shotZoneId: number` | Select `configId` from `parameters.configs`; resolve the user's country name against `parameters.countries.contents[].value` and pass its `key`; select `shotZoneId` from that config's `shot_zone_ids`. |
| `wheel` | `configId: number` | Select the id from live `parameters.configs`. |

## Live Game Parameters

Read `client.suigar.getGameParameters(gameId, { coinType })` before presenting or validating live stake limits, RTP, or game inputs. The SDK returns generated Move float fields as JavaScript numbers and caches results for 30 minutes by default; pass `ignoreCache: true` when a fresh on-chain read is needed.

Use game parameters as the source of truth: select Plinko and Wheel `configId` from `parameters.configs`; for Soccer, select `configId` from `parameters.configs`, resolve a natural-language country request against `parameters.countries.contents[].value` and pass its numeric `key` as `countryId`, then select `shotZoneId` from the chosen config's `shot_zone_ids`. Do not assume country IDs or ISO codes; ask for clarification if the requested country does not match the returned names. Validate Limbo target multipliers and Range points against their returned bounds rather than copied application constants.

## Game Examples

### Coinflip

Use `coinflip` when the player chooses a side explicitly:

```ts
const tx = client.suigar.tx.createBetTransaction('coinflip', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	side: 'heads',
});
```

Preserve the UI-selected side exactly.

### Limbo

Use `limbo` when the player bets against a target multiplier:

```ts
const tx = client.suigar.tx.createBetTransaction('limbo', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	targetMultiplier,
});
```

Keep UI decimal inputs as numbers until the SDK converts them using the configured or default scale.

### Plinko

Use `plinko` when the game depends on a predefined board configuration:

```ts
const tx = client.suigar.tx.createBetTransaction('plinko', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	configId,
});
```

### Range

Use `range` when the player chooses a bounded interval and optional in-range or out-of-range behavior:

```ts
const tx = client.suigar.tx.createBetTransaction('range', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	leftPoint,
	rightPoint,
	outOfRange,
});
```

Do not pre-scale range points in app code.

### Wheel

Use `wheel` when the game depends on a predefined wheel configuration:

```ts
const tx = client.suigar.tx.createBetTransaction('wheel', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	configId,
});
```

### Soccer

Use `soccer` with the selected on-chain configuration, country, and shot-zone identifiers:

```ts
const tx = client.suigar.tx.createBetTransaction('soccer', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	configId,
	countryId,
	shotZoneId,
});
```

## Event Decoding

```ts
import { fromMoveFloat, parseGameDetails, parseGameEvent } from '@suigar/sdk/utils';

const parsed = parseGameEvent(event);
if (parsed?.eventName === 'BetResultEvent') {
	const decoded = client.suigar.bcs.BetResultEvent.parse(event.bcs);
	const gameDetails = parseGameDetails(parsed.gameId, decoded.game_details);
	const adjustedOraclePrice = fromMoveFloat(decoded.adjusted_oracle_usd_coin_price);
}
```

Use `event.bcs` as the event payload when available. `parseGameDetails` preserves on-chain keys and returns decoded string, number, and boolean values.

## Gotchas

- Do not model standard games with PvP builders or MCP transaction tool names.
- Do not set `metadata.partner` or `metadata.referrer`; configure `suigar({ partner: '<wallet-address>' })` once instead.
- Treat `partner` as a wallet address, not a campaign slug.
- Use `cashStake` only when the withdrawn coin amount must differ from the game stake.
- `betCount` defaults to `1`; before accepting a larger value, validate against the current game parameters when that game publishes a maximum: Limbo and Range `max_number_of_games`, Plinko `max_number_of_balls`, Soccer `max_number_of_shots`, and Wheel `max_number_of_spins`.
- Pass plain application values in `metadata`; let the SDK encode them.
- For range, do not pre-scale points in app code. With the default scale `1_000_000`, valid UI values are `0` to `100`.
- Keep amounts as `bigint` once they leave the UI layer.
- Ensure the same connected wallet address is used as `owner`.
- Use `client.suigar.getConfig().coins` when the UI needs supported coin types and decimals.
- Metadata remains generic `VecMap<string, vector<u8>>` data in events; decode it according to the app's own metadata contract.

## Implementation Checklist

1. Confirm the target standard game id.
2. Verify the base client already has `suigar()` configured.
3. Build the transaction with `createBetTransaction`.
4. Serialize only if the surrounding wallet or transport path needs bytes.
5. Decode `BetResultEvent` with `client.suigar.bcs.BetResultEvent` and `parseGameDetails`.
6. Keep frontend forms, backend handlers, and event decoding aligned with the same game-specific option shape.
