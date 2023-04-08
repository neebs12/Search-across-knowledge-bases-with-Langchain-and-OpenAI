// in this version, we will "uploading" to the local file system. Within `/data/vectorstore-files` with each index being their own "namespace"

import type { NewDocumentTypeChunked } from "./ingest.d.ts";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { HNSWLib } from "langchain/vectorstores";

const uploadAllDocumentsLocally = async (
  nestedDoc: NewDocumentTypeChunked[][]
) => {
  try {
    for (const docArry of nestedDoc) {
      const currentNamespace = docArry[0].metadata.namespace;

      const documents = docArry.map((doc) => new Document(doc));
      const ids = docArry.map((doc) => doc.metadata.id);
      const newMetadata = docArry.map((doc, ind) => {
        return { ...doc.metadata, id: ids[ind] };
      });

      // const localStore = new HNSWLib(new OpenAIEmbeddings(), {})
      console.log(
        `Embedding and storing vectors ${currentNamespace} to local file system 🤞`
      );
      const vectorStore = await HNSWLib.fromDocuments(
        documents,
        new OpenAIEmbeddings()
      );
      const directory = `./data/vectorestore-files/${currentNamespace}`;
      // overwrites old store, so idempotent YAY!
      await vectorStore.save(directory);
      console.log(`${currentNamespace} has been uploaded to local! 🥳`);
    }
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export { uploadAllDocumentsLocally };
