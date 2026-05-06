import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateResumeController } from "./controllers/resume";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate-resume", generateResumeController);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
