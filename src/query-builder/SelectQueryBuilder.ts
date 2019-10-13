import { BaseQueryBuilder } from "./BaseQueryBuilder";

export class SelectQueryBuilder<Model> extends BaseQueryBuilder<Model> {
  public from(name: string): this {
    this.expressionMap.main = name;

    return this;
  }

  public getQuery(): string {
    return `SELECT ${this.expressionMap.selects} FROM ${this.expressionMap.main}`;
  }
}
