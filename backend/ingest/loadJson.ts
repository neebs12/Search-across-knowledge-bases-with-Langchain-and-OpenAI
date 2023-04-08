import { DirectoryLoader, TextLoader } from "langchain/document_loaders";
import type { NewDocumentTypeChunked } from "../types/ingest.js";

const loadJSONData = async () => {
  const localpath = "./data/json-files";

  const loader = new DirectoryLoader(localpath, {
    ".json": (path) => new TextLoader(path),
  });

  // exclude *raw.json files
  const nestedDoc = (await loader.load())
    .filter(({ metadata }) => !metadata.source.includes("raw.json"))
    .map(({ pageContent }) => {
      const documentObject = JSON.parse(
        pageContent
      ) as NewDocumentTypeChunked[];
      return documentObject;
    });

  return nestedDoc;
};

export { loadJSONData };
