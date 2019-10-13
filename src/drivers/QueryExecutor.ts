export interface IQueryExecutor {
  connect(): Promise<any>;
  execute(query: string): Promise<any>;
  release(): Promise<void> | void;
}
