import express from "express";
import multer from "multer";
import { CosmosClient } from "@azure/cosmos";
import { config } from "dotenv";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 3000;

if(process.argv.includes("--dev")) {
  config()
}

const client = new CosmosClient({
  connectionString: process.env.COSMOS_CONNECTION_STRING,
});

const database = client.database("TokenDB");
const container = database.container("Tokens");

/// Services

async function getTokens() {
  const { resources } = await container.items.readAll().fetchAll();
  return resources.map((r) => ({ ...r, id: r.dataId, databaseId: r.id }));
}

async function writeTokens(tokens) {
  const tasks = tokens.map(async (token) => {
    token.dataId = token.id;
    delete token.id;
    await container.items.upsert(token);
  });

  await Promise.all(tasks);
}

async function updateToken(token) {
  token.dataId = token.id;
  token.id = token.databaseId;
  await container.items.upsert(token);
}

///

app.use("/", express.static("dist"));
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/files", upload.single("file"), (req, res) => {
  console.log(`Received uploaded file: ${req.file.filename}`);
  delete req.file.buffer;
  res.json({ url: "" });
});

app.get("/api/tokens", async (req, res) => {
  // Get data from database
  const data = await getTokens();

  const freshData = Object.values(Object.groupBy(data, ({ id }) => id))
    .map((history) => {
      let latest = null;
      history.forEach((h) => {
        if (latest === null) {
          latest = h;
        } else if (h.version > latest.version) {
          latest = h;
        }
      });
      return latest;
    })
    .flat()
    .filter((t) => t.deleted != true);

  res.json(freshData);
});

app.post("/api/tokens/", async (req, res) => {
  // Add data to database
  console.log(`Adding new Token: ${req.body.name}`);
  // mockData.push(req.body);
  await writeTokens([req.body])
  res.json({});
});

app.put("/api/tokens", async (req, res) => {
  // Add data to database
  console.log(`Updating token: ${req.body.name}`);
  // mockData.push(req.body);
  await writeTokens([req.body])
  res.json({});
});

app.delete("/api/tokens/:id", async (req, res) => {

  // To be finished

  let max_version = null;

  const data = await getTokens();

  data
    .filter(({ id }) => id === req.params.id)
    .forEach((t) => {
      if (max_version === null) max_version = t.version;
      else if (t.version > max_version) max_version = t.version;
    });

  const deleted = data.findIndex(
    ({ id, version }) => id === req.params.id && version === max_version
  );

  console.log(
    `Attempting to delete token: "${data[deleted].name}" version: ${max_version}`
  );

  // Mark as deleted in database
  data[deleted].deleted = true;

  await updateToken(data[deleted])

  res.json({});
});

app.listen(port, () => {
  console.log(`Token Logging tool live on port ${port}`);
});
