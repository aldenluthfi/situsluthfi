import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import compression from "compression";
import router from "./routes/routes";

dotenv.config();

const app = express();
const port = "3000";

app.use(cors());
app.use(compression({
    level: 9,
}));
app.use(express.json({ limit: "10mb" }));

app.use("/api", router);

app.get("/", (_req, res) => {
    res.send("Backend is running");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});