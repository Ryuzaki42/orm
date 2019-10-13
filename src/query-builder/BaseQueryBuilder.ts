import { Connection } from "../connection/Connection";
import { IQueryExecutor } from "../drivers/QueryExecutor";
import { QueryExpression } from "./QueryExpression";

export class BaseQueryBuilder<Model> {
  public readonly connection: Connection;
  public readonly expressionMap: QueryExpression;
  public readonly queryExecutor?: IQueryExecutor;

  constructor(connection: Connection, queryExecutor?: IQueryExecutor);
  constructor(queryBuilder: BaseQueryBuilder<Model>);
  constructor(connectionOrQueryBuilder: Connection | BaseQueryBuilder<Model>, queryExecutor?: IQueryExecutor) {
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
}
