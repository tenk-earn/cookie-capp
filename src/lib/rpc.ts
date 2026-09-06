import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  type PerfSample,
} from "@solana/web3.js";
import {
  COOKIE_GENESIS_HASH,
  COOKIE_RPC,
  DEFAULT_FEE_PER_SIG_LAMPORTS,
  DEFAULT_FEE_SOURCE,
} from "../cluster";

export type ChainPulse = {
  slot: number;
  blockHeight: number;
  health: string;
  latencyMs: number;
  tps: number | null;
  nonVoteTps: number | null;
  samplesUsed: number;
  epoch: number | null;
  transactionCount: number | null;
  genesisHash: string;
  genesisMatchesDocsRpc: boolean;
  version: string | null;
  fetchedAt: number;
};

export type FeeQuote = {
  lamportsPerSig: number;
  source: string;
  live: boolean;
};

type Sample = PerfSample & { numNonVoteTransactions?: number };

function tpsFromSamples(
  samples: Sample[],
  field: "numTransactions" | "numNonVoteTransactions",
): number | null {
  if (!samples.length) return null;
  let tx = 0;
  let secs = 0;
  for (const sample of samples) {
    const count = sample[field];
    if (count == null) return null;
    tx += count;
    secs += sample.samplePeriodSecs;
  }
  return secs > 0 ? tx / secs : null;
}

export async function fetchHealth(): Promise<string> {
  const res = await fetch(COOKIE_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getHealth",
      params: [],
    }),
  });
  if (!res.ok) return `http ${res.status}`;
  const body = (await res.json()) as {
    result?: unknown;
    error?: { message?: string };
  };
  if (body.error?.message) return body.error.message;
  if (typeof body.result === "string") return body.result;
  return "unknown";
}

export async function fetchPulse(connection: Connection): Promise<ChainPulse> {
  const t0 = performance.now();
  const slot = await connection.getSlot("confirmed");
  const latencyMs = Math.round(performance.now() - t0);

  const [blockHeight, version, samples, epoch, genesisHash, health] =
    await Promise.all([
      connection.getBlockHeight("confirmed"),
      connection.getVersion().catch(() => null),
      connection.getRecentPerformanceSamples(5).catch(() => [] as PerfSample[]),
      connection.getEpochInfo("confirmed").catch(() => null),
      connection.getGenesisHash(),
      fetchHealth().catch(() => "unreachable"),
    ]);

  return {
    slot,
    blockHeight,
    health,
    latencyMs,
    tps: tpsFromSamples(samples, "numTransactions"),
    nonVoteTps: tpsFromSamples(samples, "numNonVoteTransactions"),
    samplesUsed: samples.length,
    epoch: epoch?.epoch ?? null,
    transactionCount: epoch?.transactionCount ?? null,
    genesisHash,
    genesisMatchesDocsRpc: genesisHash === COOKIE_GENESIS_HASH,
    version: version?.["solana-core"] ?? null,
    fetchedAt: Date.now(),
  };
}

export async function quoteFeePerSignature(
  connection: Connection,
): Promise<FeeQuote> {
  const fallback: FeeQuote = {
    lamportsPerSig: DEFAULT_FEE_PER_SIG_LAMPORTS,
    source: DEFAULT_FEE_SOURCE,
    live: false,
  };

  try {
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    const payer = Keypair.generate().publicKey;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: payer,
        lamports: 0,
      }),
    );
    tx.feePayer = payer;
    tx.recentBlockhash = blockhash;
    const message = tx.compileMessage();
    const { value } = await connection.getFeeForMessage(message, "confirmed");
    if (value == null) return fallback;
    const sigs = Math.max(1, message.header.numRequiredSignatures);
    const perSig = Math.round(value / sigs);
    return {
      lamportsPerSig: perSig,
      source: `Live getFeeForMessage on ${COOKIE_RPC}: ${value.toLocaleString("en-US")} lamports for a ${sigs}-signature message (${perSig} lamports/sig).`,
      live: true,
    };
  } catch {
    return fallback;
  }
}
