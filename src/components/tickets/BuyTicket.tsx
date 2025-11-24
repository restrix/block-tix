// // All NFT's minted seperately
// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Loader2, Ticket as TicketIcon } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
// import axios from "axios";

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   image: string;
//   category: string;
//   availableTickets: number;
//   price: number; // price per ticket in SOL
//   currency: string;
//   resaleEnabled: boolean;
//   resalePriceCap: number;
//   location: string;
//   organizer: string;
// }

// interface BuyTicketProps {
//   event: Event;
//   quantity: number;
//   disabled?: boolean;
// }

// const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

// // Upload metadata to Pinata
// async function uploadMetadataToPinata(metadata: any, jwt: string) {
//   const res = await axios.post(PINATA_JSON_URL, metadata, {
//     headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
//   });
//   return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
// }

// export function BuyTicket({ event, quantity, disabled = false }: BuyTicketProps) {
//   const { toast } = useToast();
//   const { publicKey, connected, signTransaction } = useWallet();
//   const [balance, setBalance] = useState(0);
//   const [purchaseComplete, setPurchaseComplete] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const connection = new Connection("https://api.devnet.solana.com", "confirmed");

//   // Now always Option A
//   const MINT_MODE = "A";

//   // Fetch wallet balance
//   useEffect(() => {
//     if (!publicKey) return setBalance(0);
//     connection.getBalance(publicKey).then((lamports) => setBalance(lamports / LAMPORTS_PER_SOL));
//   }, [publicKey]);

//   const totalPrice = event.price * quantity;

//   const handleBuyTicket = async () => {
//     if (!connected || !publicKey || !signTransaction)
//       return toast({ title: "Wallet not connected", description: "Connect your wallet first", variant: "destructive" });

//     if (balance < totalPrice)
//       return toast({
//         title: "Insufficient funds",
//         description: `Need at least ${totalPrice} SOL`,
//         variant: "destructive",
//       });

//     setIsLoading(true);

//     try {
//       const pinataJwt = import.meta.env.VITE_PINATA_JWT;
//       if (!pinataJwt) throw new Error("Missing Pinata JWT");

//       const metaplex = Metaplex.make(connection).use(
//         walletAdapterIdentity({ publicKey, signTransaction })
//       );

//       // Single option — multiple NFTs
//       for (let i = 1; i <= quantity; i++) {
//         const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}_${i}`;

//         const metadata = {
//           name: `Ticket #${i} for ${event.title}`,
//           description: event.description,
//           image: event.image,
//           attributes: [
//             { trait_type: "Event", value: event.title },
//             { trait_type: "Date", value: event.date },
//             { trait_type: "Venue", value: event.location },
//             { trait_type: "Owner", value: publicKey.toBase58() },
//             { trait_type: "Ticket ID", value: ticketId },
//             { trait_type: "Batch Size", value: quantity },
//           ],
//         };

//         const metadataUri = await uploadMetadataToPinata(metadata, pinataJwt);

//         await metaplex.nfts().create({
//           uri: metadataUri,
//           name: `Ticket ${i}/${quantity}: ${event.title}`,
//           sellerFeeBasisPoints: 0,
//           symbol: "BLOCKTIX",
//         });
//       }

//       toast({
//         title: "Success!",
//         description: "Your ticket(s) have been minted to your wallet.",
//       });

//       setPurchaseComplete(true);
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err.message || "Failed to purchase ticket",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setOpenDialog(false);
//     if (purchaseComplete) window.location.href = "/dashboard";
//   };

//   return (
//     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//       <DialogTrigger asChild>
//         <Button disabled={disabled || !connected} className="flex items-center space-x-2">
//           <TicketIcon className="h-4 w-4" />
//           <span>Buy Ticket</span>
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md">
//         {purchaseComplete ? (
//           <>
//             <DialogHeader>
//               <DialogTitle>Purchase Complete!</DialogTitle>
//               <DialogDescription>Your ticket(s) have been minted.</DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button onClick={handleClose}>View My Tickets</Button>
//             </DialogFooter>
//           </>
//         ) : (
//           <>
//             <DialogHeader>
//               <DialogTitle>Confirm Purchase</DialogTitle>
//               <DialogDescription>
//                 Buying <strong>{quantity}</strong> ticket(s) for{" "}
//                 <strong>{event.price} SOL</strong> each.
//                 <br />
//                 <br />
//                 <strong>Total:</strong> {totalPrice} SOL
//               </DialogDescription>
//             </DialogHeader>

