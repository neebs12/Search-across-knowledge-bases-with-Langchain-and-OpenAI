import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("health check ok!!!");
  res.send("Hello World!");
});

export default router;
