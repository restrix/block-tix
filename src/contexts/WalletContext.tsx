"use client";

import React, { FC, ReactNode, useMemo, useEffect, createContext, useContext, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// import "@solana/wallet-adapter-react-ui/styles.css";
import { fetchNFTsForWallet } from "@/services/fetcher";

interface WalletContextProps {
  wallet: any;
  publicKey: PublicKey | null;
  connected: boolean;
  nfts: any[];
  refreshNFTs: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps>({
  wallet: null,
  publicKey: null,
  connected: false,
  nfts: [],
  refreshNFTs: async () => { },
});

interface WalletContextProviderProps {
  children: ReactNode;
}

const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const network = "devnet";
  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  const solanaWallet = useSolanaWallet();
  const [nfts, setNFTs] = useState<any[]>([]);

  const refreshNFTs = async () => {
    if (!solanaWallet.publicKey) return;
    try {
      const connection = new Connection(endpoint);
      const walletNFTs = await fetchNFTsForWallet(
        connection,
        solanaWallet.publicKey, // make sure it's a string
      );
      setNFTs(walletNFTs);
    } catch (err) {
      console.error("Failed to fetch NFTs:", err);
      setNFTs([]);
    }
  };

  useEffect(() => {
    if (solanaWallet.connected) {
      refreshNFTs();
    } else {
      setNFTs([]);
    }
  }, [solanaWallet.connected, solanaWallet.publicKey]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContext.Provider
            value={{
              wallet: solanaWallet,
              publicKey: solanaWallet.publicKey,
              connected: solanaWallet.connected,
              nfts,
              refreshNFTs,
            }}
          >
            {children}
          </WalletContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useWallet = () => useContext(WalletContext);

export default WalletContextProvider;
