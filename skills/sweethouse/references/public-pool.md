# SweetHouse Public Pool Specification

Use this specification for SDK application code that deposits into SweetHouse, creates redeem requests from staked coins, or claims an own redeem request after the delay.

## Deposit

Deposit supported coins into the SweetHouse public pool and receive staked coins back to `owner`:

```ts
const tx = client.suigar.tx.sweetHouse.deposit({
	owner,
	coinType: '0x2::sui::SUI',
	amount: 1_000_000_000n,
});
```

Required:

- `owner`
- `coinType`
- `amount`

Optional:

- `gasBudget`
- `useGasCoin`

Set `useGasCoin` only when the app intentionally allows the SUI gas coin to be used for native SUI deposits.

## Redeem Request

Create a redeem request by spending staked coins for the selected pool:

```ts
const tx = client.suigar.tx.sweetHouse.redeemRequest({
	owner,
	coinType: '0x2::sui::SUI',
	amount: 1_000_000_000n,
});
```

Required:

- `owner`
- `coinType`
- `amount`

Optional:

- `gasBudget`

The redeem request builder sources `StakedCoin<coinType>`, not the underlying coin. It does not accept `useGasCoin` or explicit coin object ids.

## Claim Own Redeem Request After Delay

After the on-chain delay has passed, claim an own redeem request:

```ts
const tx = client.suigar.tx.sweetHouse.claimOwnRedeemRequestAfterDelay({
	owner,
	coinType: '0x2::sui::SUI',
	requestId,
});
```

Required:

- `owner`
- `coinType`
- `requestId`

Optional:

- `gasBudget`

The signer must be the address that created the redeem request. `requestId` is the redeem request object id, usually obtained from transaction effects or `RedeemRequestCreatedEvent`.

## Events

Use the generated BCS helper for SweetHouse redeem events:

```ts
const event = client.suigar.bcs.RedeemRequestCreatedEvent.parse(suiEvent.bcs);
```

`parseSuigarEvent` is for supported game events, not SweetHouse redeem events.

## Boundaries

- SweetHouse flows use `amount`, not `stake`, because they are pool liquidity transactions rather than game bets.
- Use base-unit `bigint` amounts once values leave the UI layer.
- Derive coin types and decimals from `client.suigar.getConfig().coins`.
- Derive `objectIds.sweetHouse` from SDK config. Do not hard-code network-specific SweetHouse ids in app code.
