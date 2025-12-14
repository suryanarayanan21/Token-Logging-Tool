import { CosmosClient } from "@azure/cosmos";

console.log(process.env.PORT)

const client = new CosmosClient({
  connectionString: process.env.COSMOS_CONNECTION_STRING,
});

const database = client.database("TokenDB");
const container = database.container("Tokens");

const mockData = [
  {
    dataId: crypto.randomUUID(),
    author: "Surya",
    course: "Computer Science",
    name: "Algorithms",
    associatedTokens: ["Data structures", "Analysis", "Formal proof"],
    version: 1,
    attachments: [],
    deleted: false,
  },
  {
    dataId: crypto.randomUUID(),
    author: "Surya",
    course: "Machine Learning",
    name: "Neural Networks",
    associatedTokens: ["Analysis", "Formal proof", "Coding"],
    version: 1,
    attachments: [],
    deleted: false,
  },
  {
    dataId: crypto.randomUUID(),
    author: "Surya",
    course: "Network Security",
    name: "Encryption",
    associatedTokens: ["Coding", "Networks", "Formal proof"],
    version: 1,
    attachments: [],
    deleted: false,
  },
];

let tasks = mockData.map(async t => {
  return await container.items.upsert(t);
})

await Promise.all(tasks);
