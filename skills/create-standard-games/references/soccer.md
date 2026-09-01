# Soccer Specification

Use this specification for `client.suigar.tx.createGameBet({ game: 'soccer', ... })` when the player selects a Soccer configuration, country, and shot zone from live metadata.

## Inputs

Required:

- `owner`
- `coinType`
- `stake`
- `configId: number`
- `countryId: number`
- `shotZoneId: number`

Shared optional fields are `cashStake`, `betCount`, `metadata`, `gasBudget`, and `useGasCoin`.

## Parameters

Read current configuration and limits with:

```ts
const parameters = await client.suigar.getGameParameters({
	game: 'soccer',
	coinType,
});
```

Useful on-chain fields:

- `min_stake`
- `max_stake`
- `configs.contents`
- `countries.contents`
- selected config `shot_zone_ids`
- `max_number_of_shots`

Use `configId` from live `parameters.configs`. Resolve a natural-language country name against `parameters.countries.contents[].value` and pass its `key` as `countryId`. Use `shotZoneId` from the selected config's `shot_zone_ids`. Ask for clarification if no country name matches; do not guess an ID or substitute an ISO code.

Validate non-default `betCount` against `max_number_of_shots`.

## Transaction

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'soccer',
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	configId,
	countryId,
	shotZoneId,
});
```

Keep the UI selection tied to the same live parameter snapshot used for validation.

## Result Details

`BetResultEvent.game_details` includes:

- `soccer_config`
- `outcome_code`
- `country_id`
- `shot_zone_id`
- `is_goal`
- `multiplier`
- `payout_amount`
- `draw_value`
