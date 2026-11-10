---
name: suifrens-display
description: Integrate @suigar/suifrens-display-system character rendering in React or server-side SVG exports. Use for capy and bullshark attributes, external versus inline SVG accessories, palettes, skins, expressions, static gestures, runner or football kits. Use suifrens-animation for playback and duel scripts; Suigar NFT V1 reads and minting belong to suigar-nft.
license: MIT
---

# Suifrens display

Render the native SVG characters through `@suigar/suifrens-display-system`. Keep their artwork and accessory geometry in the library; do not redraw characters or patch installed output to fix a library issue.

## Rendering workflow

Use the public exports and types of `@suigar/suifrens-display-system`. Read [references/rendering.md](references/rendering.md) for attributes, renderer selection, accessories, kits and gestures.

For motion, playback or battles, use [suifrens-animation](../suifrens-animation/SKILL.md).

## Working boundaries

This package renders character appearance; it does not connect wallets, fetch NFT ownership or mint NFTs. Suigar NFT V1 is a separate product surface covered by [suigar-nft](../suigar-nft/SKILL.md). Do not infer a Suifren's attributes from an unrelated NFT schema.

For a library defect, work in `Suigar-Gaming/ts-sdks`, under `packages/suifrens-display-system`, following its contribution instructions. Do not edit `node_modules`, compiled `dist`, or introduce dependency patches. A consumer integration request does not authorize publishing a library release.

## Verification

Run the consumer's typecheck and build for changed imports and props. Inspect the relevant species at the intended size, including head/full rendering and accessories. For SVG exports, confirm that the output can resolve every referenced image.
