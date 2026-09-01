# Keno Specification

Use this specification for `client.suigar.tx.createGameBet({ game: 'keno', ... })` when the player chooses board positions for a selected Keno configuration.

## Inputs

Required:

- `owner`
- `coinType`
- `stake`
- `configId: number`
- `picks: number[]`

Shared optional fields are `cashStake`, `betCount`, `metadata`, `gasBudget`, and `useGasCoin`.

## Parameters

Read current configuration and limits with:

```ts
const parameters = await client.suigar.getGameParameters({
	game: 'keno',
	coinType,
});
```

Useful on-chain fields:

- `min_stake`
- `max_stake`
- `configs.contents`
- `max_number_of_games`

Use `configId` from live `parameters.configs`. Validate non-default `betCount` against `max_number_of_games`. Pass `picks` as the player-selected board positions; the SDK validates each value as a u8-compatible integer.

## Transaction

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'keno',
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	configId,
	picks,
});
```

Do not hand-write the Keno Move call or pre-encode `picks`.

## Result Details

`BetResultEvent.game_details` includes:

- `keno_config`
- `board_size`
- `draw_count`
- `picks`
- `drawn_numbers`
- `hit_count`
- `multiplier`
- `payout_amount`
- `actual_rtp`
