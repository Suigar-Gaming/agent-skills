---
name: referrals
description: Configure Suigar SDK partner attribution and referral rewards in a Sui application. Use when registering a partner wallet with suigar(), checking referral commission or level-up USD reward balances, building unsigned referral claim transactions, or correcting code that places referral data in game metadata. Use suigar-mcp instead for MCP referral tools.
license: MIT
metadata:
  author: suigar
  version: '1.1.0'
  short-description: Configure Suigar referrals
  tags:
    - suigar
    - sui
    - sdk
    - referrals
---

# Suigar Referrals

Use this skill for application code that imports `@suigar/sdk`. For referral reads or unsigned claims through `@suigar/mcp`, use `suigar-mcp` instead.

> Source constraint: Use the public SDK extension surface. Do not hand-write referral Move calls or duplicate referral data in per-game metadata.

## Partner Attribution

Configure attribution once when registering the client extension:

```ts
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { suigar } from '@suigar/sdk';

const client = new SuiGrpcClient({ baseUrl, network }).$extend(
	suigar({ partner: '0xpartner_wallet_address' }),
);
```

`partner` must be a wallet address. Do not pass a campaign slug, label, or display name. Do not set `metadata.partner` or `metadata.referrer` on game transactions; the extension applies the configured partner across supported bet flows.

Keep the configured partner stable for the lifetime of the client. If an application changes it per campaign or session, create or select the correctly configured client before building transactions.

## Referral Rewards

Read the claimable amount before displaying a reward or asking the wallet to claim it. Commission claims use a selected supported coin; level-up USD reward claims use the configured USDC coin.

```ts
const claimableCommission = await client.suigar.view.referral.getCommission({
	owner,
	coinType: '0x2::sui::SUI',
});

const commissionTx = client.suigar.tx.referral.claimCommission({
	owner,
	coinType: '0x2::sui::SUI',
});

const claimableLevelUpRewards = await client.suigar.view.referral.getLevelUpUsdRewards({ owner });
const levelUpRewardsTx = client.suigar.tx.referral.claimLevelUpUsdRewards({
	owner,
});
```

The view methods simulate their matching claim transaction and return `0n` when a claim is unavailable or cannot be simulated. The builders produce unsigned transactions that transfer the claimed coin to `owner`; submit or serialize them through the application's normal wallet flow.

Use `client.suigar.getConfig().coins` for supported commission `coinType` values and display decimals. Do not infer that a balance is claimable simply because a referrer or partner exists.

## Implementation Checklist

1. Register `suigar({ partner })` once when attribution is required.
2. Pass a wallet address as `partner`; never put referral values in transaction metadata.
3. Read a claimable amount with the matching `client.suigar.view.referral` method.
4. Build the matching unsigned `client.suigar.tx.referral` transaction only when a claim is requested.
5. Keep `owner` aligned with the wallet that will receive and submit the claim.
