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

        const selects: string[] = [];
        let from:
          | {
              alias: string;
              from: string;
            }
          | undefined;
        const wheres: string[] = [];

        if (select.properties) {
          if (!main) {
            throw new Error();
          }

          from = {
            alias: main.alias,
            from: main.metadata.name,
          };

          selects.push(
            ...select.properties.map(
              property => `"${main.alias}"."${main.metadata.getPropertyMetadata(property)!.name}" AS "${property}"`,
            ),
          );
        }

        if (select.raws) {
          selects.push(...select.raws.map(raw => `${raw.expression} AS "${raw.alias}"`));
        }

        if (where) {
          if (where.properties) {
            if (!main) {
              throw new Error();
            }

            wheres.push(
              ...where.properties.map(
                whereItem =>
                  `"${main.alias}"."${main.metadata.getPropertyMetadata(whereItem.property)!.name}" = ${
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

        return `SELECT ${selects.join(", ")} ${from ? `FROM "${from.from}" AS "${from.alias}"` : ""} ${
          wheres.length > 0 ? `WHERE ${wheres.join(" AND")}` : ""
        } ${limit ? `LIMIT ${limit}` : ""}`;
      default:
        throw new Error();
    }
  }
}
