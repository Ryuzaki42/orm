import { BaseQueryBuilder } from "./BaseQueryBuilder";

export class SelectQueryBuilder<Model> extends BaseQueryBuilder<Model> {
  public getQuery(): string {
    return `SELECT ${this.expressionMap.selects} FROM ${this.expressionMap.mainAlias!.name}`;
  }
}
