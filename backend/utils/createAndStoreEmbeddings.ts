import { OpenAIEmbeddings } from "langchain/embeddings";
import { CSVLoader } from "langchain/document_loaders";
import { TokenTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores";

async function createAndStoreEmbeddings(name: string) {
  // read from csv file
  const csvFolder = `./data/csv-files/${name}.csv`;
  const DATA_COLUMN_NAME = "fileContent";
  const loader = new CSVLoader(csvFolder, DATA_COLUMN_NAME);

  const docs = await loader.load();
  // extract the text, trust that sentences end with a period or other proper punctuation
  const allTexts = docs.map((doc) => doc.pageContent.trim()).join(" ");
  // console.log(allTexts);

  const ENCODING = "cl100k_base";
  const splitter = new TokenTextSplitter({
    encodingName: ENCODING,
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const output = await splitter.splitText(allTexts);
  const vectorStore = await HNSWLib.fromTexts(
    output,
    output.map((_, ind) => {
      // this is the metadata for each document
      return { id: ind };
    }),
    new OpenAIEmbeddings()
  );

  const directory = `./data/vectorstores/${name}`;
  await vectorStore.save(directory);
}

export default createAndStoreEmbeddings;
