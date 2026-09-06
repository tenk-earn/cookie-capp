/** Web stub — Cookie Kitchen does not use Solana Mobile Wallet Adapter. */

export const SolanaMobileWalletAdapterWalletName = "Solana Mobile Wallet";

export class SolanaMobileWalletAdapter {
  name = SolanaMobileWalletAdapterWalletName;
  constructor(_config?: unknown) {}
  async connect(): Promise<void> {
    throw new Error("Solana Mobile Wallet Adapter is not used in Cookie Kitchen.");
  }
  async disconnect(): Promise<void> {}
  on(): this {
    return this;
  }
  off(): this {
    return this;
  }
}

export function createDefaultAddressSelector(): unknown {
  return {};
}

export function createDefaultAuthorizationResultCache(): unknown {
  return {};
}

export function createDefaultWalletNotFoundHandler(): unknown {
  return () => undefined;
}
