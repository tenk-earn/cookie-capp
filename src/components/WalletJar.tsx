import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  COOKIE_CLUSTER_LABEL,
  COOKIE_GENESIS_HASH,
  COOKIE_RPC,
  COOKIE_WS,
  EXPLORER_ACCOUNT,
} from "../cluster";
import { formatCook, shortKey } from "../lib/format";
import { CopyButton } from "./CopyButton";

export function WalletJar() {
  const { connection } = useConnection();
  const { publicKey, connected, wallet, connecting } = useWallet();
  const [lamports, setLamports] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setLamports(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const value = await connection.getBalance(publicKey, "confirmed");
        if (!cancelled) {
          setLamports(value);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Balance fetch failed");
        }
      }
    };
    void load();
    const id = window.setInterval(() => void load(), 12_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [connection, publicKey]);

  return (
    <section className="card" id="wallet">
      <div className="card-head">
        <div>
          <p className="eyebrow">Cookie jar</p>
          <h2>Wallet</h2>
        </div>
        <WalletMultiButton />
      </div>
      <p className="lede">
        Wallet adapter is pointed at the custom Cookie cluster RPC{" "}
        <code>{COOKIE_RPC}</code> — not Solana mainnet. Native balance below is
        COOK from that RPC.
      </p>

      {connected && publicKey ? (
        <div className="wallet-body">
          <div className="wallet-row">
            <span>Wallet</span>
            <strong>{wallet?.adapter.name ?? "Connected"}</strong>
          </div>
          <div className="wallet-row">
            <span>Pubkey</span>
            <code title={publicKey.toBase58()}>
              {shortKey(publicKey.toBase58(), 6, 6)}
            </code>
            <CopyButton value={publicKey.toBase58()} />
          </div>
          <div className="wallet-row">
            <span>COOK balance</span>
            <strong className="cook-amt">
              {lamports == null ? "…" : `${formatCook(lamports)} COOK`}
            </strong>
          </div>
          <a
            className="text-link"
            href={EXPLORER_ACCOUNT(publicKey.toBase58())}
            target="_blank"
            rel="noreferrer"
          >
            Open on cookiescan.io
          </a>
        </div>
      ) : (
        <p className="empty">
          {connecting
            ? "Connecting…"
            : "Connect Phantom, Solflare, or Nightly. Nightly is the wallet Cookie docs recommend for this cluster."}
        </p>
      )}

      {error ? <p className="banner bad">{error}</p> : null}

      <dl className="cluster-facts">
        <div>
          <dt>Cluster</dt>
          <dd>{COOKIE_CLUSTER_LABEL}</dd>
        </div>
        <div>
          <dt>RPC</dt>
          <dd>
            <code>{COOKIE_RPC}</code>
          </dd>
        </div>
        <div>
          <dt>WebSocket</dt>
          <dd>
            <code>{COOKIE_WS}</code>
            <span className="hint"> from docs.cookiechain.wtf/wallets</span>
          </dd>
        </div>
        <div>
          <dt>Genesis</dt>
          <dd>
            <code>{COOKIE_GENESIS_HASH}</code>
            <span className="hint">
              {" "}
              RPC-derived via getGenesisHash — docs.cookiechain.wtf does not
              currently publish a genesis hash.
            </span>
          </dd>
        </div>
      </dl>
      <p className="fineprint">
        If your wallet UI still shows Solana mainnet, add a custom SVM network
        with this RPC. Cookie Kitchen always reads COOK from{" "}
        <code>{COOKIE_RPC}</code>.
      </p>
    </section>
  );
}
