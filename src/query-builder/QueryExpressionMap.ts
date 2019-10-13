export class QueryExpressionMap {
  public main?: string;
  public selects?: string[];
  public type?: "select" | "update" | "delete" | "insert";

  public clone(): QueryExpressionMap {
    const map = new QueryExpressionMap();

    map.main = this.main;
    map.selects = this.selects && [...this.selects];
    map.type = this.type;

    return map;
  }
}
