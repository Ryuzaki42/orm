import { BaseQueryBuilder } from "../query-builder/BaseQueryBuilder";
import { IQueryExecutor } from "./QueryExecutor";

export interface IDriver {
  connect(): Promise<void>;
  createQueryExecutor(): IQueryExecutor;
  getConnection(): Promise<any>;
  getQuery(queryBuilder: BaseQueryBuilder<any>): string;
}
