# NFT V1 Catalog And Ownership Specification

Use this specification for SDK application code that reads the Suigar NFT V1 factory catalog or lists NFT V1 objects owned by an address.

## Catalog Lookup

The catalog object is named `NftV1Factory`. Its resolved object id is `objectIds.nftV1Factory`.

```ts
const { nftV1Factory } = client.suigar.getConfig().objectIds;
const { object } = await client.core.getObject({
	objectId: nftV1Factory,
	include: { content: true },
});

if (object instanceof Error) {
	throw object;
}
if (!object.content) {
	throw new Error('NFT factory did not return content.');
}

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

const nfts = page.objects.map((object) => {
	if (!object.content) {
		throw new Error(`NFT ${object.objectId} did not return content.`);
	}
	return client.suigar.bcs.NftV1.parse(object.content);
});
```

Use the returned objects as the ownership source of truth. Use `page.hasNextPage` to decide whether to request another page and pass `page.cursor` into that request when the product needs the full collection. Do not stop solely because a page contains no matching objects. Parse `content` with `NftV1`; do not rely on `objectBcs` for object reads.

## Boundaries

- Use `client.suigar.getConfig().packageIds.nftV1` to derive the owned NFT type.
- Use `client.suigar.getConfig().objectIds.nftV1Factory` for the catalog object.
- Do not hard-code mainnet or testnet package ids, factory ids, or Move type strings.
