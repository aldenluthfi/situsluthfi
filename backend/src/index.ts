import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.use(cors());

app.get("/api/facts", async (_req, res) => {
  try {
    const response = await fetch("https://thefact.space/random");
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching fact:", error);
    res.status(500).json({ error: "Failed to fetch facts" });
  }
});

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});