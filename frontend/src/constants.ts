import { Modes } from "./types";
import knowledgebaseJSON from "../knowledgebase-constants.json" assert { type: "json" };

// CONSTANTS
export const URL = import.meta.env.VITE_BASE_URL as string;

export const MULTI_MODE_NAME = "Multi Resources";
export const MULTI_MODE_NAMESPACE = "multi-resource";

// TODO: add a "multi" mode here, this multi is going to be manually added!
export const MODES: Modes = [
  ...knowledgebaseJSON,
  {
    name: MULTI_MODE_NAME,
    namespace: MULTI_MODE_NAMESPACE,
    description:
      "This is a multi resource mode, it will use multiple resources to answer your questions.",
    image:
      "https://cdn.pixabay.com/photo/2014/05/20/21/20/bird-349026_960_720.jpg",
  },
];
export const DEFAULT_MODE = MODES[0];
