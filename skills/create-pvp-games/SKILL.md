---
name: create-pvp-games
description: Build, scaffold, review, or fix PvP Suigar game flows using @suigar/sdk. Use when creating, joining, canceling, listing, or parsing PvP coinflip matches; reading live PvP stake limits or settings; implementing lobby cards; preserving creator side and privacy flags; fetching PvP game objects; decoding PvP coinflip events; or correcting code that incorrectly uses standard createBetTransaction for PvP actions.
license: MIT
metadata:
  author: suigar
  version: "1.2.0"
  short-description: Build PvP Suigar game flows
  tags:
    - suigar
    - sui
    - sdk
    - pvp-games
---

# Create PvP Suigar Games

Use this skill for application code that imports `@suigar/sdk` and builds PvP flows. Today the concrete PvP runtime surface is PvP coinflip. If the user is using MCP tools instead of SDK code, use `suigar-mcp`; the MCP create input is `creatorSide`, which maps to SDK `side`.

> Source constraint: Treat the SDK PvP coinflip builders, BCS helpers, and registry lookup behavior as authoritative. Do not adapt standard bet builders for PvP.

## Default Workflow

1. Identify the PvP action: `create`, `join`, or `cancel`.
2. Use `client.suigar.tx.createPvPCoinflipTransaction(action, options)`.
3. Pass `gameId` for join and cancel flows.
4. Use `client.suigar.getPvPCoinflipGames(options?)` for unresolved lobby state.
5. Use `client.suigar.bcs.PvPCoinflipGame.get({ client, objectId })` when one live pending game object is needed.
6. Decode PvP events with generated BCS helpers.
7. Decode any accompanying standard `BetResultEvent.game_details` with `parseGameEvent` and `parseGameDetails`.

## Live Parameters

Read `client.suigar.getGameParameters('pvp-coinflip', { coinType })` before presenting or validating current PvP stake limits or game settings. Results are cached for 30 minutes by default; use `ignoreCache: true` when the lobby requires a fresh on-chain read.

## Public Surface

```ts
client.suigar.getPvPCoinflipGames(options?);
client.suigar.tx.createPvPCoinflipTransaction(action, options);
client.suigar.bcs.PvPCoinflipGame;
```

Use `PvPCoinflipAction` and `PvPGame` from `@suigar/sdk/games` when app code needs typed action or game values.

## Actions

### Create

Use `create` when the first player opens a PvP coinflip match.

Required: `owner`, `coinType`, `stake`, `side`.

Optional: `isPrivate`, `metadata`, `gasBudget`, `useGasCoin`.

```ts
const tx = client.suigar.tx.createPvPCoinflipTransaction('create', {
	owner,
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	side: 'tails',
	isPrivate: true,
});
```

Preserve the creator-selected side and privacy flag exactly.

### Join

Use `join` when a second player accepts an unresolved match.

Required: `owner`, `coinType`, `gameId`.

Optional: `metadata`, `gasBudget`, `useGasCoin`.

```ts
const tx = client.suigar.tx.createPvPCoinflipTransaction('join', {
	owner,
	coinType: '0x2::sui::SUI',
	gameId: '0xGAME',
});
```

Join derives the stake from `gameId` and uses the configured price info object id for `coinType`. Do not pass stake, side, or custom coin callbacks for join.

### Cancel

Use `cancel` when the creator cancels an unresolved match.

Required: `owner`, `coinType`, `gameId`.

Optional: `metadata`, `gasBudget`, `useGasCoin`.

```ts
const tx = client.suigar.tx.createPvPCoinflipTransaction('cancel', {
	owner,
	coinType: '0x2::sui::SUI',
	gameId: '0xGAME',
});
```

Keep cancellation tied to the on-chain `gameId`; do not reuse create or join payload shapes.

## Lobby and Object Reads

`getPvPCoinflipGames()` lists unresolved matches by reading the PvP registry for the active network and loading referenced game objects with `client.core.getObjects()`.

- Registry membership is the live pending-state signal.
- Joined and resolved games are removed from the registry and their live `Game` objects are deleted.
- Per-object fetch or parse failures are skipped by default so a stale registry entry does not reject the whole lookup.
- Pass `throwOnError: true` when the caller wants strict rejection.
- Forward supported dynamic-field options such as `limit`, `cursor`, or `signal`.

```ts
const games = await client.suigar.getPvPCoinflipGames({ limit: 20 });
```

```ts
const game = await client.suigar.bcs.PvPCoinflipGame.get({
	client,
	objectId: '0xGAME',
});
```

## Event Decoding

Use:

- `client.suigar.bcs.PvPCoinflipGameCreatedEvent`
- `client.suigar.bcs.PvPCoinflipGameResolvedEvent`
- `client.suigar.bcs.PvPCoinflipGameCancelledEvent`
- `parseGameEvent(event)` from `@suigar/sdk/utils`

When a flow also decodes `BetResultEvent`, use `parseGameEvent(event)` to retrieve `gameId`, then `parseGameDetails(gameId, decoded.game_details)` so PvP result details are interpreted correctly.

## Gotchas

- Do not model PvP coinflip with `createBetTransaction`.
- Do not pass explicit coin object ids; let the SDK build the coin input from balance.
- Do not set `metadata.partner` or `metadata.referrer`; configure `suigar({ partner: '<wallet-address>' })`.
- Treat `partner` as a wallet address, not a slug, label, or display string.
- Treat lobby ids, game ids, and privacy flags as explicit product state.
- After join and resolution, inspect emitted events instead of expecting the `Game` object to remain on-chain.
- Use `client.suigar.getConfig().coins` when the UI needs supported coin metadata.
- Use the root-exported `SuigarCoin` type when app code needs typed supported coin keys.

## Implementation Checklist

1. Confirm whether the feature is create, join, or cancel.
2. Wire the flow to `createPvPCoinflipTransaction`.
3. For join or cancel, pass `gameId` and `coinType`.
4. Read unresolved lobby state with `client.suigar.getPvPCoinflipGames()`.
5. Fetch a specific live match with `client.suigar.bcs.PvPCoinflipGame.get({ client, objectId: gameId })` when needed.
6. Parse emitted PvP events with generated BCS helpers.
7. Parse `BetResultEvent.game_details` with `parseGameDetails` when displaying bet result details.
