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

  public getQuery(queryBuilder: BaseQueryBuilder<any, any>): string {
    switch (queryBuilder.expression.type) {
      case "select":
        const expression = queryBuilder.expression;
        const main = expression.main;
        const select = expression.select;
        const where = expression.where;
        if (!select) {
          throw new Error();
        }
        const limit = select.mode === "one" ? 1 : undefined;

        const selects = select.selections.map(
          selection => `"${selection.from}"."${selection.select.value}" AS "${selection.select.alias}"`,
        );
        const wheres: string[] = [];

        if (!main) {
          throw new Error();
        }

        if (where) {
          if (where.properties) {
            if (!main) {
              throw new Error();
            }

            wheres.push(
              ...where.properties.map(
                whereItem =>
                  `"${main.metadata.modelName}"."${main.metadata.getPropertyMetadata(whereItem.property)!.name}" = ${
                    whereItem.value
                  }`,
              ),
            );
          }

          if (where.raws) {
            wheres.push(...where.raws.map(whereItem => `${whereItem.expression} = ${whereItem.value}`));
          }
        }

        if (selects.length === 0) {
          throw new Error();
        }

        return `SELECT ${selects.join(", ")} ${main ? `FROM "${main.metadata.name}" AS "${main.alias}"` : ""} ${
          wheres.length > 0 ? `WHERE ${wheres.join(" AND")}` : ""
        } ${limit ? `LIMIT ${limit}` : ""}`;
      default:
        throw new Error();
    }
  }
}
