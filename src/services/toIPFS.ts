import axios from "axios";

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface Metadata {
  name: string;
  description: string;
  image?: string;
  attributes: Attribute[];
  properties?: {
    category: string;
  };
}

// Get JWT from Vite env
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
if (!PINATA_JWT) throw new Error("Missing Pinata JWT");

const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export async function uploadMetadataToIPFS(metadata: Metadata): Promise<string> {
  const response = await axios.post(PINATA_JSON_URL, metadata, {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
  });

  const metadataCID = response.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${metadataCID}`;
}
