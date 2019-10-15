import { BaseQueryBuilder } from "./BaseQueryBuilder";

export class SelectQueryBuilder<Model> extends BaseQueryBuilder<Model> {
  public getQuery(): string {
    return `SELECT ${this.expressionMap
      .selects!.map(
        select => `"${this.expressionMap.main!.alias}"."${select}" AS "${this.expressionMap.main!.alias}_${select}"`,
      )
      .join(", ")} FROM "${this.expressionMap.main!.metadata.name}" AS "${this.expressionMap.main!.alias}"`;
  }
}
