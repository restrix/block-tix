"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket as TicketIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import axios from "axios";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  availableTickets: number;
  price: number;
  currency: string;
  resaleEnabled: boolean;
  resalePriceCap: number;
  location: string;
  organizer: string;
}

interface BuyTicketProps {
  event: Event;
  disabled?: boolean;
}

const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

// Upload metadata to Pinata
async function uploadMetadataToPinata(metadata: any, jwt: string) {
  const res = await axios.post(PINATA_JSON_URL, metadata, {
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
  });
  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

export function BuyTicket({ event, disabled = false }: BuyTicketProps) {
  const { toast } = useToast();
  const { publicKey, connected, signTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  // Fetch wallet balance
  useEffect(() => {
    if (!publicKey) return setBalance(0);
    connection.getBalance(publicKey).then((lamports) => setBalance(lamports / LAMPORTS_PER_SOL));
  }, [publicKey]);

  const handleBuyTicket = async () => {
    console.log("Buying ticket", event);

    if (!event) return toast({ title: "Error", description: "Event missing", variant: "destructive" });
    if (!connected || !publicKey || !signTransaction)
      return toast({ title: "Wallet not connected", description: "Connect your wallet first", variant: "destructive" });

    if (balance < event.price)
      return toast({ title: "Insufficient funds", description: `Need at least ${event.price} SOL`, variant: "destructive" });

    setIsLoading(true);

    try {
      // 1️⃣ Create ticket metadata
      const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const metadata = {
        name: `Ticket for ${event.title}`,
        description: event.description,
        image: event.image,
        attributes: [
          { trait_type: "Event", value: event.title },
          { trait_type: "Date", value: event.date },
          { trait_type: "Venue", value: event.location },
          { trait_type: "Owner", value: publicKey.toBase58() },
          { trait_type: "Ticket ID", value: ticketId },
        ],
        properties: { category: "ticket" },
      };

      // 2️⃣ Upload to Pinata
      const pinataJwt = import.meta.env.VITE_PINATA_JWT;
      if (!pinataJwt) throw new Error("Missing Pinata JWT");
      const metadataUri = await uploadMetadataToPinata(metadata, pinataJwt);

      // 3️⃣ Mint NFT via Metaplex
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity({ publicKey, signTransaction }));
      const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: `Ticket: ${event.title}`,
        sellerFeeBasisPoints: 0,
        symbol: "BLOCKTIX",
      });

      console.log("NFT minted:", nft.address.toBase58());
      toast({ title: "Success", description: "Ticket purchased and minted!" });
      setPurchaseComplete(true);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to purchase ticket", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    if (purchaseComplete) window.location.href = "/dashboard";
  };

  const hasEnoughBalance = balance >= event.price;

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button disabled={disabled || !connected || !hasEnoughBalance} className="flex items-center space-x-2">
          <TicketIcon className="h-4 w-4" />
          <span>Buy Ticket</span>
        </Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="sm:max-w-md">
        {purchaseComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Purchase Complete!</DialogTitle>
              <DialogDescription>Your ticket has been minted to your wallet.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleClose}>View My Tickets</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                You are about to purchase a ticket for <strong>{event.title}</strong> at {event.price} SOL.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleBuyTicket} disabled={isLoading || !hasEnoughBalance}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Purchase"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
