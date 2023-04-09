import express from "express";
// import getContext from "../agents/utils/getContext.js";
// import getResponse from "../agents/utils/getResponse.js";
import basicQnAStreamAgent from "../agents/basicQnAStreamAgent.js";
import selectorAgent from "../agents/selectorAgent.js";
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

  const { question, namespace } = req.query as {
    question: string;
    namespace: string;
  };

  await basicQnAStreamAgent(
    namespace,
    question,
    () => {},
    (string) => {
      // console.log("token", { myToken: string });
      res.write(`data: ${string}\n\n`);
    },
    () => {
      // send indication that the stream has ended
      res.write(`data: ${"[END]"}\n\n`);
    }
  );

  res.on("close", () => {
    console.log("Client disconnected");
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

  const { question } = req.query as {
    question: string;
  };

  console.log("hit the multi-sse endpoint");
  const relevantNamespaceNamePair = await selectorAgent(question);
  res.write(
    `data: [SEARCH]${createSearchMessage(relevantNamespaceNamePair)}\n\n`
  );

  res.write(`data: ${"\nHello world!"}\n\n`);
  res.write(`data: ${"[END]"}\n\n`);
  res.on("close", () => {
    console.log("Client disconnected");
    res.end();
  });
});

export default router;
