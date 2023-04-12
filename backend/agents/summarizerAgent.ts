import { CallbackManager, ConsoleCallbackHandler } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

import getContext from "./utils/getContext.js";

const summarizerAgent = async (namespace: string, question: string) => {
  const callbackManager = CallbackManager.fromHandlers({});
  callbackManager.addHandler(new ConsoleCallbackHandler());
  const chatModel = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    // modelName: "gpt-4",
    temperature: 0.5,
    maxTokens: 500,
    callbackManager,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "As an AI, your primary objective is to deliver comprehensive and well-informed answers to the question posed, ensuring that your responses are rooted in the context provided. When responding, carefully analyze both the context and the question, making certain that your answers are not only relevant but also in-depth and helpful. This will allow you to offer the best possible assistance to the user. However, if the context is not related to the question respond with: I don't know."
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "Context: {context}\n\n###\n\nQuestion: {question} - say I dont know if the context is not related to the question."
    ),
  ]);

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm: chatModel,
    callbackManager,
  });

  const { context, sources } = await getContext(namespace, question);
  const response = await chain.call({
    context,
    question,
  });

  return { response: response.text, sources };
};

export default summarizerAgent;
