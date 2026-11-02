# MCP Wallets Specification

Use this specification for `@suigar/mcp` wallet reads, paired browser-wallet approval, and local session-wallet behavior.

## Paired Browser Wallet

Use these tools for browser-mediated wallet pairing:

- `suigar_login`
- `suigar_logout`
- `get_connection_status`
- `get_execution_status`

`suigar_login` opens a secure browser wallet pairing flow. `suigar_logout` forgets the paired wallet for the selected network. `get_connection_status` reads connection state without exposing secrets. `get_execution_status` checks browser approval status for an execute-mode transaction request.

In `mode: "execute"` with `executionWallet: "connected"`, MCP opens browser approval. The transaction is not signed by the MCP server itself.

Wallet pairing inputs include optional `webUrl`, `timeoutMs`, `maxBodyBytes`, `open`, and `noOpen`; `open` and `noOpen` are mutually exclusive.

Wallet bridges and session setup require 32-byte hexadecimal state tokens and compare the decoded bytes using timing-safe equality. For invalid pairing, approval, logout, or setup state errors, restart the corresponding flow and use its newly generated URL with its state token intact.

## Local Session Wallet

Use these tools for persistent local session wallets:

- `setup_session_wallet`
- `get_session_wallet`
- `fund_session_wallet`

`setup_session_wallet` opens a local, user-only setup page to create or recover a persistent session wallet. Recovery phrases and imported `suiprivkey...` values stay on the localhost setup page and never pass through MCP.

Session wallets are named and persistent across restarts and shared between networks. Use the returned wallet's UUID as `sessionWalletId` on supported wallet reads and game/SweetHouse tools to select it; omitting the ID selects the first saved wallet. Do not infer that the most recently created wallet becomes the default.

`get_session_wallet` returns the local session wallet public address, balances, funding QR code, and funding links without exposing the private key. It can show a setup link when no wallet exists.

`fund_session_wallet` requires a paired browser wallet and opens a prefilled funding form for the selected session wallet. The user chooses the coin and amount and signs the transfer in the browser.

In `mode: "execute"` with `executionWallet: "session"`, MCP signs and submits directly with the local session wallet key stored in the OS keychain. Use this only for a dedicated low-funded wallet the user intentionally set up.

On game and SweetHouse tools, when `executionWallet` is `"session"`, `owner` is optional and must match the selected session wallet if provided. NFT mint and referral claims do not accept session execution inputs; use browser approval for those flows.

For game tools, session execution accepts a custom `providerUrl` and top-level `partner`, but rejects any `config` override. Omit `config` to use the trusted SDK defaults. Before signing, the server requires exactly one `MoveCall` targeting the selected game's package and module; other transaction commands such as coin splitting may still be present. If verification fails, surface the error rather than changing the transaction to bypass the check.

Wallet validation uses `TypeError` for malformed recovery phrases and `RangeError` for unsupported private-key schemes or oversized bridge requests. Local setup pages display the error message. Expiration, missing wallet state, and unavailable keychain storage remain operational errors.

## Wallet Reads

Use these read tools for balances and coin objects:

- `get_wallet_balances`: aggregate balances for the connected wallet, a local session wallet, or an explicit owner
- `list_wallet_coins`: paginated individual coin objects for the connected wallet, a local session wallet, or an explicit owner

`owner` accepts a Sui address, SuiNS name, or SuiNS subname. Surface tool errors with the missing owner, network, or coin detail needed for retry.
