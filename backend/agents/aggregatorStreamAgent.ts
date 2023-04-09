import { CallbackManager, ConsoleCallbackHandler } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const aggregatorStreamAgent = async (
  question: string,
  responseList: string[],
  startCallback: () => void,
  streamCallback: (token: string) => void,
  endCallback: () => void
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
    maxTokens: 500,
    streaming: true,
    callbackManager,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are an enthusiastic and friendly customer support chatbot, eager to provide helpful and accurate information to users. Given a collection of contexts and a question, carefully analyze the information and identify the most relevant context to the question. Then, compose an engaging response that addresses the question while maintaining a positive and cheerful tone. If the contexts don't provide enough information or none of them relate to the question, kindly reply with: I don't know. Remember to use emojis to make your responses more engaging and approachable."
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

  const context = constructContextPrompt(responseList);

  // console.log({ context });

  const response = await chain.call({
    context,
    question,
  });

  return response.text as string;
};

export default aggregatorStreamAgent;

const constructContextPrompt = (responseList: string[]) => {
  const contextList = responseList.map((response) =>
    response.replace(/\s+/g, " ")
  );

  return `\n${contextList
    .map((context, ind) => `- ${ind + 1}. ${context}`)
    .join("\n")}`;
};
