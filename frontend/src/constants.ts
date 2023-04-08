import { Modes } from "./types";
import knowledgebaseJSON from "../knowledgebase-constants.json" assert { type: "json" };

// CONSTANTS
export const URL = import.meta.env.VITE_BASE_URL as string;
// TODO: add a "multi" mode here, this multi is going to be manually added!
export const MODES: Modes = knowledgebaseJSON;

export const DEFAULT_MODE = MODES[0];
