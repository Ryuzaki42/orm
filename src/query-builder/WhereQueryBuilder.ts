import { BaseQueryBuilder } from "./BaseQueryBuilder";

export class BaseWhereQueryBuilder<Result> extends BaseQueryBuilder<Result> {
  public where(where: any): this {
    this.expression.where = where;

    return this;
  }
}
