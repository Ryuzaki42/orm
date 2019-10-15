import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { SelectQueryBuilder } from "./SelectQueryBuilder";

export class QueryBuilder<Model> extends BaseQueryBuilder<Model> {
  public select(selection?: string[]): SelectQueryBuilder<Model> {
    this.expressionMap.type = "select";

    if (selection) {
      this.expressionMap.selects = selection;
    } else {
      this.expressionMap.selects = this.expressionMap
        .main!.metadata.getPropertiesMetadata()
        .map(propertyMetadata => propertyMetadata.name);
    }

    return new SelectQueryBuilder(this);
  }
}
