import { PoolClient, QueryResult } from "pg";
import { IQueryExecutor } from "../QueryExecutor";
import { PostgresDriver } from "./PostgresDriver";

export class PostgresQueryExecutor implements IQueryExecutor {
  private connection?: PoolClient;
  private connectionPromise?: Promise<PoolClient>;

  constructor(public readonly driver: PostgresDriver) {}

  public async connect(): Promise<PoolClient> {
    if (this.connection) {
      return this.connection;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.driver.getConnection();
    return this.connectionPromise;
  }

  public async execute(query: string): Promise<QueryResult<any>> {
    const connection = await this.connect();
    return connection.query(query);
  }

  public release(): Promise<void> {
    if (this.connection) {
      this.connection.release();
    }

    return Promise.resolve();
  }
}
