import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { SelectQueryBuilder } from "./SelectQueryBuilder";

export class QueryBuilder<Model> extends BaseQueryBuilder<Model> {
  public select(...selection: string[]): SelectQueryBuilder<Model[]> {
    this.expression.type = "select";

    if (selection.length === 0) {
      selection = this.expression
        .main!.metadata.getPropertiesMetadata()
        .map(propertyMetadata => propertyMetadata.propertyName);
    }

    if (this.expression.select) {
      this.expression.select.properties = selection;
    } else {
      this.expression.select = {
        mode: "many",
        properties: selection,
      };
    }

    return new SelectQueryBuilder(this);
  }
}
