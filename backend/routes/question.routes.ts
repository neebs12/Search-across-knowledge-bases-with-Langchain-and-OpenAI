import express from "express";
import basicQnAStreamAgent from "../agents/basicQnAStreamAgent.js";
import selectorAgent from "../agents/selectorAgent.js";
import summarizerAgent from "../agents/summarizerAgent.js";
import aggregatorStreamAgent from "../agents/aggregatorStreamAgent.js";
import questionRefinerAgent from "../agents/questionRefinerAgent.js";

import {
  readCache,
  readCacheById,
  appendToCache,
} from "./utils/cacheInterface.js";
import createSearchMessage from "./utils/createSearchMessage.js";

const router = express.Router();

router.get("/sse", async (req, res) => {
  // Set headers for SSE
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");

  // Send headers to establish SSE connection
  res.flushHeaders();

  if (!req.query.question || req.query.question === "") {
    res.end();
    return;
  }

  const { question, namespace, id } = req.query as {
    question: string;
    namespace: string;
    id: string;
  };

  const cache = readCache();
  const conversationHistory = readCacheById(cache, id);
  let refinedQuestion = question;
  if (conversationHistory.length) {
    refinedQuestion = await questionRefinerAgent(conversationHistory, question);
  }

  console.log({ actualQuestion: question, refinedQuestion });
  const response = await basicQnAStreamAgent(
    namespace,
    refinedQuestion,
    () => {
      res.write(`data: ${"[RESPONSE]"}\n\n`);
    },
    (string) => {
      res.write(`data: ${string}\n\n`);
    },
    () => {
      // send indication that the stream has ended
      res.write(`data: ${"[END]"}\n\n`);
    }
  );

  res.on("close", () => {
    console.log("Client disconnected");
    appendToCache(cache, id, question, response.text);
    res.end();
  });
});

router.get("/multi-sse", async (req, res) => {
  // Set headers for SSE
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");

  // Send headers to establish SSE connection
  res.flushHeaders();

  const { question, id } = req.query as {
    question: string;
    id: string;
  };
  const cache = readCache();
  const conversationHistory = readCacheById(cache, id);
  let refinedQuestion = question;
  if (conversationHistory.length) {
    console.log("refining question");
    refinedQuestion = await questionRefinerAgent(conversationHistory, question);
  }

  // console.log("hit the multi-sse endpoint");
  const relevantNamespaceNamePair = await selectorAgent(refinedQuestion);
  res.write(
    `data: [SYSTEM]${createSearchMessage(relevantNamespaceNamePair)}\n\n`
  );
  const summaries = await Promise.all(
    relevantNamespaceNamePair.map((obj) => {
      return summarizerAgent(obj.namespace, refinedQuestion);
    })
  );

  // console.log({ summaries });
  console.log({ actualQuestion: question, refinedQuestion });
  const response = await aggregatorStreamAgent(
    refinedQuestion,
    summaries,
    () => {
      res.write(`data: ${"[RESPONSE]"}\n\n`);
    },
    (string) => {
      // console.log(`token: ${string}`);
      res.write(`data: ${string}\n\n`);
    },
    () => {
      // send indication that the stream has ended
      res.write(`data: ${"[END]"}\n\n`);
    }
  );

  // res.write(`data: ${"\nHello world!"}\n\n`);
  res.write(`data: ${"[END]"}\n\n`);
  res.on("close", () => {
    console.log("Client disconnected");
    appendToCache(cache, id, question, response.text);
    res.end();
  });
});

export default router;
