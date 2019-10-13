import { Pool } from "pg";
import { Connection } from "../../connection/Connection";
import { IDriver } from "../Driver";
import { IPostgresOptions } from "./PostgresOptions";
import { PostgresQueryExecutor } from "./PostgresQueryExecutor";

export class PostgresDriver implements IDriver {
  public readonly options: IPostgresOptions;

  protected pool?: Pool;

  constructor(public readonly connection: Connection) {
    this.options = connection.options;
  }

  public async connect() {
    this.pool = new Pool(this.options);
  }

  public createQueryExecutor() {
    return new PostgresQueryExecutor(this);
  }

  public getConnection() {
    return this.pool!.connect();
  }
}
