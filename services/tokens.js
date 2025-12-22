import { CosmosClient } from "@azure/cosmos";

export class TokenClient {
  constructor(connectionString) {
    this.client = new CosmosClient({ connectionString });
    this.database = this.client.database("TokenDB");
    this.container = this.database.container("Tokens");
  }

  async #updateToken(token) {
    token.dataId = token.id;
    token.id = token.databaseId;
    await this.container.items.upsert(token);
  }

  async getAllTokens() {
    const { resources } = await this.container.items.readAll().fetchAll();
    return resources.map((r) => ({ ...r, id: r.dataId, databaseId: r.id }));
  }

  async getTokens() {
    const data = await this.getAllTokens();
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

    return freshData;
  }

  async writeTokens(tokens) {
    const tasks = tokens.map(async (token) => {
      token.dataId = token.id;
      delete token.id;
      await this.container.items.upsert(token);
    });

    await Promise.all(tasks);
  }

  async deleteToken(key) {
    const data = await this.getAllTokens();
    let max_version = null;

    data
      .filter(({ id }) => id === key)
      .forEach((t) => {
        if (max_version === null) max_version = t.version;
        else if (t.version > max_version) max_version = t.version;
      });

    const deleted = data.findIndex(
      ({ id, version }) => id === key && version === max_version
    );

    console.log(
      `Attempting to delete token: "${data[deleted].name}" version: ${max_version}`
    );

    data[deleted].deleted = true;

    await this.#updateToken(data[deleted]);
  }
}
