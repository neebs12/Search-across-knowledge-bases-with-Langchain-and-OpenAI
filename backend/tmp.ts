// Import modules
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores";

// import { loadAndWriteDocumentToJSON } from "./ingest/loadTextAndWriteJson.js";

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
    metadata: { id: "test-1", foo: "bar" },
    pageContent: "pinecone is a vector db",
  }),
  new Document({
    metadata: { id: "test-2", foo: "bar" },
    pageContent: "the quick brown fox jumped over the lazy dog",
  }),
  new Document({
    metadata: { id: "test-3", baz: "qux" },
    pageContent: "lorem ipsum dolor sit amet",
  }),
  new Document({
    metadata: { id: "test-4", baz: "qux" },
    pageContent: "pinecones are the woody fruiting body and of a pine tree",
  }),
];

// Upsert documents into a namespace called "test" -- no id
// await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//   pineconeIndex,
//   namespace: "test",
// });

// Upsert documents into a namespace called "test" -- with id
const pineconeStore = new PineconeStore(new OpenAIEmbeddings(), {
  pineconeIndex,
  namespace: "test",
});

const ids = docs.map((doc) => doc.metadata.id);

// try {
//   console.log({ ids });
//   await pineconeStore.addDocuments(docs, ids);
//   console.log("uploaded to test!");
// } catch (error: unknown) {
//   console.log({ error, type: typeof error });
// }

const MAX_RETRIES = 3;

const addDocumentsWithRetry = async (
  docs: any,
  ids: any,
  retries = MAX_RETRIES
): Promise<void> => {
  while (retries > 0) {
    try {
      console.log({ ids });
      await pineconeStore.addDocuments(docs, ids);
      console.log("uploaded to test!");
      return; // Successfully uploaded, so return and exit the loop
    } catch (error: unknown) {
      console.log({ error, type: typeof error });
      retries--; // Decrement the retry counter

      if (retries === 0) {
        // If no retries left, throw the error
        throw new Error(
          `Failed to upload documents after ${MAX_RETRIES} attempts: error>> ${JSON.stringify(
            error
          )}`
        );
      }
      console.log(
        `Retrying... (${MAX_RETRIES - retries} of ${MAX_RETRIES}) 😬`
      );
    }
  }
};

try {
  await addDocumentsWithRetry(docs, ids);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Error uploading documents:", error.message);
  } else {
    console.error(JSON.stringify(error));
  }
}
