import { Pool, PoolClient } from "pg";
import { Connection } from "../../connection/Connection";
import Metadata from "../../metadata/Metadata";
import ModelMetadata from "../../metadata/ModelMetadata";
import { BaseQueryBuilder } from "../../query-builder/BaseQueryBuilder";
import { QuerySelections } from "../../query-builder/QueryExpression";
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
        const wheres: string[] = [];

        const iterate = (
          selections: QuerySelections,
          metadata: ModelMetadata,
          embedded?: { databasePath: string; metadata: ModelMetadata; path: string },
        ) => {
          selections.forEach(selection => {
            if (typeof selection === "string") {
              const propertyMetadata = (embedded ? embedded.metadata : metadata).getPropertyMetadata(selection)!;
              const modelMetadata = Metadata.getInstance().getModelMetadata(propertyMetadata.type);

              if (modelMetadata) {
                iterate(modelMetadata.getPropertiesMetadata().map(m => m.propertyName), metadata, {
                  databasePath: `${embedded ? `${embedded.databasePath}_` : ""}${propertyMetadata.name}`,
                  metadata: modelMetadata,
                  path: `${embedded ? `${embedded.path}_` : ""}${propertyMetadata.propertyName}`,
                });
              } else {
                selects.push(
                  `"${metadata.name}"."${embedded ? `${embedded.databasePath}_` : ""}${
                    (embedded ? embedded.metadata : metadata).getPropertyMetadata(selection)!.name
                  }" AS "${embedded ? `${embedded.path}_` : ""}${selection}"`,
                );
              }
            } else {
              const propertyMetadata = metadata.getPropertyMetadata(selection.name)!;
              const modelMetadata = Metadata.getInstance().getModelMetadata(propertyMetadata.type)!;

              iterate(selection.selections, metadata, {
                databasePath: `${embedded ? `${embedded.databasePath}_` : ""}${propertyMetadata.name}`,
                metadata: modelMetadata,
                path: `${embedded ? `${embedded.path}_` : ""}${propertyMetadata.propertyName}`,
              });
            }
          });
        };

        if (!main) {
          throw new Error();
        }

        iterate(
          select.selections.length === 0 ? main.getPropertiesMetadata().map(m => m.propertyName) : select.selections,
          main,
        );

        if (where) {
          if (where.properties) {
            if (!main) {
              throw new Error();
            }

            wheres.push(
              ...where.properties.map(
                whereItem =>
                  `"${main.modelName}"."${main.getPropertyMetadata(whereItem.property)!.name}" = ${whereItem.value}`,
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

        return `SELECT ${selects.join(", ")} ${main ? `FROM "${main.name}" AS "${main.modelName}"` : ""} ${
          wheres.length > 0 ? `WHERE ${wheres.join(" AND")}` : ""
        } ${limit ? `LIMIT ${limit}` : ""}`;
      default:
        throw new Error();
    }
  }
}
