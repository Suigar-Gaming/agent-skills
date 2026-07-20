---
name: suigar-nft-lookup
description: Look up legacy Suigar NFTs owned by a Sui address with @suigar/sdk. Use when listing or filtering an owner's legacy NFT objects, deriving the network-specific `::nft::Nft` struct type from `client.suigar.getConfig().packageIds.legacyNft`, avoiding hard-coded NFT package ids, or explaining the boundary between SDK-supported ownership reads and unsupported legacy NFT catalog or mint flows.
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

Use this skill for application code that imports `@suigar/sdk` and reads legacy NFTs directly owned by an address. If the app has not configured the SDK client yet, use `installation` first.

> Source constraint: Use the active client's resolved `packageIds.legacyNft`; do not hard-code a mainnet or testnet package id.

## Default Workflow

1. Extend the Sui client with `suigar()` for the intended network.
2. Read `legacyNft` from `client.suigar.getConfig().packageIds`.
3. Derive the NFT struct type as `${legacyNft}::nft::Nft`.
4. Call `client.core.listOwnedObjects()` with that `StructType` filter.
5. Handle pagination or a caller-supplied request signal according to the surrounding application's Sui client conventions.

## Ownership Lookup

```ts
const { legacyNft } = client.suigar.getConfig().packageIds;
const nftType = `${legacyNft}::nft::Nft`;

const page = await client.core.listOwnedObjects({
	owner,
	filter: { StructType: nftType },
});
```

Use the returned objects as the ownership source of truth. Parse their `content` when the application needs NFT fields; do not rely on `objectBcs` for object reads.

## Boundaries

- `packageIds.legacyNft` is a package id for ownership lookup, not a dedicated SDK NFT API.
- `packageIds.legacyNftFactory` is an object id for applications that independently read the legacy NFT catalog. The SDK provides no catalog lookup helper or catalog schema.
- Legacy NFT mint transactions are outside the SDK. Do not invent a mint builder, transaction target, or MCP tool.
- Keep package ids network-aware by deriving them from the configured client on every environment rather than copying values into application constants.

## Checklist

1. Confirm the client is extended with `suigar()` on the intended supported network.
2. Get `legacyNft` from `client.suigar.getConfig().packageIds`.
3. Filter `listOwnedObjects` by `${legacyNft}::nft::Nft`.
4. Preserve pagination and parse `content` only when fields are needed.
