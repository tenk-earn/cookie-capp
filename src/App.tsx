import { AddressPeek } from "./components/AddressPeek";
import { FeeKitchen } from "./components/FeeKitchen";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { OfficialLinks } from "./components/OfficialLinks";
import { PulseCard } from "./components/PulseCard";
import { WalletJar } from "./components/WalletJar";
import { COOKIE_RPC } from "./cluster";

export default function App() {
  return (
    <div id="top" className="page">
      <Header />
      <main className="shell">
        <section className="hero">
          <p className="eyebrow">Cookie Chain · SVM · read-only</p>
          <h1>Watch the oven. Price the batch. Peek the jar.</h1>
          <p className="hero-lede">
            Cookie Kitchen is an original utility cApp on Cookie Chain. Every
            chain call goes to <code>{COOKIE_RPC}</code> — a custom SVM cluster,
            not Solana mainnet.
          </p>
        </section>
        <PulseCard />
        <div className="split">
          <FeeKitchen />
          <WalletJar />
        </div>
        <AddressPeek />
        <OfficialLinks />
      </main>
      <Footer />
    </div>
  );
}
