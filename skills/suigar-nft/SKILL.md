---
name: suigar-nft
description: Read or mint Suigar NFT V1 objects with @suigar/sdk. Use when reading and decoding `NftV1Factory`, listing or decoding an owner's `NftV1` objects, deriving the network-specific type with the SDK BCS helper, building `client.suigar.tx.nftV1.mint`, resolving a catalog spec id, or avoiding hard-coded NFT package or factory ids.
license: MIT
metadata:
  author: suigar
  version: '1.3.0'
  short-description: Read and mint Suigar NFT V1 objects
  tags:
    - suigar
    - sui
    - sdk
    - nft
---

# Suigar NFT V1

Use this skill for application code that imports `@suigar/sdk` and reads the NFT V1 catalog, lists NFTs directly owned by an address, or builds an NFT V1 mint transaction. If the app has not configured the SDK client yet, use `installation` first.

> Source constraint: Use the active client's resolved `packageIds.nftV1`, `objectIds.nftV1Factory`, and `bcs.NftV1.typeTag()`; do not hard-code a mainnet or testnet package, factory id, or Move type string.

## Default Workflow

1. Extend the Sui client with `suigar()` for the intended network.
2. Read `nftV1` from `client.suigar.getConfig().packageIds` and `nftV1Factory` from `objectIds`.
3. Fetch the factory with `content: true` and decode it using `client.suigar.bcs.NftV1Factory`.
4. Derive the owned NFT type with `client.suigar.bcs.NftV1.typeTag({ package: nftV1 })`.
5. Call `client.core.listOwnedObjects()` with `type`, `content: true`, and pagination.
6. Decode each owned object with `client.suigar.bcs.NftV1`.
7. For minting, pass a selected factory `specId` to `client.suigar.tx.nftV1.mint({ owner, specId })`.

## Catalog Lookup

The catalog object is named `NftV1Factory`. Its resolved object id is `objectIds.nftV1Factory`.

```ts
const { nftV1Factory } = client.suigar.getConfig().objectIds;
const { object } = await client.core.getObject({
	objectId: nftV1Factory,
	include: { content: true },
});

if (object instanceof Error) throw object;
if (!object.content) throw new Error('NFT factory did not return content.');

const factory = client.suigar.bcs.NftV1Factory.parse(object.content);
const specs = factory.specs.contents.map(({ value }) => ({
	id: value.id,
	name: value.name,
	description: value.description,
	imageUrl: value.url.url,
	price: value.price,
}));
```

Preserve the BCS field names when the product needs the full catalog. Convert `u64` fields such as `price`, `supply`, and `available` only at the presentation boundary.

## Ownership Lookup

```ts
const { nftV1 } = client.suigar.getConfig().packageIds;
const nftType = client.suigar.bcs.NftV1.typeTag({ package: nftV1 });

const page = await client.core.listOwnedObjects({
	owner,
	type: nftType,
	include: { content: true },
});

const nfts = page.objects.map((object) => client.suigar.bcs.NftV1.parse(object.content));
```

Use the returned objects as the ownership source of truth. Follow `page.cursor` until it is empty when the product needs the full collection. Parse `content` with `NftV1`; do not rely on `objectBcs` for object reads.

## Minting

Build NFT V1 mints with the configured SDK transaction builder. It mints directly to the transaction sender, resolves the selected specification's SUI price from `objectIds.nftV1Factory`, and resolves the NFT package and SweetHouse object from SDK config.

```ts
const tx = client.suigar.tx.nftV1.mint({
	owner,
	specId,
});
```

Optional inputs are `gasBudget` and `useGasCoin`. Derive `specId` from the decoded factory catalog; do not hard-code a package-specific Move target or mint price in app code.

## Boundaries

- `packageIds.nftV1` is the package id used by ownership lookup and the mint builder.
- `objectIds.nftV1Factory` is the catalog object id. Use `client.suigar.bcs.NftV1Factory` to decode its `content`; the SDK does not provide a higher-level catalog client method.
- The SDK exposes NFT V1 minting only through `client.suigar.tx.nftV1.mint`; do not hand-write the Move target or price lookup.
- Keep package ids network-aware by deriving them from the configured client on every environment rather than copying values into application constants.

## Checklist

1. Confirm the client is extended with `suigar()` on the intended supported network.
2. Get `nftV1` from `packageIds` and `nftV1Factory` from `objectIds`.
3. Decode the factory with `NftV1Factory.parse(object.content)`.
4. Query owned objects with `NftV1.typeTag({ package: nftV1 })`, `content: true`, and `NftV1.parse(object.content)`.
5. Preserve pagination for ownership reads.
6. For minting, build `client.suigar.tx.nftV1.mint({ owner, specId })` with a catalog-derived `specId`.
