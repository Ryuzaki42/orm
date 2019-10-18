import ModelMetadata from "../metadata/ModelMetadata";

import { cloneDeep } from "lodash";

export class QueryExpression {
  public main?: {
    alias: string;
    metadata: ModelMetadata;
  };
  public select?: {
    mode?: "one" | "many";
    properties?: string[];
    raws?: Array<{ alias: string; expression: string }>;
  };
  public type?: "select";
  public where?: {
    properties?: Array<{ property: string; value: any }>;
    raws?: Array<{ expression: string; value: any }>;
  };

  public clone(): QueryExpression {
    const map = new QueryExpression();

    map.main = cloneDeep(this.main);
    map.select = cloneDeep(this.select);
    map.type = this.type;
    map.where = this.where;

    return map;
  }
}