//             <DialogFooter>
//               <Button onClick={handleBuyTicket} disabled={isLoading}>
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Purchase"}
//               </Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Loader2, Ticket as TicketIcon } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
// import axios from "axios";

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   image: string;
//   category: string;
//   availableTickets: number;
//   price: number; // price per ticket in SOL
//   currency: string;
//   resaleEnabled: boolean;
//   resalePriceCap: number;
//   location: string;
//   organizer: string;
// }

// interface BuyTicketProps {
//   event: Event;
//   quantity: number;
//   disabled?: boolean;
// }

// const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

// // Upload metadata to Pinata
// async function uploadMetadataToPinata(metadata: any, jwt: string) {
//   const res = await axios.post(PINATA_JSON_URL, metadata, {
//     headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
//   });
//   return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
// }

// export function BuyTicket({ event, quantity, disabled = false }: BuyTicketProps) {
//   const { toast } = useToast();
//   // use the whole wallet adapter and then destructure — avoids Non-base58 issues
//   const wallet = useWallet();
//   const { publicKey, connected, signTransaction } = wallet;

//   const [balance, setBalance] = useState(0);
//   const [purchaseComplete, setPurchaseComplete] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const connection = new Connection("https://api.devnet.solana.com", "confirmed");

//   // Fetch wallet balance
//   useEffect(() => {
//     if (!publicKey) return setBalance(0);
//     connection.getBalance(publicKey).then((lamports) => setBalance(lamports / LAMPORTS_PER_SOL));
//   }, [publicKey]);

//   const totalPrice = event.price * quantity;

//   const handleBuyTicket = async () => {
//     console.log("Buying ticket bundle", event, "quantity:", quantity);

//     if (!event) return toast({ title: "Error", description: "Event missing", variant: "destructive" });
//     if (!connected || !publicKey || !signTransaction)
//       return toast({ title: "Wallet not connected", description: "Connect your wallet first", variant: "destructive" });

//     if (balance < totalPrice)
//       return toast({ title: "Insufficient funds", description: `Need at least ${totalPrice} SOL`, variant: "destructive" });

//     setIsLoading(true);

//     try {
//       // 1️⃣ Build bundle metadata
//       const ticketId = `tkt_bundle_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
//       const metadata = {
//         name: `Ticket Bundle for ${event.title}`,
//         description: `${event.description}\nBundle of ${quantity} ticket(s) for ${event.title}`,
//         image: event.image,
//         attributes: [
//           { trait_type: "Event", value: event.title },
//           { trait_type: "Date", value: event.date },
//           { trait_type: "Venue", value: event.location },
//           { trait_type: "Owner", value: publicKey.toBase58() },
//           { trait_type: "Bundle Quantity", value: quantity },
//           { trait_type: "Ticket ID", value: ticketId },
//         ],
//         properties: { category: "ticket-bundle" },
//       };

//       // 2️⃣ Upload metadata to Pinata
//       const pinataJwt = import.meta.env.VITE_PINATA_JWT;
//       if (!pinataJwt) throw new Error("Missing Pinata JWT");
//       const metadataUri = await uploadMetadataToPinata(metadata, pinataJwt);

//       // 3️⃣ Mint single NFT (bundle) via Metaplex
//       const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
//       const { nft } = await metaplex.nfts().create({
//         uri: metadataUri,
//         name: `Ticket Bundle (${quantity}x): ${event.title}`,
//         sellerFeeBasisPoints: 0,
//         symbol: "BLOCKTIX",
//       });

//       console.log("Bundle NFT minted:", nft.address.toBase58());
//       toast({ title: "Success", description: `Bundle minted: ${quantity} ticket(s)` });
//       setPurchaseComplete(true);
//     } catch (err: any) {
//       console.error(err);
//       toast({ title: "Error", description: err.message || "Failed to purchase ticket bundle", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setOpenDialog(false);
//     if (purchaseComplete) window.location.href = "/dashboard";
//   };

//   return (
//     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//       {/* Trigger button */}
//       <DialogTrigger asChild>
//         <Button disabled={disabled || !connected} className="flex items-center space-x-2">
//           <TicketIcon className="h-4 w-4" />
//           <span>Buy Ticket</span>
//         </Button>
//       </DialogTrigger>

