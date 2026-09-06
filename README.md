# Cookie Kitchen

Read-only utility **cApp** on **Cookie Chain** (SVM). A baker’s bench for the community cluster: live chain pulse, COOK fee recipes, wallet connect on a custom Cookie RPC, and address peeks.

This is not Solana mainnet. Every chain call uses `https://rpc.cookiescan.io`.

Superteam Earn listing: [Create an App on Cookie Chain](https://earn.superteam.fun/listing/create-an-app-on-cookie-chain-app/)

## Why

Cookie Chain is an independent SVM network. Solana tooling works if you point it at the Cookie RPC, but the validator set, native asset (`COOK`), and genesis hash are not Solana’s. Cookie Kitchen makes that difference obvious: slot, health, fees, and balances are read live from Cookie RPC, with genesis shown next to Solana mainnet-beta’s well-known genesis so judges can see they are not the same chain.

No token launch, no LP, no pools, no wash trading.

## Features

1. **Chain pulse** — slot, block height, `getHealth`, RPC latency (timed `getSlot`), rough TPS from `getRecentPerformanceSamples` when the RPC returns samples.
2. **Fee kitchen** — estimate COOK cost for N signatures. Default **0.000005 COOK/sig** (5,000 lamports), labeled from cookiescan.io Base Fee and cookiechain.wtf Avg Fee/TX, then corroborated with live `getFeeForMessage`.
3. **Wallet** — Solana wallet adapter (`Nightly`, `Phantom`, `Solflare`) on the **custom Cookie cluster** RPC. Shows pubkey + native COOK balance.
4. **Address peek** — paste a pubkey → COOK balance + last 5 signatures (`getSignaturesForAddress`).
5. **Official links only** — cookiechain.wtf, docs.cookiechain.wtf, cookiescan.io, bridge.cookiescan.io.

## Cluster / RPC

| Item | Value | Source |
| --- | --- | --- |
| Cluster | Cookie Chain mainnet (custom SVM cluster) | [docs.cookiechain.wtf](https://docs.cookiechain.wtf) — independent SVM, not Solana |
| HTTP RPC | `https://rpc.cookiescan.io` | [Getting Started](https://docs.cookiechain.wtf/getting-started) |
| WebSocket | `https://wss.cookiescan.io` | [Wallets](https://docs.cookiechain.wtf/wallets) |
| Native asset | COOK (9 decimals, SVM lamports) | Docs + explorer |
| Genesis hash | `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2` | **RPC-derived** via `getGenesisHash`. docs.cookiechain.wtf does not currently publish a genesis hash (checked 2026-09-06). |
| Solana mainnet genesis (contrast only) | `5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d` | Well-known Solana constant; this app does not query Solana RPC |

Wallet note from Cookie docs: Nightly is recommended. Phantom/Solflare work if you add a custom SVM network with the Cookie RPC. Cookie Kitchen always fetches COOK from the Cookie endpoint even if the wallet UI is still sitting on Solana.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Requires Node 20+.

## Docs for judges / Earn

- [VERIFICATION.md](./VERIFICATION.md) — click path and proof this is Cookie RPC, not Solana mainnet
- [SUBMISSION.md](./SUBMISSION.md) — paste fields for Superteam Earn
- [LIVE_URL.md](./LIVE_URL.md) — live URL (PENDING until HTTPS deploy)

## Hard bans

This cApp does **not** launch tokens, create liquidity pools, or trade. Footer may mention TenK public receives on Solana / Base; those are not Cookie Chain addresses and are not used in-app.
