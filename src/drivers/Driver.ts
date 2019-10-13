import { IQueryExecutor } from "./QueryExecutor";

export interface IDriver {
  connect(): Promise<void>;
  createQueryExecutor(): IQueryExecutor;
  getConnection(): Promise<any>;
}
