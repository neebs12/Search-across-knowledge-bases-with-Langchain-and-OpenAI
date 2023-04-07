import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

// get responses from the chatbot
async function getResponse(question: string, context: string) {
  const chatModel = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    // modelName: "gpt-4",
    temperature: 0.5,
    maxTokens: 100,
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
  });

  const response = await chain.call({
    question,
    context,
  });

  return response;
}

export default getResponse;
