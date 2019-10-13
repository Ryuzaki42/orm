import { QueryExpressionMap } from "./QueryExpressionMap";

export class BaseQueryBuilder<Model> {
  public readonly expressionMap: QueryExpressionMap;

  constructor();
  constructor(queryBuilder: BaseQueryBuilder<Model>);
  constructor(queryBuilder?: BaseQueryBuilder<Model>) {
    if (queryBuilder) {
      this.expressionMap = queryBuilder.expressionMap.clone();
    } else {
      this.expressionMap = new QueryExpressionMap();
    }
  }

  public getQuery(): string {
    throw new Error();
  }
}
