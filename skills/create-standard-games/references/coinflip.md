# Coinflip Specification

Use this specification for `client.suigar.tx.createGameBet({ game: 'coinflip', ... })` when the player chooses a coin side.

## Inputs

Required:

- `owner`
- `coinType`
- `stake`
- `side: 'heads' | 'tails'`

Shared optional fields are `cashStake`, `betCount`, `metadata`, `gasBudget`, and `useGasCoin`.

## Parameters

Read current bounds with:

```ts
const parameters = await client.suigar.getGameParameters({
	game: 'coinflip',
	coinType,
});
```

Useful on-chain fields:

- `min_stake`
- `max_stake`

Coinflip does not publish a maximum `betCount`.

## Transaction

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'coinflip',
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	side: 'heads',
});
```

Preserve the UI-selected side exactly. Do not substitute random local coin-flip logic before building the transaction.

## Result Details

`BetResultEvent.game_details` includes:

- `player_bet`
- `coin_outcome`
