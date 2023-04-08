import express from "express";
import getContext from "../utils/getContext.js";
import getResponse from "../utils/getResponse.js";
import getStreamResponse from "../utils/getResponseStream.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { question, namespace } = req.body as {
    question: string;
    namespace: string;
  };

  const context = await getContext(namespace, question);
  const response = await getResponse(question, context);

  res.send({ context, response });
});

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
  const context = await getContext(namespace, question);
  await getStreamResponse(
    question,
    context,
    () => {
      // no `\n` in context allowed, otherwise is stream info cutoff
      const joinedContext = context.replace(/\n/g, "");
      console.log({ joinedContext });
      res.write(`data: ${"[CONTEXT]: " + joinedContext}\n\n`);
    },
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

export default router;
