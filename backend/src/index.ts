import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/routes";

dotenv.config();

const app = express();
const port = "3000";

app.use(cors());
app.use("/api", router);

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});