import * as dotenv from "dotenv";
dotenv.config();

import textFilesToCSV from "./utils/textFilesToCSV.js";
import createAndStoreEmbeddings from "./utils/createAndStoreEmbeddings.js";
import getContext from "./utils/getContext.js";
import getResponse from "./utils/getResponse.js";

async function main() {
  const name = "hnry-co-nz-freelancer-resources";
  const question = "What is the best way to get a job as a freelancer?";

  // creates a csv file from the text files, kinda useful if a folder has a collection of .txt files
  // await textFilesToCSV(name);

  // // this makes api calls on the large piece of text! T_T
  // await createAndStoreEmbeddings(name);

  // gets the context for the question
  const context = await getContext(name, question);

  // gets the response from the chatbot
  const response = await getResponse(question, context);

  console.log({ context, response });
}

(async () => {
  await main();
})();
