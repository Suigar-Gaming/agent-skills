# Plinko Specification

Use this specification for `client.suigar.tx.createGameBet({ game: 'plinko', ... })` when the game depends on a selected Plinko board configuration.

## Inputs

Required:

- `owner`
- `coinType`
- `stake`
- `configId: number`

Shared optional fields are `cashStake`, `betCount`, `metadata`, `gasBudget`, and `useGasCoin`.

## Parameters

Read current configuration and limits with:

```ts
const parameters = await client.suigar.getGameParameters({
	game: 'plinko',
	coinType,
});
```

Useful on-chain fields:

- `min_stake`
- `max_stake`
- `configs.contents`
- `max_number_of_balls`

Use `configId` from live `parameters.configs`. Validate non-default `betCount` against `max_number_of_balls`.

## Transaction

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'plinko',
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	configId,
});
```

Do not duplicate board configuration constants in application code when live parameters are available.

## Result Details

`BetResultEvent.game_details` includes:

- `slot_index`
- `multiplier`
- `payout_amount`
- `plinko_config`
