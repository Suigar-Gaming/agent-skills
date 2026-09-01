# NFT V1 Minting Specification

Use this specification for SDK application code that builds a Suigar NFT V1 mint transaction after selecting a catalog specification.

## Builder

Build NFT V1 mints with the configured SDK transaction builder:

```ts
const tx = client.suigar.tx.nftV1.mint({
	owner,
	specId,
});
```

Required:

- `owner`
- `specId`

Optional:

- `gasBudget`
- `useGasCoin`

Derive `specId` from the decoded `NftV1Factory` catalog. The builder mints directly to the transaction sender, resolves the selected specification's SUI price from `objectIds.nftV1Factory`, and resolves the NFT package and SweetHouse object from SDK config.

## Boundaries

- Do not hand-write the Move target.
- Do not hard-code mint price, NFT package id, factory id, or SweetHouse id.
- Use `useGasCoin` only when the app intentionally needs to override Mysten's default native SUI coin intent behavior.
- Submit or serialize the unsigned transaction through the application's normal wallet flow.
