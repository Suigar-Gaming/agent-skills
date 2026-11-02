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

Use events from the Sui core API (`SuiClientTypes.Event`), with `eventType`, `module`, and `bcs: Uint8Array`.

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

The normalized result is `{ game, event: { type, data } }`, with `gameDetails` only for `BetResultEvent`. Read the raw decoded fields from `decoded.event.data`; the top-level game details parser does not normalize Move float structs inside that data. Unsupported events or missing/non-`Uint8Array` BCS return `null`; malformed supported payloads can throw, so isolate failures per event when processing a mixed stream.

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

For SweetHouse redeem events, use `client.suigar.bcs.RedeemRequestCreatedEvent`; for referral claim events, use `client.suigar.bcs.ReferrerClaimCommissionBalanceEvent` or `client.suigar.bcs.ReferrerClaimLevelUpUsdRewardsEvent`. `parseSuigarEvent` is for supported game events. Match the event type before choosing a generated helper.

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

Known vector detail fields are decoded as arrays: for example, Keno `picks` and `drawn_numbers` are `number[]`, while `payout_amount` is `bigint` and `multiplier` is a JavaScript number. Unknown detail keys fall back to string decoding; they are not automatically interpreted as arbitrary numeric fields. Event `metadata` stays a raw vec-map of bytes and follows the application's own encoding contract.

Parsed `u64` and `u128` game detail values return `bigint` to preserve precision. Convert them to display strings or decimal UI values only at the presentation boundary.
