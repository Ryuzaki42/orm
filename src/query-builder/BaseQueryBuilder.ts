import { Connection } from "../connection/Connection";
import { IQueryExecutor } from "../drivers/QueryExecutor";
import { QueryExpression } from "./QueryExpression";

export class BaseQueryBuilder<Model> extends Promise<any> {
  public readonly connection: Connection;
  public readonly expressionMap: QueryExpression;
  public readonly queryExecutor?: IQueryExecutor;

  constructor(connection: Connection, queryExecutor?: IQueryExecutor);
  constructor(queryBuilder: BaseQueryBuilder<Model>);
  constructor(connectionOrQueryBuilder: Connection | BaseQueryBuilder<Model>, queryExecutor?: IQueryExecutor) {
    // tslint:disable-next-line:no-empty
    super(() => {});

    if (connectionOrQueryBuilder instanceof BaseQueryBuilder) {
      this.connection = connectionOrQueryBuilder.connection;
      this.queryExecutor = connectionOrQueryBuilder.queryExecutor;
      this.expressionMap = connectionOrQueryBuilder.expressionMap.clone();
    } else {
      this.connection = connectionOrQueryBuilder;
      this.queryExecutor = queryExecutor;
      this.expressionMap = new QueryExpression();
    }
  }

  public async execute() {
    const query = this.getQuery();
    const queryExecutor = this.queryExecutor || this.connection.createQueryExecutor();

    try {
      return await queryExecutor.execute(query);
    } finally {
      if (queryExecutor !== this.queryExecutor) {
        await queryExecutor.release();
      }
    }
  }

  public getQuery(): string {
    throw new Error();
  }

  public async then<TResult1 = any, TResult2 = any>(
    onResolve?: ((value: any) => PromiseLike<TResult1> | TResult1) | undefined | null,
    onReject?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    try {
      const executeResult = await this.execute();
      if (onResolve) {
        return new Promise((resolve, reject) => {
          try {
            const result = onResolve(executeResult);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      } else {
        return Promise.resolve(executeResult);
      }
    } catch (e) {
      if (onReject) {
        return new Promise((resolve, reject) => {
          try {
            const result = onReject(e);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      } else {
        return Promise.reject(e);
      }
    }
  }
}
