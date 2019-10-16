import { Pool, PoolClient } from "pg";
import { Connection } from "../../connection/Connection";
import { BaseQueryBuilder } from "../../query-builder/BaseQueryBuilder";
import { IDriver } from "../Driver";
import { IPostgresOptions } from "./PostgresOptions";
import { PostgresQueryExecutor } from "./PostgresQueryExecutor";

export class PostgresDriver implements IDriver {
  public readonly options: IPostgresOptions;

  protected pool?: Pool;

  constructor(public readonly connection: Connection) {
    this.options = connection.options;
  }

  public async connect(): Promise<void> {
    this.pool = new Pool(this.options);
  }

  public createQueryExecutor(): PostgresQueryExecutor {
    return new PostgresQueryExecutor(this);
  }

  public getConnection(): Promise<PoolClient> {
    return this.pool!.connect();
  }

  public getQuery(queryBuilder: BaseQueryBuilder<any>): string {
    switch (queryBuilder.expression.type) {
      case "select":
        return `SELECT ${queryBuilder.expression
          .select!.properties!.map(
            property =>
              `"${queryBuilder.expression.main!.alias}"."${
                queryBuilder.expression.main!.metadata.getPropertyMetadata(property)!.name
              }" AS "${property}"`,
          )
          .join(", ")} FROM "${queryBuilder.expression.main!.metadata.name}" AS "${
          queryBuilder.expression.main!.alias
        }" ${
          queryBuilder.expression.where
            ? "WHERE " +
              Object.entries(queryBuilder.expression.where)
                .map(([key, value]) => {
                  return `${key} = ${value}`;
                })
                .join(" AND")
            : ""
        } ${queryBuilder.expression.select!.mode === "one" ? "LIMIT 1" : ""}`;
      default:
        throw new Error();
    }
  }
}
