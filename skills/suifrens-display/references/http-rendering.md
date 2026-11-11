# Fastify SVG and PNG rendering

The [Fastify example in ts-sdks](https://github.com/Suigar-Gaming/ts-sdks/tree/main/packages/suifrens-display-system/examples/fastify) serves static Suifren and accessory images. HTTP consumers don't need to install the TypeScript SDK or submit transactions.

## Start the example

From the ts-sdks repository root, use its Node.js and pnpm versions:

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --filter @suigar/suifrens-fastify dev --network testnet
```

The server listens on port 3000. Reuse a running instance if it already has the required configuration. Only `mainnet` and `testnet` are supported; omitting `--network` selects mainnet. Watch restarts preserve the network choice. No wallet, private key, database or `.env` is needed. Suifren reads require access to the public Sui fullnode over gRPC.

## Routes and identifiers

| Route                          | Response                                        |
| ------------------------------ | ----------------------------------------------- |
| `GET /`                        | Health check: `{"ok":true}`                     |
| `GET /suifrens/:suifrenId/svg` | Capy or Bullshark SVG with equipped accessories |
| `GET /suifrens/:suifrenId/png` | The same character as PNG                       |
| `GET /accessories/:name/svg`   | Catalogue accessory on an incognito character   |
| `GET /accessories/:name/png`   | The same accessory preview as PNG               |

Use the individual NFT's full object ID from the selected network for `:suifrenId`. A wallet address, package ID or collection type cannot replace it. If the user provides only a collection URL, find a verified individual object ID rather than reusing the package address. For `:name`, use the case-sensitive catalogue name and URL-encode spaces and special characters.

## Query parameters

| Parameter | Formats     | Default | Accepted values                                              |
| --------- | ----------- | ------- | ------------------------------------------------------------ |
| `width`   | PNG         | 1024 px | Integer from 1 to 4096; height follows the SVG's proportions |
| `logo`    | SVG and PNG | omitted | `sui` or `suigar`; omit for no logo                          |
| `shadow`  | SVG and PNG | `true`  | `true` or `false` to show or hide the shadow                 |

Defaults apply to both accessories and Suifrens. PNG backgrounds are transparent. SVG responses use `image/svg+xml`; PNG responses use `image/png`.

```text
http://localhost:3000/accessories/soccer%20team%20shirt/png?width=512&shadow=false
http://localhost:3000/suifrens/OBJECT_ID/svg?logo=suigar&shadow=false
```

Replace `OBJECT_ID` with a verified NFT object ID. Invalid query values return `400`, missing or deleted objects and unknown accessory names return `404`, and read or rendering failures return `500`.

The example has no game or transaction endpoints. Static image responses do not play browser animation timelines. Read the example's README and current source before changing its server behavior; it is a repository example, not a hosted API or a package export.
