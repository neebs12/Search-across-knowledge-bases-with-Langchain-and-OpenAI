import express from "express";
import { CallbackManager, ConsoleCallbackHandler } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

type EmptyCallbackHandler = () => void;
type streamCallbackHandler = (token: string) => void;

// get responses from the chatbot
async function getStreamResponse(
  question: string,
  context: string,
  startCallback: EmptyCallbackHandler,
  streamCallback: streamCallbackHandler,
  endCallback: EmptyCallbackHandler
) {
  const callbackManager = CallbackManager.fromHandlers({
    async handleLLMStart(llm, _prompts: string[]) {
      console.log("handle LLM start", { llm });
      startCallback();
    },
    async handleLLMEnd(output) {
      console.log("handle LLM end", { output });
      // execute end callback
      endCallback();
    },
    async handleLLMNewToken(token) {
      streamCallback(token);
    },
  });

  callbackManager.addHandler(new ConsoleCallbackHandler());

  const chatModel = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    // modelName: "gpt-4",
    temperature: 0.5,
    maxTokens: 100,
    callbackManager,
    streaming: true,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a super helpful and happy customer chat bot from New Zealand. Use heaps of emojis and answer questions only according to the context provided, otherwise say: I don't know."
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "Context: {context}\n\n###\n\nQuestion: {question}"
    ),
  ]);

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm: chatModel,
    callbackManager,
  });

  const response = await chain.call({
    question,
    context,
  });

  return response;
}

export default getStreamResponse;
