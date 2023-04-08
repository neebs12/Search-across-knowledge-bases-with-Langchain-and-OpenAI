// Import modules
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores";

// Load environment variables
dotenv.config();

// check if environment variables are set, nice to have and pleases ts
if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY not set");
} else if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error("PINECONE_ENVIRONMENT not set");
} else if (!process.env.PINECONE_INDEX) {
  throw new Error("PINECONE_INDEX not set");
}

// Create a Pinecone client
const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

// Get a Pinecone index
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

// Create some documents
const docs = [
  new Document({
    metadata: { foo: "bar" },
    pageContent: "pinecone is a vector db",
  }),
  new Document({
    metadata: { foo: "bar" },
    pageContent: "the quick brown fox jumped over the lazy dog",
  }),
  new Document({
    metadata: { baz: "qux" },
    pageContent: "lorem ipsum dolor sit amet",
  }),
  new Document({
    metadata: { baz: "qux" },
    pageContent: "pinecones are the woody fruiting body and of a pine tree",
  }),
];

// Upsert documents into a namespace called "test"
await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  pineconeIndex,
  namespace: "test",
});
