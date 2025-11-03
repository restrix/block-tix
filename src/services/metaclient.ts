// src/services/metaplexClient.ts
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, keypairIdentity, walletAdapterIdentity } from '@metaplex-foundation/js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// create connection once
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export function makeMetaplex(walletAdapter: any) {
  const mx = Metaplex.make(connection);
  if (walletAdapter && walletAdapter.publicKey) {
    mx.use(walletAdapterIdentity(walletAdapter));
  }
  return mx;
}
