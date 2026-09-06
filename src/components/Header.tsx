import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { COOKIE_CLUSTER_LABEL, COOKIE_RPC } from "../cluster";

export function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="36" height="36">
            <circle cx="24" cy="25" r="16" fill="#c47a3a" />
            <circle cx="24" cy="24" r="14.5" fill="#e2a05a" />
            <circle cx="18" cy="18" r="2.2" fill="#4a2a14" />
            <circle cx="29" cy="17" r="1.8" fill="#4a2a14" />
            <circle cx="32" cy="26" r="2.1" fill="#4a2a14" />
            <circle cx="20" cy="28" r="1.7" fill="#4a2a14" />
            <circle cx="27" cy="32" r="2" fill="#4a2a14" />
          </svg>
        </span>
        <span>
          <span className="brand-name">Cookie Kitchen</span>
          <span className="brand-sub">Cookie Chain cApp</span>
        </span>
      </a>
      <div className="topbar-right">
        <span className="cluster-pill" title={COOKIE_RPC}>
          <span className="dot live" />
          {COOKIE_CLUSTER_LABEL}
        </span>
        <WalletMultiButton />
      </div>
    </header>
  );
}
