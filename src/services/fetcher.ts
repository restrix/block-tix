import { Connection, PublicKey } from "@solana/web3.js";

/**
 * Fetch all NFT mint addresses for a given wallet
 * @param connection Solana connection object
 * @param walletPublicKey Wallet public key
 * @returns Array of NFT mint addresses as strings
 */
export async function fetchNFTsForWallet(
  connection: Connection,
  walletPublicKey: PublicKey
): Promise<string[]> {
  try {
    // Get all token accounts for this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    // Filter only NFTs (amount = 1, decimals = 0)
    const nftMints: string[] = [];
    for (const { account } of tokenAccounts.value) {
      const tokenAmount = account.data.parsed.info.tokenAmount;
      if (tokenAmount.amount === "1" && tokenAmount.decimals === 0) {
        nftMints.push(account.data.parsed.info.mint);
      }
    }

    return nftMints;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}
