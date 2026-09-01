---
name: sweethouse
description: Build, scaffold, review, or fix Suigar SweetHouse public pool flows using @suigar/sdk. Use when depositing into SweetHouse, minting staked coins, creating redeem requests from staked coins, claiming a delayed own redeem request, decoding SweetHouse redeem events, or keeping SweetHouse liquidity flows separate from standard game, PvP, referral, NFT, or MCP APIs.
license: MIT
metadata:
  author: suigar
  version: '1.1.0'
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
6. For action-specific inputs, examples, and event details, read [references/public-pool.md](references/public-pool.md).

## Transaction Builders

SweetHouse exposes three public pool builders:

- `client.suigar.tx.sweetHouse.deposit(options)`
- `client.suigar.tx.sweetHouse.redeemRequest(options)`
- `client.suigar.tx.sweetHouse.claimOwnRedeemRequestAfterDelay(options)`

Read [references/public-pool.md](references/public-pool.md) for required inputs, examples, staked-coin behavior, and redeem event parsing.

## Gotchas

- SweetHouse flows use `amount`, not `stake`, because they are pool liquidity transactions rather than game bets.
- Use base-unit `bigint` amounts once values leave the UI layer.
- Do not use `client.suigar.tx.createGameBet` for deposits, redeem requests, or delayed claims.
- Do not use referral or NFT builders for SweetHouse liquidity flows.
- Derive coin types and decimals from `client.suigar.getConfig().coins`; do not duplicate supported coin metadata unless the runtime config requires it.
- Derive `objectIds.sweetHouse` from SDK config. Do not hard-code network-specific SweetHouse ids in app code.

## Checklist

1. Confirm `suigar()` is registered on the Sui client.
2. Pick `deposit`, `redeemRequest`, or `claimOwnRedeemRequestAfterDelay` and read [references/public-pool.md](references/public-pool.md).
3. Pass `owner`, `coinType`, and the required `amount` or `requestId`.
4. Keep `useGasCoin` limited to deposits.
5. Submit or serialize through the app's normal unsigned transaction flow.
