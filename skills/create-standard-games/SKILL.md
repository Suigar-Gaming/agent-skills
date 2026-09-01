---
name: create-standard-games
description: Build, scaffold, review, or fix standard single-player Suigar game flows using @suigar/sdk. Use when creating coinflip, keno, limbo, plinko, range, soccer, or wheel bet transactions; reading live stake limits, RTP, or game configurations; mapping UI inputs to client.suigar.tx.createGameBet; handling stake/cashStake/betCount/metadata; decoding BetResultEvent; or correcting AI-generated code that manually selects coins, invents game builders, or misroutes standard games through MCP, SweetHouse, or PvP APIs.
license: MIT
metadata:
  author: suigar
  version: '1.6.0'
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

1. Confirm the target game id and read that game's reference before designing fields, validation, or result display.
2. Confirm the client has the `suigar()` extension registered.
3. Build the transaction with `client.suigar.tx.createGameBet({ game, ...options })`.
4. Let the SDK source bet coins through Mysten `coinWithBalance` transaction arguments.
5. Serialize only if the wallet or transport layer needs bytes.
6. For result display, read [event parsing](../event-parsing/references/events.md).

## Imports and Types

Use game types from `@suigar/sdk/games`:

```ts
import { GAMES, type CoinSide, type Game, type StandardGame } from '@suigar/sdk/games';
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

For partner attribution, use [referrals](../referrals/SKILL.md); it is configured once at the extension level, not in a bet payload.

## Game Inputs

Read the selected game reference for required inputs, live parameter fields, transaction examples, and decoded result details:

- `coinflip`: read [references/coinflip.md](references/coinflip.md).
- `keno`: read [references/keno.md](references/keno.md).
- `limbo`: read [references/limbo.md](references/limbo.md).
- `plinko`: read [references/plinko.md](references/plinko.md).
- `range`: read [references/range.md](references/range.md).
- `soccer`: read [references/soccer.md](references/soccer.md).
- `wheel`: read [references/wheel.md](references/wheel.md).

## Live Game Parameters

Read `client.suigar.getGameParameters({ game, coinType })` before presenting or validating live stake limits, RTP, or game inputs. The SDK returns generated Move float fields as JavaScript numbers and caches results for 30 minutes by default; pass `ignoreCache: true` when a fresh on-chain read is needed. `coinType` comes from `client.suigar.getConfig().coins`, not game parameters.

## Event Decoding

For `BetResultEvent` parsing and decoded `gameDetails` behavior, read [event parsing](../event-parsing/references/events.md).

## Gotchas

- Do not model standard games with PvP builders, SweetHouse builders, or MCP transaction tool names.
- For partner attribution, follow [referrals](../referrals/SKILL.md); do not set `metadata.partner` or `metadata.referrer`.
- Use `cashStake` only when the withdrawn coin amount must differ from the game stake.
- `betCount` defaults to `1`; before accepting a larger value, validate against the current game parameters when that game publishes a maximum: Keno, Limbo, and Range `max_number_of_games`, Plinko `max_number_of_balls`, Soccer `max_number_of_shots`, and Wheel `max_number_of_spins`.
- Pass plain application values in `metadata`; let the SDK encode them.
- For range, do not pre-scale points in app code. With the default scale `1_000_000`, valid UI values are `0` to `100`.
- Keep amounts as `bigint` once they leave the UI layer.
- Ensure the same connected wallet address is used as `owner`.
- Use `client.suigar.getConfig().coins` when the UI needs supported coin types and decimals.
- Metadata remains generic `VecMap<string, vector<u8>>` data in events; decode it according to the app's own metadata contract.

## Implementation Checklist

1. Confirm the target standard game id.
2. Verify the base client already has `suigar()` configured.
3. Build the transaction with `createGameBet`.
4. Serialize only if the surrounding wallet or transport path needs bytes.
5. Decode `BetResultEvent` with [event parsing](../event-parsing/references/events.md).
6. Keep frontend forms, backend handlers, and event decoding aligned with the same game-specific option shape.
