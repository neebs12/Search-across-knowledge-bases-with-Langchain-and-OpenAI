import { DirectoryLoader, TextLoader } from "langchain/document_loaders";
import { TokenTextSplitter } from "langchain/text_splitter";
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

const ENCODING = "cl100k_base";
const splitter = new TokenTextSplitter({
  encodingName: ENCODING,
  chunkSize: 500,
  chunkOverlap: 50,
});

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
      .replace('"', "'")
      .replace(/\s+/g, " ")
      .trim();
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
  const root = "./data";
  const getPrePath = root + "/text-files";
  // Read the contents of the directory
  const contents = fs.readdirSync(getPrePath);

  // Filter out the files that are not directories
  const namespaces = contents.filter((file) =>
    fs.statSync(getPrePath + "/" + file).isDirectory()
  );

  // write to a json file... write two types. unchunked(raw) and chunked
  const unChunkedWritePromises = namespaces.map(async (namespace) => {
    const getFromPath = root + "/text-files" + `/${namespace}`;
    const newDocumentArray = await loadNewDocumentArray(getFromPath);

    // unchucked write (raw)
    // const writeToPath = root + "/json-files" + `/${namespace}`;
    writeToJSONToFile(
      root + "/json-files",
      namespace + "-raw",
      newDocumentArray
    );
  });

  const chunkedWritePromises = namespaces.map(async (namespace) => {
    const getFromPath = root + "/text-files" + `/${namespace}`;
    const newDocumentArray = await loadNewDocumentArray(getFromPath);

    // chunked write
    const chunkedPromises = newDocumentArray.map(async (document) => {
      const { pageContent, metadata } = document;
      const pageContentChunks = await splitter.splitText(pageContent);
      // return an array of documents based on the new split page content
      return pageContentChunks.map((pageContentChunk) => {
        return {
          pageContent: pageContentChunk.trim(),
          metadata,
        };
      });
    });

    // flatten
    const chunkedDocument = (await Promise.all(chunkedPromises)).flat();
    // .filter((document) => document.pageContent.length > 750);

    writeToJSONToFile(root + "/json-files", namespace, chunkedDocument);
  });

  await Promise.allSettled(unChunkedWritePromises);
  await Promise.allSettled(chunkedWritePromises);
};

await loadAndWriteDocumentToJSON();