//       {/* Dialog content */}
//       <DialogContent className="sm:max-w-md">
//         {purchaseComplete ? (
//           <>
//             <DialogHeader>
//               <DialogTitle>Purchase Complete!</DialogTitle>
//               <DialogDescription>Your ticket bundle has been minted to your wallet.</DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button onClick={handleClose}>View My Tickets</Button>
//             </DialogFooter>
//           </>
//         ) : (
//           <>
//             <DialogHeader>
//               <DialogTitle>Confirm Purchase</DialogTitle>
//               <DialogDescription>
//                 You are about to purchase <strong>{quantity}</strong> ticket(s) for <strong>{event.title}</strong>.<br />
//                 <br />
//                 <strong>Per ticket:</strong> {event.price} SOL<br />
//                 <strong>Total:</strong> {totalPrice} SOL
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button onClick={handleBuyTicket} disabled={isLoading}>
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Purchase"}
//               </Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
// All NFT's minted separately
// All NFT's minted separately
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket as TicketIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
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
  organizer_wallet: string;
}

interface BuyTicketProps {
  event: Event;
  quantity: number;
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

export function BuyTicket({ event, quantity, disabled = false }: BuyTicketProps) {
  const { toast } = useToast();
  const { publicKey, connected, signTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  console.log("Organizer address:", event.organizer_wallet);

  const ORGANIZER_WALLET = new PublicKey(event.organizer_wallet);

  // Fetch wallet balance
  useEffect(() => {
    if (!publicKey) return setBalance(0);
    connection.getBalance(publicKey).then((lamports) => setBalance(lamports / LAMPORTS_PER_SOL));
  }, [publicKey]);

  const totalPrice = event.price * quantity;

  const handleBuyTicket = async () => {
    if (!connected || !publicKey || !signTransaction)
      return toast({
        title: "Wallet not connected",
        description: "Connect your wallet first",
        variant: "destructive",
      });

    if (balance < totalPrice)
      return toast({
        title: "Insufficient funds",
        description: `Need at least ${totalPrice} SOL`,
        variant: "destructive",
      });

    setIsLoading(true);

    try {
      // 1️⃣ Send SOL to organizer
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: ORGANIZER_WALLET,
          lamports: totalPrice * LAMPORTS_PER_SOL,
        })
      );
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            transaction.feePayer = publicKey;
                  

      const signedTx = await signTransaction(transaction);
      const txSignature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txSignature, "confirmed");

      console.log("Payment Signature:", txSignature);

      // 2️⃣ Mint NFTs (one per ticket)
      const pinataJwt = import.meta.env.VITE_PINATA_JWT;
      if (!pinataJwt) throw new Error("Missing Pinata JWT");

      const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity({ publicKey, signTransaction })
      );

      for (let i = 1; i <= quantity; i++) {
        const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}_${i}`;

        const metadata = {
          name: `Ticket #${i} for ${event.title}`,
          description: event.description,
          image: event.image,
          attributes: [
            { trait_type: "Event", value: event.title },
            { trait_type: "Date", value: event.date },
            { trait_type: "Venue", value: event.location },
            { trait_type: "Owner", value: publicKey.toBase58() },
            { trait_type: "Ticket ID", value: ticketId },
            { trait_type: "Batch Size", value: quantity },
          ],
        };

        const metadataUri = await uploadMetadataToPinata(metadata, pinataJwt);

        await metaplex.nfts().create({
          uri: metadataUri,
          name: `Ticket ${i}/${quantity}: ${event.title}`,
          sellerFeeBasisPoints: 0,
          symbol: "BLOCKTIX",
        });
      }

      toast({
        title: "Success!",
        description: "Payment sent and tickets minted.",
      });

      setPurchaseComplete(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to purchase ticket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    if (purchaseComplete) window.location.href = "/dashboard";
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button disabled={disabled || !connected} className="flex items-center space-x-2">
          <TicketIcon className="h-4 w-4" />
          <span>Buy Ticket</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {purchaseComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Purchase Complete!</DialogTitle>
              <DialogDescription>Your ticket(s) have been minted.</DialogDescription>
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
                Buying <strong>{quantity}</strong> ticket(s) for{" "}
                <strong>{event.price} SOL</strong> each.
                <br />
                <br />
                <strong>Total:</strong> {totalPrice} SOL
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button onClick={handleBuyTicket} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Purchase"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
