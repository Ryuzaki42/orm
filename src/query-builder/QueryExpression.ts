import ModelMetadata from "../metadata/ModelMetadata";

import { cloneDeep } from "lodash";

export declare const $: unique symbol;
export type $ = typeof $;

export interface IRawType<T = any, K = any> {
  key: K;
  type: T;
}

export type QueryTree<TContext> = {
  [K in keyof TContext]?: ($ | QueryTree<TContext[K]> | { [KK in keyof any]: IRawType });
};

export type QueryResult<TContext, TQuery extends QueryTree<TContext>> = {
  [K in keyof TQuery]: K extends keyof TContext
    ? TQuery[K] extends $
      ? TContext[K]
      : QueryResult<TContext[K], TQuery[K]>
    : never;
};

export type QuerySimplify<T, TQuery> = TQuery extends $
  ? T
  : TQuery extends IRawType
  ? TQuery["type"]
  : TQuery extends object
  ? T extends never
    ? never
    : {
        [K in keyof TQuery]: K extends keyof T ? QuerySimplify<T[K], TQuery[K]> : never;
      }
  : never;

export type Query<TContext> = QueryTree<TContext> | { [KK in keyof any]: IRawType };

export type QuerySelections = Array<{
  from: string;
  select: {
    alias: string;
    value: string;
  };
}>;

export class QueryExpression {
  public main?: {
    alias: string;
    metadata: ModelMetadata;
  };
  public select?: {
    mode: "one" | "many";
    query: Query<any>;
    selections: QuerySelections;
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
