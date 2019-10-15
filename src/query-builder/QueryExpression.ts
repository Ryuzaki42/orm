import ModelMetadata from "../metadata/ModelMetadata";

export class QueryExpression {
  public main?: {
    alias: string;
    metadata: ModelMetadata;
  };
  public selects?: string[];
  public type?: "select";

  public clone(): QueryExpression {
    const map = new QueryExpression();

    map.main = this.main && { ...this.main };
    map.selects = this.selects && [...this.selects];
    map.type = this.type;

    return map;
  }
}
