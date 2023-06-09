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
  const systemPrompt = constructSystemPrompt(conversationHistory);
  const chatModel = new ChatOpenAI({
    modelName: process.env.QUESTION_REFINER_AGENT_MODEL_NAME ?? "gpt-3.5-turbo",
    temperature: 0,
    callbackManager,
  });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    HumanMessagePromptTemplate.fromTemplate(
      "Input Question:\n{question} - remember, forward the question if it is irrelevant"
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

  console.log({
    conversationHistoryPrompt,
    latestQuestion: question,
    unfileteredRefinedQuestion: response.text,
  });

  // TODO: Consider thinking about just forwarding the question if the response.text says that the question is irrelevant, this is difficult due to uncertainty, a binary-returning """meta""" agent can be useful here for keeping 3.5 turbo model
  const txt = response.text.toLowerCase();
  if (
    txt.includes(question) ||
    txt.includes("irrelevant") ||
    txt.includes("i don't know") ||
    txt.includes("preserve") ||
    txt.includes("forward") ||
    txt.includes("no need to refine")
  ) {
    // it would seem here that the agent simply forwarded the question
    console.log("Question is irrelevant, forwarding question");
    return question;
  } else {
    return response.text;
  }
};

export default questionRefinerAgent;

const constructSystemPrompt = (
  conversationHistory: { question: string; answer: string }[]
) => {
  return `As a highly skilled AI, your task is to refine the input question considering the conversation history. Follow these steps:

1. Analyze the conversation history, identifying relevant information while ignoring irrelevant parts.
2. If all conversation history is irrelevant, just preserve the current question.
3. Otherwise, craft a concise and well-structured question that incorporates relevant context from the conversation history.

If you can create a more accurate meaningful question, return:
- the new question

If the question is irrelevant or you dont know, preserve the question by returning:
- the current question

Conversation History:
${constructConversationHistoryPrompt(conversationHistory)}
`;
};

const constructConversationHistoryPrompt = (
  conversationHistory: { question: string; answer: string }[]
) => {
  return conversationHistory
    .map((obj) => `Human: ${obj.question}\nAssistant: ${obj.answer}`)
    .join("\n");
};
