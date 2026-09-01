# Range Specification

Use this specification for `client.suigar.tx.createGameBet({ game: 'range', ... })` when the player chooses a bounded interval and optionally targets the outside of that interval.

## Inputs

Required:

- `owner`
- `coinType`
- `stake`
- `leftPoint: number`
- `rightPoint: number`

Optional range-specific fields:

- `outOfRange?: boolean`
- `scale?: number`

Shared optional fields are `cashStake`, `betCount`, `metadata`, `gasBudget`, and `useGasCoin`.

## Parameters

Read current bounds with:

```ts
const parameters = await client.suigar.getGameParameters({
	game: 'range',
	coinType,
});
```

Useful on-chain fields:

- `min_stake`
- `max_stake`
- `min_zone_size`
- `max_zone_size`
- `max_number_of_games`

Validate non-default `betCount` against `max_number_of_games`.

## Transaction

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'range',
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	leftPoint,
	rightPoint,
	outOfRange,
});
```

Do not pre-scale range points in app code. With the default scale `1_000_000`, valid UI values are `0` to `100`; pass those human values to the SDK.

## Result Details

`BetResultEvent.game_details` includes:

- `roll_value`
- `win`
- `payout_amount`
- `payout_multiplier`
- `left_point`
- `right_point`
- `zone_size`
- `winning_zone_size`
- `is_out_range`
- `bet_threshold`
- `roll_under`
- `range_mode`
- `win_probability`
- `win_multiplier`
- `actual_rtp`
