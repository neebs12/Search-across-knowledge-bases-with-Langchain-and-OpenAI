import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

interface FileNameTextPair {
  index: string;
  fileName: string;
  fileContent: string;
}

async function extractTextFromFolder(
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
        fileContent: fileContent
          .replace(/\r?\n|\r|\s+/g, " ")
          .replace('"', "'"),
      });
    });

    return fileNameTextPairs;
  } catch (err) {
    console.error("Could not list the folder.", err);
    process.exit(1);
  }
}

async function writeToFile(
  name: string,
  fileNameTextPairs: FileNameTextPair[]
) {
  fs.writeFileSync(`./data/csv-files/${name}.csv`, "", "utf-8");

  // write in to a csv file
  const writer = createObjectCsvWriter({
    path: `./data/csv-files/${name}.csv`,
    header: Object.keys(fileNameTextPairs[0]).map((key) => {
      return { id: key, title: key };
    }),
  });

  await writer.writeRecords(fileNameTextPairs);

  console.log("The CSV file was written successfully");
}

async function textFilesToCSV(name: string) {
  const fileNameTextPairs = await extractTextFromFolder(name);
  await writeToFile(name, fileNameTextPairs);
}

export default textFilesToCSV;

// async(async () => {
//   const fileNameTextPairs = await extractTextFromFolder(folder);
//   await writeToFile(fileNameTextPairs);
// })();
