import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { SelectQueryBuilder } from "./SelectQueryBuilder";

export class QueryBuilder<Model> extends BaseQueryBuilder<Model> {
  public select(selection: string[]): SelectQueryBuilder<Model> {
    this.expressionMap.type = "select";
    this.expressionMap.selects = selection;

    return new SelectQueryBuilder(this);
  }
}
