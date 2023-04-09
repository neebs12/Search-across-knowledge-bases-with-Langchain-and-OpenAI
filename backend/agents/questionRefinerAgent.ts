import { CallbackManager, ConsoleCallbackHandler } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const questionRefinerAgent = async (
  conversationHistory: Record<string, { question: string; answer: string }[]>,
  question: string
) => {
  /*
  This bot takes in a somewhat long conversation history and a question and returns a single refined question.
  */
};
