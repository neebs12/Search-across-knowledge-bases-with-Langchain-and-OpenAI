import * as dotenv from "dotenv";
dotenv.config();
import knowledgebaseJSON from "../../knowledgebase-constants.json" assert { type: "json" };
import { OpenAIEmbeddings } from "langchain/embeddings";
import { HNSWLib } from "langchain/vectorstores";

async function getContext(namespace: string, question: string) {
  try {
    if (!knowledgebaseJSON.map((n) => n.namespace).includes(namespace)) {
      throw new Error(`${namespace} is not a valid namespace!!`);
    }
    const directory = `./data/vectorestore-files/${namespace}`;
    const loadedVectorStore = await HNSWLib.load(
      directory,
      new OpenAIEmbeddings()
    );

    const NUM_RESULTS = 2;
    const result = await loadedVectorStore.similaritySearch(
      question,
      NUM_RESULTS
    );

    // console.log({ result });

    const context = result.map((res) => res.pageContent).join("\n\n###\n\n");

    return context;
  } catch (error) {
    throw new Error(error as string);
  }
}

export default getContext;
