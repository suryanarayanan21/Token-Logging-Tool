import express from "express";
import multer from "multer";
import { CosmosClient } from "@azure/cosmos";
import { config } from "dotenv";
import { FileClient } from "./services/files.js";
import { TokenClient } from "./services/tokens.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 3000;

if (process.argv.includes("--dev")) {
  config();
}

const files = new FileClient(process.env.BLOB_CONNECTION_STRING);
const tokens = new TokenClient(process.env.COSMOS_CONNECTION_STRING);

app.use("/", express.static("dist"));
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/files", async (req, res) => {
  const { name, url, mimetype } = req.query;
  const fileStream = await files.getFile(url);

  res.setHeader("Content-Type", mimetype);
  res.setHeader("Content-Disposition", `attachment; filename="${name}"`);

  await fileStream.pipe(res);
});

app.post("/api/files", upload.single("file"), (req, res) => {
  console.log(`Received uploaded file: ${req.file.filename}`);
  delete req.file.buffer;
  res.json({ url: "" });
});

app.get("/api/tokens", async (req, res) => {
  const data = await tokens.getTokens();
  res.json(data);
});

app.post("/api/tokens/", async (req, res) => {
  await tokens.writeTokens([req.body]);
  res.json({});
});

app.put("/api/tokens", async (req, res) => {
  await tokens.writeTokens([req.body]);
  res.json({});
});

app.delete("/api/tokens/:id", async (req, res) => {
  await tokens.deleteToken(req.params.id);
  res.json({});
});

app.listen(port, () => {
  console.log(`Token Logging tool live on port ${port}`);
});
