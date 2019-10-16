import { Pool } from "pg";
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

  public async connect() {
    this.pool = new Pool(this.options);
  }

  public createQueryExecutor() {
    return new PostgresQueryExecutor(this);
  }

  public getConnection() {
    return this.pool!.connect();
  }

  public getQuery(queryBuilder: BaseQueryBuilder<any>) {
    switch (queryBuilder.expression.type) {
      case "select":
        return `SELECT ${queryBuilder.expression
          .selects!.map(
            select =>
              `"${queryBuilder.expression.main!.alias}"."${select}" AS "${
                queryBuilder.expression.main!.alias
              }_${select}"`,
          )
          .join(", ")} FROM "${queryBuilder.expression.main!.metadata.name}" AS "${
          queryBuilder.expression.main!.alias
        }"`;
      default:
        throw new Error();
    }
  }
}
