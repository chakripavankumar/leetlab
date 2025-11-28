import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import problemRoutes from "./routes/problem.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import cors from "cors";
import executeCodeRoutes from "./routes/execute.routes.js";
import submissionRoutes from "./routes/submission.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Hello  welcome to leetlab🔥");
});
app.get("/healthcheck", (_, res) => {
  res.send("Hello  welcome to leetlab🧑‍💻");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executeCodeRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is up and runing on  ${process.env.PORT}`);
});
