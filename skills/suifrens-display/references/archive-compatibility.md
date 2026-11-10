# Historical archive compatibility

Use this reference only for a consumer pinned to a compiled GitHub release from `Suigar-Gaming/suifrens-display-system`. Read the installed declarations because older archives may predate individual features.

- Keep the exact release asset URL and lockfile integrity. A source checkout tarball is not the compiled release archive.
- In this generation, import the external accessory renderer as `SuiFrenImage` from `/image` and the self-contained renderer as `SuiFrenImage` from `/image-inline`. Do not substitute the migration's `SuiFrenImageInline` name.
- Existing root exports remain available in archives; do not assume that the migration's root-only renderer surface applies.
- Runner helpers such as `buildRunnerAccessories` live in `/accessories`, rather than the migration's `/kits`.
- The historical capy pose uses `capyGesture="thumbsUp"` on `SuiFrenImage` and `gesture="thumbsUp"` on direct `CapyImage`. It is ignored for bullsharks, head portraits and hands occupied by an object. Do not promise migration gestures on an old archive.
- Preserve that archive's animation props, species enums and species-specific expression/skin exports until an explicit migration is in scope.

For an authorized migration, follow the target package's `MIGRATION.md` and declarations. Update imports, species values, shared appearance types, gestures, kit options, animation config and duel step fields together for the features the consumer actually uses. Validate both renderers if both are used. Do not update Suigar's dependency just because the newer source exists.
