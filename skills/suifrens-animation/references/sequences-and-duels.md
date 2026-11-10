# Custom sequences and scripted duels

## Custom part animation

```ts
import type { AnimationSequence } from '@suigar/suifrens-display-system/types';

const nod = {
	name: 'nod',
	duration: 600,
	tracks: [
		{
			part: 'head',
			keyframes: [
				{ at: 0, pose: { rotate: 0 } },
				{ at: 300, pose: { rotate: 8 }, ease: 'easeInOut' },
				{ at: 600, pose: { rotate: 0 } },
			],
		},
	],
} satisfies AnimationSequence;
// Use animation={{ sequence: nod, playback: { iterations: 1 } }}.
```

Sequence duration and keyframe `at` values use milliseconds. Parts are `body`, `head`, `leftArm`, `rightArm`, `leftLeg`, `rightLeg`, `tail`, and `fin`. Check the species' registered parts before relying on a tail or fin. Pose values support rotation, translation and scale. Keep animation in the library's part system so attached accessories follow the appropriate body parts.

## Duels

Import `useDuelScript`, `SuiFrenBattleSprite`, and `MinecraftHealthBar` from `/battle`. Import `DuelScript`, `DuelAttackStep`, and component/hook types from `/types`.

```ts
import type { DuelScript } from '@suigar/suifrens-display-system/types';

const script = {
	name: 'Demo duel',
	steps: [
		{
			type: 'attack',
			label: 'Left punches',
			attacker: { side: 'left', preset: 'punch', expression: 'angry' },
			target: { damage: 2, preset: 'hit', delayMs: 140 },
			afterMs: 140,
		},
		{ type: 'victory', label: 'Left wins', side: 'left', iterations: 3 },
	],
} satisfies DuelScript;
```

The attack target is always the opposite fighter. Do not supply an explicit target side. Attacker options belong in `attacker`; impact options belong in `target`. Victory uses `iterations` (default five).

Call `useDuelScript({ script, baseExpression: { left: 'happy', right: 'happy' }, ...options })` in a React component. It returns `{ state, restart, stop, reset }`. Stabilize scripts and option objects when appropriate so a render does not unintentionally restart an effect.

Use `state.left` and `state.right` as the source of each fighter's health, maximum health, expression and animation. Pass those to the battle sprite with the matching attributes. Keep a single health state rather than independently decrementing the health bar. The hook models a presentation script; it does not determine on-chain game outcomes. If a real result drives the scene, derive the script from that verified result.

`SuiFrenBattleSprite` owns its inline renderer, facing transform and health bar. Its API does not automatically accept every `SuiFrenImage` prop. Check its declared props before adding accessories or gestures to a battle sprite. Use `hitFlashTrigger` for repeated hit flashes without remounting the animated fighter.
