"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  useWallet,
  WalletProvider as SolanaWalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

export function ConnectWallet() {
  const { connected, publicKey, wallet, disconnect } = useWallet();

  // Clean up localStorage cache when disconnected
  useEffect(() => {
    if (!connected) {
      localStorage.removeItem("walletName");
      localStorage.removeItem("walletAdapter");
      console.log("🧹 Cleared wallet cache after disconnection");
    }
  }, [connected]);

  // Log wallet connection info for debugging
  useEffect(() => {
    console.log("Connected:", connected);
    console.log("Public Key:", publicKey?.toBase58());
    console.log("Wallet Adapter Name:", wallet?.adapter?.name);
  }, [connected, publicKey, wallet]);

  // Supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4 text-white">
            Connect Your Wallet
          </h1>

          {/* Wallet connect button */}
          <WalletMultiButton className="w-full max-w-sm" />

          {/* Show wallet info if connected */}
          {connected && publicKey && (
            <Card className="mt-6 max-w-sm w-full bg-black/50 border border-emerald-500/20">
              <CardHeader>
                <h2 className="text-lg font-semibold text-emerald-400">
                  Connected Wallet
                </h2>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-white/80 break-all">
                  Public Key: {publicKey.toBase58()}
                </p>
                <p className="font-mono mt-2 text-white/80">
                  Adapter: {wallet?.adapter?.name || "Unknown"}
                </p>
                <button
                  onClick={async () => {
                    await disconnect();
                    localStorage.removeItem("walletName");
                    localStorage.removeItem("walletAdapter");
                  }}
                  className="mt-4 w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 py-2 rounded-lg border border-emerald-500/30 transition-all"
                >
                  Disconnect Wallet
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
