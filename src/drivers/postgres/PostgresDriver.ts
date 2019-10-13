import { Client } from "pg";
import { Connection } from "../../connection/Connection";
import { IDriver } from "../Driver";
import { IPostgresOptions } from "./PostgresOptions";

export class PostgresDriver implements IDriver {
  public readonly options: IPostgresOptions;

  constructor(public readonly connection: Connection) {
    this.options = connection.options;
  }

  public async connect(): Promise<void> {
    const client = new Client(this.options);

    await client.connect();
  }
}
