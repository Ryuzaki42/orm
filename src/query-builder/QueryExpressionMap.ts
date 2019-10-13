import { Alias } from "./Alias";

export class QueryExpressionMap {
  public mainAlias?: Alias;
  public selects?: string[];
  public type?: "select" | "update" | "delete" | "insert";

  public clone(): QueryExpressionMap {
    const map = new QueryExpressionMap();

    map.mainAlias = this.mainAlias;
    map.selects = this.selects && [...this.selects];
    map.type = this.type;

    return map;
  }
}
