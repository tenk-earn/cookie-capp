import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  COOKIE_GENESIS_HASH,
  COOKIE_RPC,
  SOLANA_MAINNET_GENESIS,
} from "../cluster";
import { formatInt, shortKey, timeAgo } from "../lib/format";
import { fetchPulse, type ChainPulse } from "../lib/rpc";
import { CopyButton } from "./CopyButton";

const POLL_MS = 8_000;

export function PulseCard() {
  const { connection } = useConnection();
  const [pulse, setPulse] = useState<ChainPulse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchPulse(connection);
      setPulse(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pulse fetch failed");
    } finally {
      setBusy(false);
    }
  }, [connection]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  const healthy = pulse?.health === "ok";
  const genesisOk =
    pulse != null && pulse.genesisHash === COOKIE_GENESIS_HASH;
  const notSolana =
    pulse != null && pulse.genesisHash !== SOLANA_MAINNET_GENESIS;

  return (
    <section className="card pulse-card" id="pulse">
      <div className="card-head">
        <div>
          <p className="eyebrow">Live oven</p>
          <h2>Chain pulse</h2>
        </div>
        <button type="button" className="ghost-btn" onClick={() => void refresh()}>
          Refresh
        </button>
      </div>

      <div className="pulse-layout">
        <div className={`oven ${healthy ? "hot" : "cold"}`} aria-hidden="true">
          <div className="oven-frame">
            <div className="oven-window">
              <div className="oven-glow" />
              <p className="oven-kicker">slot</p>
              <p className="oven-slot">
                {pulse ? formatInt(pulse.slot) : busy ? "…" : "—"}
              </p>
              <p className="oven-health">
                {pulse ? pulse.health : busy ? "reading" : "offline"}
              </p>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <Metric
            label="Block height"
            value={pulse ? formatInt(pulse.blockHeight) : "—"}
          />
          <Metric
            label="RPC latency"
            value={pulse ? `${pulse.latencyMs} ms` : "—"}
            hint="Timed getSlot against Cookie RPC"
          />
          <Metric
            label="Rough TPS"
            value={
              pulse?.tps == null ? "n/a" : pulse.tps.toFixed(2)
            }
            hint={
              pulse?.samplesUsed
                ? `getRecentPerformanceSamples (${pulse.samplesUsed} × ~60s)`
                : "getRecentPerformanceSamples unavailable"
            }
          />
          <Metric
            label="Non-vote TPS"
            value={
              pulse?.nonVoteTps == null ? "n/a" : pulse.nonVoteTps.toFixed(2)
            }
          />
          <Metric
            label="Health"
            value={pulse?.health ?? "—"}
            tone={healthy ? "ok" : pulse ? "bad" : undefined}
          />
          <Metric
            label="Agave / epoch"
            value={
              pulse
                ? `${pulse.version ?? "?"} · ${pulse.epoch ?? "—"}`
                : "—"
            }
            hint={
              pulse?.transactionCount != null
                ? `${formatInt(pulse.transactionCount)} txs`
                : undefined
            }
          />
        </div>
      </div>

      {error ? <p className="banner bad">{error}</p> : null}

      <div className="proof-strip">
        <div className="proof-row">
          <span>RPC</span>
          <code>{COOKIE_RPC}</code>
          <CopyButton value={COOKIE_RPC} />
        </div>
        <div className="proof-row">
          <span>Cookie genesis</span>
          <code title={pulse?.genesisHash ?? COOKIE_GENESIS_HASH}>
            {shortKey(pulse?.genesisHash ?? COOKIE_GENESIS_HASH, 6, 6)}
          </code>
          <CopyButton value={pulse?.genesisHash ?? COOKIE_GENESIS_HASH} />
        </div>
        <div className="proof-row">
          <span>Solana mainnet genesis</span>
          <code title={SOLANA_MAINNET_GENESIS}>
            {shortKey(SOLANA_MAINNET_GENESIS, 6, 6)}
          </code>
        </div>
        <p className="proof-note">
          {genesisOk && notSolana
            ? "Genesis matches Cookie RPC and is not Solana mainnet-beta. This page never calls api.mainnet-beta.solana.com."
            : "Waiting on getGenesisHash from Cookie RPC to prove cluster identity."}
          {pulse
            ? ` Last tick ${timeAgo(Math.floor(pulse.fetchedAt / 1000))}.`
            : null}
        </p>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "ok" | "bad";
}) {
  return (
    <div className="metric">
      <p className="metric-label">{label}</p>
      <p className={`metric-value ${tone ?? ""}`}>{value}</p>
      {hint ? <p className="metric-hint">{hint}</p> : null}
    </div>
  );
}
