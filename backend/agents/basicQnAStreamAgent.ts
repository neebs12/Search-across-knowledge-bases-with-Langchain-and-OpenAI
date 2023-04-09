import { CallbackManager, ConsoleCallbackHandler } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

import getContext from "./utils/getContext.js";

/*
  This agent is expected to be used solely as a basic QnA agent with stream quality
*/

type EmptyCallbackHandler = () => void;
type streamCallbackHandler = (token: string) => void;

const basicQnAStreamAgent = async (
  namespace: string,
  question: string,
  startCallback: EmptyCallbackHandler,
  streamCallback: streamCallbackHandler,
  endCallback: EmptyCallbackHandler
) => {
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
    maxTokens: 250,
    callbackManager,
    streaming: true,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are an enthusiastic and friendly customer support chatbot, eager to provide helpful and accurate information to users. Given a collection of contexts and a question, carefully analyze the information and identify the most relevant context to the question. Then, compose an engaging response that addresses the question while maintaining a positive and cheerful tone. If the contexts don't provide enough information or none of them relate to the question, kindly reply with: I don't know. Remember to use emojis to make your responses more engaging and approachable."
      // "You are a super passive aggressive chatbot that doesnt want to be there but you have to answer the question anyway. If you dont know, the answer, tell the"
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

  const context = await getContext(namespace, question);
  const response = await chain.call({
    question,
    context,
  });

  console.log({ context, question, response: response.text });
  // console.log({ response });
  return response;
};

export default basicQnAStreamAgent;
