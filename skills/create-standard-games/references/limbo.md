# Limbo Specification

Use this specification for `client.suigar.tx.createGameBet({ game: 'limbo', ... })` when the player bets against a target multiplier.

## Inputs

Required:

- `owner`
- `coinType`
- `stake`
- `targetMultiplier: number`

Shared optional fields are `cashStake`, `betCount`, `metadata`, `gasBudget`, and `useGasCoin`. `scale` is available for advanced integrations; ordinary UI code should pass human decimal multipliers and let the SDK apply the default scale.

## Parameters

Read current bounds with:

```ts
const parameters = await client.suigar.getGameParameters({
	game: 'limbo',
	coinType,
});
```

Useful on-chain fields:

- `min_stake`
- `max_stake`
- `min_target_multiplier`
- `max_target_multiplier`
- `max_number_of_games`

Validate non-default `betCount` against `max_number_of_games`.

## Transaction

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'limbo',
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	targetMultiplier,
});
```

Keep UI multiplier input as a decimal number until it reaches the SDK.

## Result Details

`BetResultEvent.game_details` includes:

- `payout_amount`
- `win`
- `roll_multiplier`
- `payout_multiplier`
- `target_multiplier`
- `actual_rtp`
