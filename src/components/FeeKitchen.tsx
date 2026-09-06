import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { DEFAULT_FEE_PER_SIG_LAMPORTS, LAMPORTS_PER_COOK } from "../cluster";
import { formatCook, formatInt } from "../lib/format";
import { quoteFeePerSignature, type FeeQuote } from "../lib/rpc";

const PRESETS = [1, 2, 4, 8, 16];

export function FeeKitchen() {
  const { connection } = useConnection();
  const [sigs, setSigs] = useState(1);
  const [quote, setQuote] = useState<FeeQuote>({
    lamportsPerSig: DEFAULT_FEE_PER_SIG_LAMPORTS,
    source: "Loading live getFeeForMessage…",
    live: false,
  });

  const refresh = useCallback(async () => {
    const next = await quoteFeePerSignature(connection);
    setQuote(next);
  }, [connection]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalLamports = quote.lamportsPerSig * sigs;
  const perCook = useMemo(
    () => quote.lamportsPerSig / LAMPORTS_PER_COOK,
    [quote.lamportsPerSig],
  );

  return (
    <section className="card" id="fees">
      <div className="card-head">
        <div>
          <p className="eyebrow">Fee recipe</p>
          <h2>Fee kitchen</h2>
        </div>
        <button type="button" className="ghost-btn" onClick={() => void refresh()}>
          Re-quote
        </button>
      </div>
      <p className="lede">
        Estimate COOK cost for N signatures. Base rate defaults to 0.000005 COOK
        per signature and is corroborated with <code>getFeeForMessage</code> on
        the Cookie RPC.
      </p>

      <label className="field">
        <span>Signatures</span>
        <input
          type="number"
          min={1}
          max={64}
          value={sigs}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n)) return;
            setSigs(Math.min(64, Math.max(1, Math.round(n))));
          }}
        />
      </label>
      <div className="presets">
        {PRESETS.map((n) => (
          <button
            key={n}
            type="button"
            className={n === sigs ? "chip on" : "chip"}
            onClick={() => setSigs(n)}
          >
            {n} sig
          </button>
        ))}
      </div>

      <div className="receipt">
        <div className="receipt-row">
          <span>Rate</span>
          <strong>
            {formatCook(quote.lamportsPerSig)} COOK / sig
          </strong>
        </div>
        <div className="receipt-row">
          <span>Lamports / sig</span>
          <strong>{formatInt(quote.lamportsPerSig)}</strong>
        </div>
        <div className="receipt-row">
          <span>Signatures</span>
          <strong>{sigs}</strong>
        </div>
        <div className="receipt-total">
          <span>Batch total</span>
          <strong>{formatCook(totalLamports)} COOK</strong>
        </div>
        <p className="receipt-sub">{formatInt(totalLamports)} lamports</p>
      </div>

      <p className={`source-label ${quote.live ? "ok" : ""}`}>
        {quote.live ? "Live quote · " : "Fallback · "}
        {quote.source}
      </p>
      <p className="fineprint">
        Published default is {perCook.toFixed(6)} COOK/sig when the live quote
        is unavailable. This kitchen does not submit transactions.
      </p>
    </section>
  );
}
