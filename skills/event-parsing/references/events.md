# Event And Numeric Parsing Specification

Use this specification when the task is about parsing Suigar events, decoding `BetResultEvent.game_details`, or safely converting raw generated Move numeric structs.

## Public Imports

```ts
import {
	fromMoveFloat,
	fromMoveI64,
	isMoveFloat,
	isMoveI64,
	parseGameDetails,
	parseGameEvent,
	parseSuigarEvent,
} from '@suigar/sdk/utils';
```

## Game Events

Prefer `parseSuigarEvent(event)` when the raw Sui event includes BCS bytes. It resolves the supported Suigar `game`, decodes the event payload, and includes decoded `gameDetails` for `BetResultEvent`.

```ts
const decoded = parseSuigarEvent(event);
if (decoded?.event.type === 'BetResultEvent') {
	const result = {
		game: decoded.game,
		event: decoded.event.type,
		details: decoded.gameDetails,
	};
}
```

Use manual staged decoding when the app needs direct access to `BetResultEvent` data:

```ts
const parsed = parseGameEvent(event);
if (parsed?.event === 'BetResultEvent') {
	const decoded = client.suigar.bcs.BetResultEvent.parse(event.bcs);
	const details = parseGameDetails({
		game: parsed.game,
		gameDetails: decoded.game_details,
	});
	const price = fromMoveFloat(decoded.adjusted_oracle_usd_coin_price);
}
```

`parseGameEvent(event)` returns `{ game, event }`. Do not use the older `gameId` or `eventName` field names. `parseGameDetails({ game, gameDetails })` decodes known detail keys and preserves on-chain key names.

For PvP Coinflip, use `client.suigar.bcs.PvPCoinflipGameCreatedEvent`, `PvPCoinflipGameResolvedEvent`, and `PvPCoinflipGameCancelledEvent` when direct event parsing is needed.

For SweetHouse redeem events, use `client.suigar.bcs.RedeemRequestCreatedEvent`; `parseSuigarEvent` is for supported game events.

## Raw Move Numerics

`client.suigar.getGameParameters()` already converts generated Move float fields to JavaScript numbers. Use the guards only when raw generated BCS data comes from another path.

```ts
if (isMoveFloat(value)) {
	const number = fromMoveFloat(value);
}

if (isMoveI64(value)) {
	const number = fromMoveI64(value);
}
```

Parsed `u64` and `u128` game detail values return `bigint` to preserve precision. Convert them to display strings or decimal UI values only at the presentation boundary.
