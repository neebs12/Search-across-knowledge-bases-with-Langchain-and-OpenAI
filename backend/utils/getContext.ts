import { OpenAIEmbeddings } from "langchain/embeddings";
import { HNSWLib } from "langchain/vectorstores";

import { initPineconeIndex } from "../ingest/pineconeIndexInit.js";
import { PineconeStore } from "langchain/vectorstores";

async function getContext(name: string, question: string) {
  const directory = `./data/vectorstores/${name}`;
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings()
  );

  const NUM_RESULTS = 2;
  const result = await loadedVectorStore.similaritySearch(
    question,
    NUM_RESULTS
  );

  const context = result.map((res) => res.pageContent).join("\n\n###\n\n");

  return context;
}

async function getContextFromPinecone(namespace: string, question: string) {
  // already gets the relevant pinecone index for us!!
  const myPineconeIndex = await initPineconeIndex();
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex: myPineconeIndex, namespace } // restricted search to namespace
  );

  const NUM_RESULTS = 2;
  const result = await vectorStore.similaritySearch(question, NUM_RESULTS);
  console.log({ result });
}

await getContextFromPinecone("test", "what is the meaning of life");

export default getContext;
