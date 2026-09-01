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

## Local Session Wallet

Use these tools for persistent local session wallets:

- `setup_session_wallet`
- `get_session_wallet`
- `fund_session_wallet`

`setup_session_wallet` opens a local, user-only setup page to create or recover a persistent session wallet. Recovery phrases and imported `suiprivkey...` values stay on the localhost setup page and never pass through MCP.

`get_session_wallet` returns the local session wallet public address, balances, and funding links without exposing the private key.

`fund_session_wallet` returns a paired-wallet funding URL for the local session wallet address.

In `mode: "execute"` with `executionWallet: "session"`, MCP signs and submits directly with the local session wallet key stored in the OS keychain. Use this only for a dedicated low-funded wallet the user intentionally set up.

When `executionWallet` is `"session"`, `owner` is optional and must match the selected session wallet if provided.

## Wallet Reads

Use these read tools for balances and coin objects:

- `get_wallet_balances`: aggregate balances for the connected wallet, a local session wallet, or an explicit owner
- `list_wallet_coins`: paginated individual coin objects for the connected wallet, a local session wallet, or an explicit owner

`owner` accepts a Sui address, SuiNS name, or SuiNS subname. Surface tool errors with the missing owner, network, or coin detail needed for retry.
