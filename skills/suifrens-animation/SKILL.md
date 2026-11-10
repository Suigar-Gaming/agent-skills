---
name: suifrens-animation
description: Add or migrate Suifrens animation playback, custom part sequences, battle sprites, health bars, and scripted duels using @suigar/suifrens-display-system. Use for animation configuration, iterations, play state, triggers, timing helpers, or useDuelScript attack and victory steps. Static portraits, accessories and gestures belong to suifrens-display.
license: MIT
---

# Suifrens animation and duels

First use [suifrens-display](../suifrens-display/SKILL.md) to identify the dependency generation and publication status. The API here describes the `ts-sdks` migration source; do not apply it to an archive consumer without an authorized migration.

## Image playback

Both `SuiFrenImage` and `SuiFrenImageInline` accept a single `animation` object. Select exactly one source: `preset` or a custom `sequence`. Omit `animation` or pass `null` for a static image.

```tsx
<SuiFrenImage
	attributes={attributes}
	animation={{
		preset: 'walk',
		playback: { iterations: 'infinite', speed: 1 },
	}}
/>
```

- Use `playState: 'idle'` to avoid starting, `'running'` to play, `'paused'` to pause, or `'stopped'` to stop. Omitted play state starts by default.
- `playback.iterations` counts directional passes; it defaults to one and accepts `'infinite'`. `alternate: true` reverses every other pass. Keep `speed` in `playback`.
- Changing `trigger` restarts the timeline. Use it to replay repeated actions rather than remounting the whole character.
- Keep `direction`, `startAt`, `holdOnComplete`, and `transitionMs` inside `animation` when used.
- Remove former top-level animation options and replace `autoPlay` / `playback.loop` with play state / iterations during migration.

Import `AnimationConfig`, `AnimationSequence`, `PlaybackOptions` and other public types from `/types`. Import `AnimationProvider`, hooks, `getPresetSequence`, `getPresetDurationMs`, and `normalizePlayback` from `/animation`. The image components already provide their animation context when `animation` is set; do not wrap them in another provider without a specific low-level need.

For timing, use `getPresetDurationMs(preset, playback)` rather than copying preset durations. Validate unknown presets: `getPresetSequence` can return `undefined` and the duration helper can return `null`. Do not promise a preset based only on a natural-language action name.

For custom sequences or duels, read [references/sequences-and-duels.md](references/sequences-and-duels.md).

## Verification

Run the consumer's typecheck and build. In the browser, check both species when relevant, pause/resume, trigger replay, finite completion and mirrored limbs at turn endpoints. Check visibility changes and unmount cleanup when modifying playback integration. For duels, verify impact timing, damage, restart/reset, and victory iterations. Avoid starting duplicate Storybook/dev servers and clean up servers started for the check.
