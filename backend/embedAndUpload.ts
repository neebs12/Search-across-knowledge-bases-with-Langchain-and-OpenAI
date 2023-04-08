import { DirectoryLoader, TextLoader } from "langchain/document_loaders";
import * as dotenv from "dotenv";

import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { Document } from "langchain/document";

import { loadAndWriteDocumentToJSON } from "./loadAndWriteDocumentToJSON.js";
import type { NewDocumentType } from "./loadAndWriteDocumentToJSON.js";

dotenv.config();

// check if environment variables are set, nice to have and pleases ts
if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY not set");
} else if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error("PINECONE_ENVIRONMENT not set");
} else if (!process.env.PINECONE_INDEX) {
  throw new Error("PINECONE_INDEX not set");
}

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

const loadJSONData = async () => {
  await loadAndWriteDocumentToJSON();

  const localpath = "./data/json-files";

  const loader = new DirectoryLoader(localpath, {
    ".json": (path) => new TextLoader(path),
  });

  // exclude *raw.json files
  const nestedDoc = (await loader.load())
    .filter(({ metadata }) => !metadata.source.includes("raw.json"))
    .map(({ pageContent }) => {
      const documentObject = JSON.parse(pageContent) as NewDocumentType[];
      return documentObject;
    });

  // const doc = nestedDoc[0][0];
  // console.log({ doc });
  // console.log({ pageContent: doc.pageContent, metadata: doc.metadata });
  return nestedDoc;
};

const embedAndUploadToPinecone = async (nestedDoc: NewDocumentType[][]) => {
  try {
    for (const docArry of nestedDoc) {
      const currentNamespace = docArry[0].metadata.namespace;
      const documents = docArry.map((doc) => new Document(doc));

      await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings(), {
        pineconeIndex,
        namespace: currentNamespace,
      });

      // wait for 100ms to avoid rate limit
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log(`${currentNamespace} has been uploaded to Pinecone!`);
    }
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

await embedAndUploadToPinecone(await loadJSONData());

const uploadAllDocumentsToPinecone = async () => {
  const nestedDoc = await loadJSONData();
  for (const docArry of nestedDoc) {
    const currentNamespace = docArry[0].metadata.namespace;
    const documents = docArry.map((doc) => new Document(doc));

    // await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings(), {
    //   pineconeIndex,
    //   namespace: currentNamespace,
    // });

    // // wait for 100ms to avoid rate limit
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(`${currentNamespace} has been uploaded to Pinecone!`);
  }
};
