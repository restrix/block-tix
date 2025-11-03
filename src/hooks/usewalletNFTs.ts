import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export const useWalletNFTs = () => {
  const { publicKey, wallet, connected } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!connected || !publicKey || !wallet) {
        setNfts([]);
        return;
      }

      setLoading(true);
      try {
        const connection = new Connection(clusterApiUrl("devnet"));
        const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet.adapter));

        const ownedNFTs = await metaplex.nfts().findAllByOwner({ owner: publicKey });
        setNfts(ownedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [connected, publicKey, wallet]);

  return { nfts, loading };
};
