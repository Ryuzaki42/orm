import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { SelectQueryBuilder } from "./SelectQueryBuilder";

export class QueryBuilder<Model> extends BaseQueryBuilder<Model> {
  public select(selection?: string[]): SelectQueryBuilder<Model> {
    this.expression.type = "select";

    if (selection) {
      this.expression.selects = selection;
    } else {
      this.expression.selects = this.expression
        .main!.metadata.getPropertiesMetadata()
        .map(propertyMetadata => propertyMetadata.name);
    }

    return new SelectQueryBuilder(this);
  }
}
