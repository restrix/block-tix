"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

interface WalletBalanceContextType {
  balance: number;
  refreshBalance: () => Promise<void>;
}

const WalletBalanceContext = createContext<WalletBalanceContextType>({
  balance: 0,
  refreshBalance: async () => {},
});

export const WalletBalanceProvider = ({ children }: { children: ReactNode }) => {
  const { connected, publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  const refreshBalance = async () => {
    if (!connected || !publicKey) return;
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const lamports = await connection.getBalance(publicKey);
    setBalance(lamports / LAMPORTS_PER_SOL);
  };

  // Fetch balance on wallet connect
  useEffect(() => {
    refreshBalance();
  }, [connected, publicKey]);

  return (
    <WalletBalanceContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </WalletBalanceContext.Provider>
  );
};

// Custom hook to access balance anywhere
export const useWalletBalance = () => useContext(WalletBalanceContext);
