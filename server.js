import express from "express";
import multer from "multer";
import { FileClient } from "./services/files.js";
import { TokenClient } from "./services/tokens.js";
import { Environment } from "./services/environment.js";

const environment = new Environment();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = environment.port;
const files = new FileClient(environment.blob_connection_string);
const tokens = new TokenClient(environment.cosmos_connection_string);

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
