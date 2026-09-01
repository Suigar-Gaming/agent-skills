---
name: sweethouse
description: Build, scaffold, review, or fix Suigar SweetHouse public pool flows using @suigar/sdk. Use when depositing into SweetHouse, minting staked coins, creating redeem requests from staked coins, claiming a delayed own redeem request, decoding SweetHouse redeem events, or keeping SweetHouse liquidity flows separate from standard game, PvP, referral, NFT, or MCP APIs.
license: MIT
metadata:
  author: suigar
  version: '1.0.0'
  short-description: Build SweetHouse pool flows
  tags:
    - suigar
    - sui
    - sdk
    - sweethouse
---

# Suigar SweetHouse

Use this skill for application code that imports `@suigar/sdk` and builds SweetHouse public pool transactions. If the app has not configured the SDK client yet, use `installation` first. If the user is using `@suigar/mcp` tools, use `suigar-mcp` instead.

> Source constraint: Use `client.suigar.tx.sweetHouse`. Do not hand-write `core::sweethouse` Move calls, hard-code SweetHouse object ids, or route deposits and redeem requests through game bet builders.

## Default Workflow

1. Confirm the client is extended with `suigar()` for the intended network.
2. Resolve supported coins and `objectIds.sweetHouse` from `client.suigar.getConfig()` when UI or diagnostics need them.
3. Build one of the `client.suigar.tx.sweetHouse` transactions.
4. Serialize only if the wallet or transport layer needs unsigned bytes.
5. Decode `client.suigar.bcs.RedeemRequestCreatedEvent` when the app needs the redeem request id emitted by a redeem request.

## Transaction Builders

Deposit supported coins into the SweetHouse public pool and receive staked coins back to `owner`:

```ts
const tx = client.suigar.tx.sweetHouse.deposit({
	owner,
	coinType: '0x2::sui::SUI',
	amount: 1_000_000_000n,
});
```

Optional deposit inputs are `gasBudget` and `useGasCoin`. Set `useGasCoin` only when the app intentionally allows the SUI gas coin to be used for native SUI deposits.

Create a redeem request by spending staked coins for the selected pool:

```ts
const tx = client.suigar.tx.sweetHouse.redeemRequest({
	owner,
	coinType: '0x2::sui::SUI',
	amount: 1_000_000_000n,
});
```

The redeem request builder sources `StakedCoin<coinType>`, not the underlying coin. It does not accept `useGasCoin`.

After the on-chain delay has passed, claim an own redeem request:

```ts
const tx = client.suigar.tx.sweetHouse.claimOwnRedeemRequestAfterDelay({
	owner,
	coinType: '0x2::sui::SUI',
	requestId,
});
```

The signer must be the address that created the redeem request. `requestId` is the redeem request object id, usually obtained from the redeem request transaction effects or `RedeemRequestCreatedEvent`.

## Events

Use the generated BCS helper for SweetHouse redeem events:

```ts
const event = client.suigar.bcs.RedeemRequestCreatedEvent.parse(suiEvent.bcs);
```

For general Suigar game result events, use the standard-game or PvP skills instead. `parseSuigarEvent` is for supported game events; SweetHouse redeem events are exposed through the generated BCS helper.

## Gotchas

- SweetHouse flows use `amount`, not `stake`, because they are pool liquidity transactions rather than game bets.
- Use base-unit `bigint` amounts once values leave the UI layer.
- Do not use `client.suigar.tx.createGameBet` for deposits, redeem requests, or delayed claims.
- Do not use referral or NFT builders for SweetHouse liquidity flows.
- Derive coin types and decimals from `client.suigar.getConfig().coins`; do not duplicate supported coin metadata unless the runtime config requires it.
- Derive `objectIds.sweetHouse` from SDK config. Do not hard-code network-specific SweetHouse ids in app code.

## Checklist

1. Confirm `suigar()` is registered on the Sui client.
2. Pick `deposit`, `redeemRequest`, or `claimOwnRedeemRequestAfterDelay`.
3. Pass `owner`, `coinType`, and the required `amount` or `requestId`.
4. Keep `useGasCoin` limited to deposits.
5. Submit or serialize through the app's normal unsigned transaction flow.
