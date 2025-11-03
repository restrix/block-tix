"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { events, generateAuctions, generateTickets, users } from "@/lib/mock-data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TicketsTab } from "@/components/dashboard/tickets-tab";
import { AuctionsTab } from "@/components/dashboard/auctions-tab";
import { TransactionHistoryTab } from "@/components/dashboard/transaction-history-tab";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Dashboard() {
  const { toast } = useToast();
  const { connected, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  if (!connected || !publicKey) {
    // If wallet is not connected, show the WalletMultiButton
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <WalletMultiButton className="w-full max-w-xs" />
        </div>
      </MainLayout>
    );
  }

  // Use real wallet address from the connected wallet
  const walletAddress = publicKey.toBase58();

  // Get user's tickets
  const tickets = generateTickets().filter(ticket => 
    users.find(u => u.walletAddress === walletAddress)?.tickets.includes(ticket.id)
  );

  // Get user's bids
  const allAuctions = generateAuctions();
  const userBids = users.find(u => u.walletAddress === walletAddress)?.bids || [];
  const biddingAuctions = allAuctions.filter(auction => 
    auction.bids.some(bid => userBids.includes(bid.id))
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader walletAddress={walletAddress} />

        <Tabs defaultValue="tickets">
          <TabsList className="mb-8">
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <TicketsTab tickets={tickets} events={events} />
          </TabsContent>

          <TabsContent value="bids">
            <AuctionsTab 
              auctions={biddingAuctions} 
              tickets={generateTickets()} 
              events={events} 
            />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
