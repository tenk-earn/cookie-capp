# Verification — Cookie Kitchen is on Cookie Chain

Repo: https://github.com/tenk-earn/cookie-capp

Live URL: see [LIVE_URL.md](./LIVE_URL.md) (PENDING until Grok Build HTTPS deploy). Until then, `npm run build && npm run preview`.

## Judge click path

1. Open the app. The header pill should read **Cookie Chain mainnet (custom SVM cluster)**.
2. **Chain pulse** (top card)
   - Slot and block height should be in the ~20–30 million range (Cookie), not Solana mainnet’s ~300M+ slots.
   - Health should be `ok` when `https://rpc.cookiescan.io` is up.
   - RPC latency is milliseconds for a timed `getSlot`.
   - Rough TPS comes from `getRecentPerformanceSamples` (labeled n/a if the RPC omits samples).
3. Open DevTools → **Network**. Filter `cookiescan` or `rpc`. JSON-RPC POSTs must go to `https://rpc.cookiescan.io`. There must be **no** calls to `api.mainnet-beta.solana.com`, `api.devnet.solana.com`, or Helius/Triton Solana endpoints.
4. **Proof strip** under the pulse: Cookie genesis vs Solana mainnet genesis. They must differ.
5. **Fee kitchen** — change signature count (presets 1/2/4/8/16). Total COOK should scale as `N × rate`. Source line should prefer live `getFeeForMessage`; otherwise the labeled 0.000005 COOK/sig default.
6. **Wallet** — connect Phantom, Solflare, or Nightly. Pubkey + COOK balance are read from Cookie RPC (`getBalance`). Cookie docs recommend Nightly for this cluster.
7. **Address peek** — click **Sample validator** or paste `9MC7fLJmLVfLMAsACJ2g2nAbkzPggQGHvAq4Rr5LNBVi` (public identity from Cookie `getClusterNodes`). Confirm COOK balance and up to 5 signatures. Explorer links open `cookiescan.io`, not Solscan.
8. **Official links** — only cookiechain.wtf, docs.cookiechain.wtf, cookiescan.io, bridge.cookiescan.io.

## Prove Cookie RPC, not Solana mainnet

Run this yourself:

```bash
curl -sS -X POST https://rpc.cookiescan.io \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getGenesisHash","params":[]}'
```

Expected Cookie genesis:

```text
9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2
```

Solana mainnet-beta genesis (do **not** expect this from Cookie RPC):

```text
5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d
```

Other Cookie RPC facts captured while building this cApp (values move):

| Call | Cookie RPC (example) |
| --- | --- |
| `getHealth` | `ok` |
| `getVersion` | Agave `solana-core` 4.1.2 |
| `getSlot` / `getBlockHeight` | ~23.5M / ~23.1M |
| Live tx `meta.fee` | `5000` lamports = 0.000005 COOK |

Solana mainnet slot is an order of magnitude higher; a genesis mismatch is the hard proof.

## Addresses used in-app

| Address | Role |
| --- | --- |
| `9MC7fLJmLVfLMAsACJ2g2nAbkzPggQGHvAq4Rr5LNBVi` | Sample peek — Cookie validator identity from `getClusterNodes` |
| *(none)* | No program deploy, no token mint, no pool, no Kenneth wallets |

TenK public receives in the footer are **not** Cookie Chain accounts and are **not** in-app destinations:

- Solana: `3mTGB63ShBJGrjbvGDvNiA5JM3hAFnvnKpMN6cabf9RF`
- Base: `0x75Cdae07B4F2BddC09Fe2368f0a8ce34e10AE072`

## Cluster documentation vs assumption

From [docs.cookiechain.wtf/getting-started](https://docs.cookiechain.wtf/getting-started) and [docs.cookiechain.wtf/wallets](https://docs.cookiechain.wtf/wallets):

- Point tooling at `https://rpc.cookiescan.io`
- WebSocket `https://wss.cookiescan.io`
- Independent SVM network; native asset COOK
- Nightly wallet recommended

**Not found on docs.cookiechain.wtf:** a published genesis hash or a Solana-style cluster name (`mainnet-beta`). Those are labeled in the UI as **RPC-derived** (`getGenesisHash`) and **Cookie Chain mainnet (custom SVM cluster)** respectively — not as undocumented guesses presented as docs.

`https://bridge.cookiescan.io` is the official bridge entry used in the links card; it currently redirects to the Hyperlane warp route.
