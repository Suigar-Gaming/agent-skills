---
name: suigar-nft-lookup
description: Look up the legacy Suigar NFT catalog or NFTs owned by a Sui address with @suigar/sdk. Use when reading and decoding `LegacyNftFactory`, listing or decoding an owner's `LegacyNft` objects, deriving the network-specific `::nft::Nft` type from resolved config, avoiding hard-coded NFT package or factory ids, or explaining the boundary between SDK-supported catalog and ownership reads and unsupported NFT mint flows.
license: MIT
metadata:
  author: suigar
  version: "1.0.0"
  short-description: Look up legacy Suigar NFTs
  tags:
    - suigar
    - sui
    - sdk
    - nft
---

# Look Up Legacy Suigar NFTs

Use this skill for application code that imports `@suigar/sdk` and reads the legacy NFT catalog or NFTs directly owned by an address. If the app has not configured the SDK client yet, use `installation` first.

> Source constraint: Use the active client's resolved `packageIds.legacyNft` and `packageIds.legacyNftFactory`; do not hard-code a mainnet or testnet package or factory id.

## Default Workflow

1. Extend the Sui client with `suigar()` for the intended network.
2. Read `legacyNft` and `legacyNftFactory` from `client.suigar.getConfig().packageIds`.
3. Fetch the factory with `content: true` and decode it using `client.suigar.bcs.LegacyNftFactory`.
4. Derive the owned NFT type as `${legacyNft}::nft::Nft`.
5. Call `client.core.listOwnedObjects()` with `type`, `content: true`, and pagination.
6. Decode each owned object with `client.suigar.bcs.LegacyNft`.

## Catalog Lookup

The catalog object is named `LegacyNftFactory`. Its resolved object id is `packageIds.legacyNftFactory`.

```ts
const { legacyNftFactory } = client.suigar.getConfig().packageIds;
const { object } = await client.core.getObject({
	objectId: legacyNftFactory,
	include: { content: true },
});

if (object instanceof Error) throw object;
if (!object.content) throw new Error('NFT factory did not return content.');

const factory = client.suigar.bcs.LegacyNftFactory.parse(object.content);
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
const { legacyNft } = client.suigar.getConfig().packageIds;
const nftType = `${legacyNft}::nft::Nft`;

const page = await client.core.listOwnedObjects({
	owner,
	type: nftType,
	include: { content: true },
});

const nfts = page.objects.map((object) =>
	client.suigar.bcs.LegacyNft.parse(object.content),
);
```

Use the returned objects as the ownership source of truth. Follow `page.cursor` until it is empty when the product needs the full collection. Parse `content` with `LegacyNft`; do not rely on `objectBcs` for object reads.

## Boundaries

- `packageIds.legacyNft` is a package id for ownership lookup, not a dedicated SDK NFT client method.
- `packageIds.legacyNftFactory` is the catalog object id. Use `client.suigar.bcs.LegacyNftFactory` to decode its `content`; the SDK does not provide a higher-level catalog client method.
- Legacy NFT mint transactions are outside the SDK. Do not invent a mint builder, transaction target, or MCP tool.
- Keep package ids network-aware by deriving them from the configured client on every environment rather than copying values into application constants.

## Checklist

1. Confirm the client is extended with `suigar()` on the intended supported network.
2. Get `legacyNft` and `legacyNftFactory` from `client.suigar.getConfig().packageIds`.
3. Decode the factory with `LegacyNftFactory.parse(object.content)`.
4. Query owned objects by `${legacyNft}::nft::Nft` with `content: true` and decode them with `LegacyNft.parse(object.content)`.
5. Preserve pagination and leave minting outside the SDK.
