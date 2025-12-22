import { config } from "dotenv";

export class Environment {
  constructor() {
    if (process.argv.includes("--dev")) {
      config();
    }
  }

  get cosmos_connection_string() {
    return process.env.COSMOS_CONNECTION_STRING;
  }

  get blob_connection_string() {
    return process.env.BLOB_CONNECTION_STRING;
  }

  get port() {
    return process.env.PORT;
  }
}
