import ModelMetadata from "../metadata/ModelMetadata";

export class QueryExpression {
  public mainModel?: ModelMetadata;
  public selects?: string[];
  public type?: "select";

  public clone(): QueryExpression {
    const map = new QueryExpression();

    map.mainModel = this.mainModel;
    map.selects = this.selects && [...this.selects];
    map.type = this.type;

    return map;
  }
}
