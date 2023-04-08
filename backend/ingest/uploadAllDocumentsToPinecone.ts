import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { Document } from "langchain/document";

import type { NewDocumentTypeChunked } from "./loadTextAndWriteJson.js";
import type { VectorOperationsApi } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/index.js";

const uploadDocumentsToPinecone = async (
  documents: Document[],
  ids: string[],
  pineconeStore: PineconeStore,
  MAX_RETRIES: number
) => {
  let retries = MAX_RETRIES;
  while (retries > 0) {
    try {
      retries--; // Decrement the retry counter
      await pineconeStore.addDocuments(documents, ids);
      return;
    } catch (error: unknown) {
      // wait for 100ms to avoid rate limit
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (retries === 0) {
        // If no retries left, throw the error
        throw new Error(
          `Failed to upload documents after ${MAX_RETRIES} attempts.`
        );
      }
      console.log(`Retrying... (${MAX_RETRIES - retries} of ${MAX_RETRIES})😬`);
    }
  }
};

const uploadAllDocumentsToPinecone = async (
  nestedDoc: NewDocumentTypeChunked[][],
  pineconeIndex: VectorOperationsApi
) => {
  try {
    for (const docArry of nestedDoc) {
      const currentNamespace = docArry[0].metadata.namespace;
      const documents = docArry.map((doc) => new Document(doc));
      const ids = docArry.map((doc) => doc.metadata.id);
      const MAX_RETRIES = 3;
      const pineconeStore = new PineconeStore(new OpenAIEmbeddings(), {
        pineconeIndex,
        namespace: currentNamespace,
      });

      console.log(`Uploading ${currentNamespace} to Pinecone 🤞`);
      // if this keeps erroring out, refactor to batch uploads to like 10 vectors :(
      await uploadDocumentsToPinecone(
        documents,
        ids,
        pineconeStore,
        MAX_RETRIES
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log(`${currentNamespace} has been uploaded to Pinecone! 🥳`);
    }
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export { uploadAllDocumentsToPinecone };
