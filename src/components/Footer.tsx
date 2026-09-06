import {
  EARN_LISTING,
  TENK_BASE_RECEIVE,
  TENK_SOLANA_RECEIVE,
} from "../cluster";

export function Footer() {
  return (
    <footer className="footer">
      <p>
        Cookie Kitchen is a read-only utility cApp. It does not launch tokens,
        create LPs or pools, or trade.
      </p>
      <p>
        Superteam Earn listing:{" "}
        <a href={EARN_LISTING} target="_blank" rel="noreferrer">
          Create an App on Cookie Chain
        </a>
      </p>
      <p className="receives">
        TenK public receives (not Cookie Chain addresses; not in-app
        destinations): Solana{" "}
        <code>{TENK_SOLANA_RECEIVE}</code> / Base{" "}
        <code>{TENK_BASE_RECEIVE}</code>
      </p>
    </footer>
  );
}
