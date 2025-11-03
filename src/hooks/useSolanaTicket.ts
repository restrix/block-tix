import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { logTransaction } from "@/lib/utils";
import { TicketNFTMetadata } from "@/types/nft-metadata";

export function useSolanaTicket() {
  const { wallet, publicKey, connected, refreshNFTs } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const mintTicket = async (eventId: string, seatInfo: string, metadata: TicketNFTMetadata) => {
    if (!connected || !publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected or cannot sign transactions");
    }

    setIsLoading(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      // Just send SOL to organizer
      const organizerPubKey = new PublicKey("HndjAZBimoFvnTiKJoVn8dD73Uc4BMFmExrdMjKqWtbc");
      const lamports = metadata.properties.ticket_data?.original_price || 0;

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: organizerPubKey,
          lamports,
        })
      );

      const signedTx = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      await refreshNFTs();

      logTransaction("purchase", lamports, `Ticket minted: ${metadata.name}`);

      return { signature, mintAddress: null };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mintTicket, isReady: connected && !!wallet.signTransaction, isLoading };
}
