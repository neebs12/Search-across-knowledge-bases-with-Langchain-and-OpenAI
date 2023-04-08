import * as dotenv from "dotenv";
import { PineconeClient } from "@pinecone-database/pinecone";

dotenv.config();

if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY not set");
} else if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error("PINECONE_ENVIRONMENT not set");
} else if (!process.env.PINECONE_INDEX) {
  throw new Error("PINECONE_INDEX not set");
}

const pineconeClient = new PineconeClient();
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
pineconeClient.projectName = "default project";

export { pineconeClient };
