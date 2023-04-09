import { CallbackManager, ConsoleCallbackHandler } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

/*
  This agent takes in a somewhat long conversation history and a question and returns a single refined question.
*/
const LIMIT_CONVERSATION_HISTORY = 4;

const questionRefinerAgent = async (
  conversationHistory: { question: string; answer: string }[],
  question: string
) => {
  conversationHistory = conversationHistory.slice(
    -1 * LIMIT_CONVERSATION_HISTORY
  );
  // console.log({ conversationHistory });

  const callbackManager = CallbackManager.fromHandlers({});
  callbackManager.addHandler(new ConsoleCallbackHandler());
  const systemPrompt = constructSystemPrompt();
  const chatModel = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    // modelName: "gpt-4",
    temperature: 0,
    callbackManager,
  });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    HumanMessagePromptTemplate.fromTemplate(
      "Conversation History: \n{conversationHistory}\n\n###\n\nInput Question: \n{question}"
    ),
  ]);
  const chain = new LLMChain({
    prompt: chatPrompt,
    llm: chatModel,
    callbackManager,
  });

  const conversationHistoryPrompt =
    constructConversationHistoryPrompt(conversationHistory);

  const response = await chain.call({
    question,
    conversationHistory: conversationHistoryPrompt,
  });

  console.log({ conversationHistoryPrompt, latestQuestion: question });

  // TODO: Consider thinking about just forwarding the question if the response.text says that the question is irrelevant, this is difficult due to uncertainty
  return response.text;
};

export default questionRefinerAgent;

const constructSystemPrompt = () => {
  return `As a highly skilled AI, your task is to refine the input question considering the conversation history. Follow these steps:

1. Analyze the conversation history, identifying relevant information while ignoring irrelevant parts.
2. If all conversation history is irrelevant, just preserve the current question.
3. Otherwise, craft a concise and well-structured question that incorporates relevant context from the conversation history.

Your goal is to create a more more accurate and meaningful question.`;
};

const constructConversationHistoryPrompt = (
  conversationHistory: { question: string; answer: string }[]
) => {
  return conversationHistory
    .map((obj) => `Human: ${obj.question}\nAssistant: ${obj.answer}`)
    .join("\n");
};
