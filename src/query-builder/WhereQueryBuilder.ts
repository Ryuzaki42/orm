import { BaseQueryBuilder } from "./BaseQueryBuilder";

export class BaseWhereQueryBuilder<ModelResult, RawResult> extends BaseQueryBuilder<ModelResult, RawResult> {
  public where(where: any): this {
    this.expression.where = where;

    return this;
  }
}
