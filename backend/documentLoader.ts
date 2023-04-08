import { DirectoryLoader, TextLoader } from "langchain/document_loaders";
import fs from "fs";
import path from "path";

type NewDocumentType = {
  pageContent: string;
  metadata: {
    namespace: string;
    filename: string;
    link: string;
  };
};

const loadNewDocumentArray = async (
  localpath: string
): Promise<NewDocumentType[]> => {
  const loader = new DirectoryLoader(localpath, {
    ".txt": (path) => new TextLoader(path),
  });
  const docs = await loader.load();

  const removeFileExtension = (filename: string): string => {
    const parsedPath = path.parse(filename);
    parsedPath.ext = "";
    parsedPath.base = parsedPath.name;
    return path.format(parsedPath);
  };

  const newDocumentArray = docs.map((document): NewDocumentType => {
    const metadata = document.metadata;
    const pageContent = document.pageContent
      .replace(/\r?\n|\r|\s+/g, " ")
      .replace('"', "'");
    const source = metadata.source.split("/") as string[];
    const namespace = source[source.length - 2];
    const filename = source[source.length - 1];
    // replace all "_" with "/" to get filename
    const link = "https://" + removeFileExtension(filename.replace(/\_/g, "/"));
    const newMetadata = {
      namespace,
      filename,
      link,
    };
    return {
      pageContent,
      metadata: newMetadata,
    };
  });

  console.log({
    newDocumentArrayMetadata: newDocumentArray.map((doc) => doc.metadata),
  });
  return newDocumentArray;
};

// write the newDocumentArray to a file in the "data/json-files" folder
const writeToJSONToFile = (
  path: string,
  name: string,
  data: NewDocumentType[]
) => {
  try {
    fs.writeFileSync(
      `${path}/${name}.json`,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    console.log("file was written successfully to " + `${path}/${name}.json`);
  } catch (e) {
    console.log("failed to write file to " + `${path}/${name}.json`);
  }
};

const loadAndWriteDocumentToJSON = async () => {
  const getFromPath = "./data/text-files/test-data";
  const namespace = getFromPath.split("/").slice(-1)[0];
  // console.log({ fullPath });
  const newDocumentArray = await loadNewDocumentArray(getFromPath);
  const writeToPath = `./data/json-files/${namespace}`;
  const prePath = writeToPath.split("/").slice(0, -1).join("/");
  writeToJSONToFile(prePath, namespace, newDocumentArray);
};

loadAndWriteDocumentToJSON();
