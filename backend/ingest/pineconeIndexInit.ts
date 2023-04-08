import * as dotenv from "dotenv";
import { pineconeClient } from "../clients/pineconeClientInit.js";

dotenv.config();

const initPineconeIndex = async () => {
  try {
    if (!process.env.PINECONE_INDEX) {
      throw new Error("PINECONE_INDEX not set");
    }

    return pineconeClient.Index(process.env.PINECONE_INDEX);
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export { initPineconeIndex };
