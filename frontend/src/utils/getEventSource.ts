import { URL, MODES, DEFAULT_MODE, MULTI_MODE_NAME } from "../constants";

const getEventSource = (modeName: string, question: string, uuid: string) => {
  // gets extension
  let extension = "";
  if (question === "health") {
    extension = "health/sse";
  } else if (modeName === MULTI_MODE_NAME) {
    extension = "question/multi-sse";
  } else {
    extension = "question/sse";
  }

  // gets namespace for url
  const namespace = (MODES.find((m) => m.name === modeName) ?? DEFAULT_MODE)
    .namespace;

  const url = `${URL}/${extension}?id=${uuid}&namespace=${namespace}&question=${question}`;

  return new EventSource(url);
};

export default getEventSource;
