import { Connection } from "../connection/Connection";
import { IQueryExecutor } from "../drivers/QueryExecutor";
import { QueryExpression } from "./QueryExpression";

export class BaseQueryBuilder<Result> extends Promise<Result> {
  public readonly connection: Connection;
  public readonly expression: QueryExpression;
  public readonly queryExecutor?: IQueryExecutor;

  constructor(connection: Connection, queryExecutor?: IQueryExecutor);
  constructor(queryBuilder: BaseQueryBuilder<any>);
  constructor(connectionOrQueryBuilder: Connection | BaseQueryBuilder<any>, queryExecutor?: IQueryExecutor) {
    // tslint:disable-next-line:no-empty
    super(() => {});

    if (connectionOrQueryBuilder instanceof BaseQueryBuilder) {
      this.connection = connectionOrQueryBuilder.connection;
      this.queryExecutor = connectionOrQueryBuilder.queryExecutor;
      this.expression = connectionOrQueryBuilder.expression.clone();
    } else {
      this.connection = connectionOrQueryBuilder;
      this.queryExecutor = queryExecutor;
      this.expression = new QueryExpression();
    }
  }

  public async execute(): Promise<any> {
    const query = this.getQuery();
    console.log(query);
    const queryExecutor = this.queryExecutor || this.connection.createQueryExecutor();

    try {
      return this.transformResult(await queryExecutor.execute(query));
    } finally {
      if (queryExecutor !== this.queryExecutor) {
        await queryExecutor.release();
      }
    }
  }

  public getQuery(): string {
    return this.connection.driver.getQuery(this);
  }

  public async then<TResult1 = Result, TResult2 = any>(
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

  public transformResult(value: any): any {
    return value;
  }
}
