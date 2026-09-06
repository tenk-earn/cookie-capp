/**
 * Cookie Chain cluster — custom SVM, not Solana mainnet-beta.
 *
 * RPC / WS come from docs.cookiechain.wtf (Getting Started + Wallets).
 * Genesis hash is not published on that docs site (checked 2026-09-06);
 * the value below is the live `getGenesisHash` result from the Cookie RPC
 * and is labeled as RPC-derived in the UI.
 */

export const COOKIE_RPC = "https://rpc.cookiescan.io";
export const COOKIE_WS = "https://wss.cookiescan.io";

export const COOKIE_CLUSTER_NAME = "Cookie Chain";
export const COOKIE_CLUSTER_LABEL = "Cookie Chain mainnet (custom SVM cluster)";

/** Live `getGenesisHash` from https://rpc.cookiescan.io */
export const COOKIE_GENESIS_HASH =
  "9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2";

/** Well-known Solana mainnet-beta genesis — contrast only, never queried. */
export const SOLANA_MAINNET_GENESIS =
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d";

export const LAMPORTS_PER_COOK = 1_000_000_000;

/**
 * Default base fee: 0.000005 COOK per signature (5,000 lamports).
 *
 * Sources:
 * - cookiescan.io header "Base Fee: 0.00000500"
 * - cookiechain.wtf "Avg Fee / TX 0.000005 COOK per signature"
 * - live Cookie tx `meta.fee` = 5000 lamports
 *
 * The fee kitchen corroborates at runtime with `getFeeForMessage`.
 */
export const DEFAULT_FEE_PER_SIG_LAMPORTS = 5_000;

export const DEFAULT_FEE_SOURCE =
  "Default 0.000005 COOK/sig from cookiescan.io Base Fee and cookiechain.wtf Avg Fee/TX (5,000 lamports).";

export const SAMPLE_PEEK_ADDRESS =
  "9MC7fLJmLVfLMAsACJ2g2nAbkzPggQGHvAq4Rr5LNBVi";

export const SAMPLE_PEEK_NOTE =
  "Public Cookie validator identity from getClusterNodes on rpc.cookiescan.io.";

export const OFFICIAL_LINKS = [
  {
    href: "https://cookiechain.wtf",
    label: "cookiechain.wtf",
    blurb: "Homepage",
  },
  {
    href: "https://docs.cookiechain.wtf",
    label: "docs.cookiechain.wtf",
    blurb: "Docs · RPC, wallets, getting started",
  },
  {
    href: "https://cookiescan.io",
    label: "cookiescan.io",
    blurb: "Explorer",
  },
  {
    href: "https://bridge.cookiescan.io",
    label: "bridge.cookiescan.io",
    blurb: "Official bridge entry (redirects to Hyperlane warp route)",
  },
] as const;

export const TENK_SOLANA_RECEIVE =
  "3mTGB63ShBJGrjbvGDvNiA5JM3hAFnvnKpMN6cabf9RF";
export const TENK_BASE_RECEIVE = "0x75Cdae07B4F2BddC09Fe2368f0a8ce34e10AE072";

export const EARN_LISTING =
  "https://earn.superteam.fun/listing/create-an-app-on-cookie-chain-app/";

export const EXPLORER_ACCOUNT = (address: string) =>
  `https://cookiescan.io/account/${address}`;
export const EXPLORER_TX = (signature: string) =>
  `https://cookiescan.io/tx/${signature}`;
