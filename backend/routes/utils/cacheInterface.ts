import fs from "fs";
// import JSON_CACHE_LOCATION  from "../../context-cache.json" assert {type: "json"}

const JSON_CACHE_LOCATION = "./context-cache.json";

// Read the cache (./context-cache.json)
const readCache = (): Record<
  string,
  { question: string; answer: string }[]
> => {
  try {
    const rawData = fs.readFileSync(JSON_CACHE_LOCATION, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading cache, making a new one", error);
    // non critical cache can just be rebuilt if it fails
    return {};
  }
};

const readCacheById = (
  cache: Record<string, { question: string; answer: string }[]>,
  uuid: string
): { question: string; answer: string }[] => {
  return cache[uuid] ?? [];
};

// Append the question and answer to the cache based on the uuid
const appendToCache = (
  cache: Record<string, { question: string; answer: string }[]>,
  uuid: string,
  question: string,
  answer: string
): void => {
  // creates a new array if the uuid is not in the cache
  if (!cache[uuid]) {
    cache[uuid] = [];
  }

  cache[uuid].push({ question, answer });

  try {
    fs.writeFileSync(
      JSON_CACHE_LOCATION,
      JSON.stringify(cache, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
};

export { readCache, readCacheById, appendToCache };
