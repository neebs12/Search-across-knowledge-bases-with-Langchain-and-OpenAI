import { OpenAIEmbeddings } from "langchain/embeddings";
import { HNSWLib } from "langchain/vectorstores";

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

export default getContext;
