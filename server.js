import express from "express";
const app = express();
const port = 3000;

app.use("/", express.static("dist"));
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/tokens", (req, res) => {
  res.json([
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
  ]);
});

app.post("/api/tokens/", (req, res) => {
  console.log(req.body.name);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Token Logging tool live on port ${port}`);
});
