import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import getContext from "./utils/getContext.js";
import getResponse from "./utils/getResponse.js";
import getStreamResponse from "./utils/getResponseStream.js";

const app = express();

app.use(express.static("build/public"));

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  console.log(req.query);
  console.log(req.body);
  next();
});

app.get("/health-check", (req, res) => {
  res.send("Hello World!");
});

app.post("/question", async (req, res) => {
  // console.log({ question: req.body.question, namespace: req.body.namespace });
  const { question, namespace } = req.body as {
    question: string;
    namespace: string;
  };

  const context = await getContext(namespace, question);
  const response = await getResponse(question, context);

  res.send({ context, response });
});

app.get("/health-check-sse", async (req, res) => {
  // Set headers for SSE
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");

  // Send headers to establish SSE connection
  res.flushHeaders();

  // Send a ping approx every 1 seconds, kill after 3
  let numCalls = 0;
  const timer = setInterval(() => {
    numCalls += 1;
    if (numCalls > 3) {
      // send indication that the stream has ended
      res.write(`data: ${"[END]"}\n\n`);
      clearInterval(timer);
    } else {
      res.write(`data: ${"ping" + numCalls.toString()}\n\n`);
    }
  }, 500);

  res.on("close", () => {
    console.log("Client disconnected");
    res.end();
  });
});

app.get("/question-sse", async (req, res) => {
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
  const response = await getStreamResponse(
    question,
    context,
    () => {
      // send indication that the stream has started

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

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
