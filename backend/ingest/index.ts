import { loadTextAndWriteToJSON } from "./loadTextAndWriteJson.js";
import { loadJSONData } from "./loadJson.js";
import { initPineconeIndex } from "./pineconeIndexInit.js";
import { uploadAllDocumentsToPinecone } from "./uploadAllDocumentsToPinecone.js";

const ingest = async () => {
  // load text files and write to json files
  console.log("loading text files and writing to json files");
  await loadTextAndWriteToJSON();

  // load json files
  console.log("loading json files");
  const nestedDoc = await loadJSONData();

  // initialize pinecone index
  console.log("initializing pinecone index");
  const pineconeIndex = await initPineconeIndex();

  // upload json files to pinecone
  // note: only make INFREQUEST calls, otherwise the server tends to throw unextpected errors
  console.log("uploading json files to pinecone");
  await uploadAllDocumentsToPinecone(nestedDoc, pineconeIndex);
};

await ingest();
