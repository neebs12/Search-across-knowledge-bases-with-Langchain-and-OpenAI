import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("health check ok!!!");
  res.send("Hello World!");
});

router.get("/sse", async (req, res) => {
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

export default router;
