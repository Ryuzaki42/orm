import ModelMetadata from "../metadata/ModelMetadata";

import { cloneDeep } from "lodash";

export type QuerySelections = Array<string | { name: string; selections?: QuerySelections }>;

export class QueryExpression {
  public main?: ModelMetadata;
  public select?: {
    mode?: "one" | "many";
    selections?: QuerySelections;
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
