import express from "express";
const app = express();
const port = 3000;

app.use("/", express.static("dist"));
app.use(express.json());

const mockData = [
  {
    id: crypto.randomUUID(),
    author: "Surya",
    course: "Computer Science",
    name: "Algorithms",
    associatedTokens: ["Data structures", "Analysis", "Formal proof"],
    version: 1,
    attachments: [""],
    deleted: false,
  },
  {
    id: crypto.randomUUID(),
    author: "Surya",
    course: "Machine Learning",
    name: "Neural Networks",
    associatedTokens: ["Analysis", "Formal proof", "Coding"],
    version: 1,
    attachments: [""],
    deleted: false,
  },
  {
    id: crypto.randomUUID(),
    author: "Surya",
    course: "Network Security",
    name: "Encryption",
    associatedTokens: ["Coding", "Networks", "Formal proof"],
    version: 1,
    attachments: [""],
    deleted: false,
  },
];

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/tokens", (req, res) => {
  // Get data from database
  const data = mockData;

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

app.post("/api/tokens/", (req, res) => {
  // Add data to database
  console.log(`Adding new Token: ${req.body.name}`);
  mockData.push(req.body);
  res.sendStatus(200);
});

app.put("/api/tokens", (req, res) => {
  // Add data to database
  console.log(`Updating token: ${req.body.name}`);
  mockData.push(req.body);
  res.sendStatus(200);
});

app.delete("/api/tokens/:id", (req, res) => {
  let max_version = null;

  mockData
    .filter(({ id }) => id === req.params.id)
    .forEach((t) => {
      if (max_version === null) max_version = t.version;
      else if (t.version > max_version) max_version = t.version;
    });

  const deleted = mockData.findIndex(
    ({ id, version }) => id === req.params.id && version === max_version
  );

  console.log(
    `Attempting to delete token ${req.params.id} version: ${max_version}`
  );

  // Mark as deleted in database
  mockData[deleted].deleted = true;
});

app.listen(port, () => {
  console.log(`Token Logging tool live on port ${port}`);
});
