import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import {
  loggerMiddleware,
  notFoundMiddleware,
  errorMiddleware,
} from "./middleware/index.js";
import healthCheckRoutes from "./routes/healthCheck.routes.js";
import questionRoutes from "./routes/question.routes.js";

const app = express();

app.use(express.static("build/public"));

app.use(cors());
app.use(express.json());

app.use(loggerMiddleware);

app.use("/health", healthCheckRoutes);
app.use("/question", questionRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
