import { useState, type FormEvent } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, type ConfirmedSignatureInfo } from "@solana/web3.js";
import {
  EXPLORER_ACCOUNT,
  EXPLORER_TX,
  SAMPLE_PEEK_ADDRESS,
  SAMPLE_PEEK_NOTE,
} from "../cluster";
import { formatCook, formatInt, shortKey, timeAgo } from "../lib/format";

type PeekResult = {
  address: string;
  lamports: number;
  signatures: ConfirmedSignatureInfo[];
};

export function AddressPeek() {
  const { connection } = useConnection();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PeekResult | null>(null);

  async function run(address: string) {
    setBusy(true);
    setError(null);
    try {
      const pubkey = new PublicKey(address.trim());
      const [lamports, signatures] = await Promise.all([
        connection.getBalance(pubkey, "confirmed"),
        connection.getSignaturesForAddress(pubkey, { limit: 5 }),
      ]);
      setResult({
        address: pubkey.toBase58(),
        lamports,
        signatures,
      });
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error ? err.message : "Could not peek that address",
      );
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(input);
  }

  return (
    <section className="card" id="peek">
      <div className="card-head">
        <div>
          <p className="eyebrow">Oven window</p>
          <h2>Address peek</h2>
        </div>
      </div>
      <p className="lede">
        Paste a Cookie Chain pubkey to read native COOK balance and the last 5
        signatures via <code>getSignaturesForAddress</code>.
      </p>

      <form className="peek-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Pubkey</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cookie Chain address"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <div className="peek-actions">
          <button type="submit" className="primary-btn" disabled={busy}>
            {busy ? "Peeking…" : "Peek"}
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              setInput(SAMPLE_PEEK_ADDRESS);
              void run(SAMPLE_PEEK_ADDRESS);
            }}
          >
            Sample validator
          </button>
        </div>
      </form>
      <p className="fineprint">{SAMPLE_PEEK_NOTE}</p>

      {error ? <p className="banner bad">{error}</p> : null}

      {result ? (
        <div className="peek-result">
          <div className="wallet-row">
            <span>Address</span>
            <code>{shortKey(result.address, 6, 6)}</code>
            <a
              className="text-link"
              href={EXPLORER_ACCOUNT(result.address)}
              target="_blank"
              rel="noreferrer"
            >
              cookiescan
            </a>
          </div>
          <div className="wallet-row">
            <span>Balance</span>
            <strong className="cook-amt">
              {formatCook(result.lamports)} COOK
            </strong>
          </div>

          <h3 className="subhead">Last 5 signatures</h3>
          {result.signatures.length === 0 ? (
            <p className="empty">No signatures returned for this address.</p>
          ) : (
            <ul className="sig-list">
              {result.signatures.map((sig) => (
                <li key={sig.signature}>
                  <a
                    href={EXPLORER_TX(sig.signature)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortKey(sig.signature, 8, 8)}
                  </a>
                  <span>slot {formatInt(sig.slot)}</span>
                  <span>{timeAgo(sig.blockTime)}</span>
                  <span className={sig.err ? "tone-bad" : "tone-ok"}>
                    {sig.err ? "err" : "ok"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
