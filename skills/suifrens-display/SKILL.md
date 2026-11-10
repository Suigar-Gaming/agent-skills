---
name: suifrens-display
description: Integrate or migrate @suigar/suifrens-display-system character rendering in React or server-side SVG exports. Use for capy and bullshark attributes, external versus inline SVG accessories, palettes, skins, expressions, static gestures, runner or football kits, and migration from GitHub archives to the ts-sdks package. Use suifrens-animation for playback and duel scripts; Suigar NFT V1 reads and minting belong to suigar-nft.
license: MIT
---

# Suifrens display

Render the native SVG characters through `@suigar/suifrens-display-system`. Keep their artwork and accessory geometry in the library; do not redraw characters or patch installed output to fix a library issue.

## Choose the API generation first

Inspect the consumer's dependency and lockfile, then the matching package exports and declarations. The historical 1.x GitHub archive and the migration in `Suigar-Gaming/ts-sdks` have incompatible APIs despite sharing the package name and currently a source version of `1.2.2`.

At the November 10, 2026 review, the migration is in [ts-sdks PR #189](https://github.com/Suigar-Gaming/ts-sdks/pull/189); the npm package is not yet published. The examples below describe that migration source. Some gestures may still be local changes; verify the selected checkout. Check actual registry availability before suggesting `pnpm add @suigar/suifrens-display-system@beta`. Never present an unpublished beta as installable or silently replace an application's pinned archive.

- For a consumer staying on an archive, read [references/archive-compatibility.md](references/archive-compatibility.md).
- For the migration source or a verified published successor, read [references/rendering.md](references/rendering.md).
- For motion, playback or battles, use [suifrens-animation](../suifrens-animation/SKILL.md) after identifying the generation.

## Working boundaries

This package renders character appearance; it does not connect wallets, fetch NFT ownership or mint NFTs. Suigar NFT V1 is a separate product surface covered by [suigar-nft](../suigar-nft/SKILL.md). Do not infer a Suifren's attributes from an unrelated NFT schema.

For a library defect, locate the owning repository for the selected generation and follow its contribution instructions. The archive source lives in `Suigar-Gaming/suifrens-display-system`; the migration source lives in `ts-sdks/packages/suifrens-display-system`. Do not edit `node_modules`, compiled `dist`, or introduce dependency patches. A consumer integration request does not authorize publishing a library release.

## Verification

Run the consumer's typecheck and build for changed imports and props. Inspect the relevant species at the intended size, including head/full rendering and accessories. For SVG exports, confirm that the output can resolve every referenced image. When integrating an archive in Suigar, use `SUIGAR_DISPLAY_SYSTEM_LOCAL=false` so sibling-source aliases cannot hide a missing export or asset.
