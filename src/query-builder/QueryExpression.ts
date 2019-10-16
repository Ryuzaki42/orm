import ModelMetadata from "../metadata/ModelMetadata";

export class QueryExpression {
  public main?: {
    alias: string;
    metadata: ModelMetadata;
  };
  public select?: {
    mode?: "one" | "many";
    properties?: string[];
  };
  public type?: "select";
  public where?: any;

  public clone(): QueryExpression {
    const map = new QueryExpression();

    map.main = this.main && { ...this.main };
    map.select = this.select && { ...this.select, properties: this.select.properties && [...this.select.properties] };
    map.type = this.type;
    map.where = this.where;

    return map;
  }
}
