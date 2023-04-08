import * as dotenv from "dotenv";
dotenv.config();
import { loadTextAndWriteToJSON } from "./loadTextAndWriteJson.js";
import { loadJSONData } from "./loadJson.js";
import { initPineconeIndex } from "./pineconeIndexInit.js";
import { uploadAllDocumentsToPinecone } from "./uploadAllDocumentsToPinecone.js";
import { uploadAllDocumentsLocally } from "./uploadAllDocumentsLocally.js";

const ingest = async () => {
  // load text files and write to json files
  console.log("loading text files and writing to json files");
  await loadTextAndWriteToJSON();

  // load json files
  console.log("loading json files");
  const nestedDoc = await loadJSONData();

  // NOTE: this is a working pinecone ingestion workflow, but this current version appears VERY unstable with errors. Have commented out for now
  // initialize pinecone index
  // console.log("initializing pinecone index");
  // const pineconeIndex = await initPineconeIndex();

  // upload json files to pinecone
  // note: only make INFREQUEST calls, otherwise the server tends to throw unextpected errors
  // console.log("uploading json files to pinecone");
  // await uploadAllDocumentsToPinecone(nestedDoc, pineconeIndex);

  // uploading locally
  console.log("vectorizing locally...");
  await uploadAllDocumentsLocally(nestedDoc);
  console.log("local vectorization finished!");
};

await ingest();
