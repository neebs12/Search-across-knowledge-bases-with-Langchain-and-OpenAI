import fs from "fs";
import path from "path";
// this file splits a large piece of text in to smaller chunks and stores them back as different pieces of text

import { TokenTextSplitter } from "langchain/text_splitter";

interface FileNameTextPair {
  index: string;
  fileName: string;
  fileContent: string;
}

// async funcion

async function createMultipleTextsFiles(tokenLength: number = 50000) {
  const fileNameTextPairs = await (async function extractTextFromFolder(
    name: string
  ): Promise<FileNameTextPair[]> {
    try {
      const folder = `./data/text-files/${name}`;
      const files = await fs.promises.readdir(folder);

      let fileNameTextPairs: FileNameTextPair[] = [];

      files.forEach((file, index) => {
        const filePath = path.join(folder, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");

        fileNameTextPairs.push({
          // add a unique id for each file
          index: index.toString(),
          fileName: file.replace(/\.|\-/g, " "),
          fileContent: fileContent.replace(/\r?\n|\r|\s+|\t/g, " "),
        });
      });

      return fileNameTextPairs;
    } catch (err) {
      console.error("Could not list the folder.", err);
      process.exit(1);
    }
  })("other");

  console.log(fileNameTextPairs);
  const ENCODING = "cl100k_base";
  const splitter = new TokenTextSplitter({
    encodingName: ENCODING,
    chunkSize: tokenLength,
    chunkOverlap: 100,
  });

  const output = await splitter.splitText(fileNameTextPairs[0].fileContent);
  const promises = output.map((text, index) => {
    const name = "nz-tax-2021";
    return new Promise((resolve, reject) => {
      fs.writeFile(
        `./data/text-files/${name}/${name}-${index}.txt`,
        text,
        "utf-8",
        (err) => (err ? reject(err) : resolve(true))
      );
    });
  });

  await Promise.all(promises);
}

createMultipleTextsFiles();
