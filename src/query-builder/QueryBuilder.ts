import Metadata from "../metadata/Metadata";
import ModelMetadata from "../metadata/ModelMetadata";
import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { $, IRawType, Query, QueryResult, QuerySelections, QuerySimplify } from "./QueryExpression";
import { SelectQueryBuilder } from "./SelectQueryBuilder";

import { cloneDeep } from "lodash";

// // === FIRST VARIANT
//
// // === list utils
// type Scatter<Head, Tail extends readonly any[]> = (head: Head, ...tail: Tail) => never;
// type Gather<List extends readonly any[]> = (...list: List) => never;
//
// type Split<List extends readonly any[]> = Gather<List> extends Scatter<infer Head, infer Tail>
//   ? {
//       head: Head;
//       tail: Tail;
//     }
//   : never;
//
// type Head<List extends readonly any[]> = Split<List>["head"];
// type Tail<List extends readonly any[]> = Split<List>["tail"];
//
// //
// type Simplify<T> = T extends never ? never : { [K in keyof T]: T[K] };
//
// //
// declare const symCompileError: unique symbol;
// type CompileError = typeof symCompileError;
// type MissingPropertyError<Type, Key> = ["ERROR! There is no property", Key, "in type", Type] & CompileError;
//
// type ResolvePathInner<
//   Context,
//   Key extends keyof any,
//   DeeperKeys extends readonly (keyof any)[]
// > = Context extends CompileError
//   ? Context
//   : Key extends keyof Context
//   ? ResolvePath<Context[Key], DeeperKeys>
//   : MissingPropertyError<Context, Key>;
//
// type ResolvePath<Context, Keys extends readonly (keyof any)[]> = {
//   next: ResolvePathInner<Context, Head<Keys>, Tail<Keys>>;
//   end: Context;
// }[Context extends CompileError ? "end" : Keys extends [] ? "end" : "next"];
//
// declare const opTag: unique symbol;
// type OpTag = typeof opTag;
// const enum OpType {
//   Assign,
//   Copy,
//   Copy1,
//   SetContext,
//   Shape,
//   ShiftContext,
// }
// type Op<Type extends OpType = any, Props = {}> = {
//   [opTag]: Type;
// } & Props;
//
// type OpAssign<Type> = Op<OpType.Assign, { type: Type }>;
// type OpCopy<Path extends (keyof any)[]> = Op<OpType.Copy, { path: Path }>;
// type OpCopy1<Key extends keyof any> = Op<OpType.Copy1, { key: Key }>;
// type OpSetContext<Context, Next extends Op> = Op<OpType.SetContext, { context: Context; next: Next }>;
// type OpShape<Shape extends Record<any, Op>> = Op<OpType.Shape, { shape: Shape }>;
// type OpShiftContext<ContextKey extends keyof any, Next extends Op> = Op<
//   OpType.ShiftContext,
//   { contextKey: ContextKey; next: Next }
// >;
//
// type ResolveInner<TOp extends Op, Context = never> = {
//   [OpType.Assign]: TOp extends OpAssign<infer Type> ? Type : never;
//   [OpType.Copy]: TOp extends OpCopy<infer Path> ? ResolvePath<Context, Path> : never;
//   [OpType.Copy1]: TOp extends OpCopy1<infer Key> ? ResolvePath<Context, [Key]> : never;
//   [OpType.SetContext]: TOp extends OpSetContext<infer NewContext, infer Next> ? ResolveInner<Next, NewContext> : never;
//   [OpType.Shape]: TOp extends OpShape<infer Shape> ? { [K in keyof Shape]: ResolveInner<Shape[K], Context> } : never;
//   [OpType.ShiftContext]: TOp extends OpShiftContext<infer NewContextKey, infer Next>
//     ? (NewContextKey extends keyof Context
//         ? ResolveInner<Next, Context[NewContextKey]>
//         : MissingPropertyError<Context, NewContextKey>)
//     : never;
// }[TOp[OpTag]];
//
// type Resolve<TOp extends Op> = ResolveInner<TOp>;
//
// type KeyItem<Context = any> = keyof Context | OpShiftContext<keyof Context, Op> | RawType;
//
// type ConvertKey<Context, Key extends KeyItem<Context>, Result> = Key extends keyof any
//   ? Record<Key, OpCopy1<Key>>
//   : Key extends OpShiftContext<infer Key, infer Next>
//   ? Record<Key, OpShiftContext<Key, Next>>
//   : Key extends RawType
//   ? Record<Key["key"], OpAssign<Key["type"]>>
//   : never;
//
// type ConvertGetKeys<Context, Keys extends readonly KeyItem<Context>[], Result extends Record<keyof any, Op> = {}> = {
//   next: ConvertGetKeys<Context, Tail<Keys>, Result & ConvertKey<Context, Head<Keys>, Result>>;
//   end: Simplify<OpSetContext<Context, OpShape<Result>>>;
// }[Keys extends [] ? "end" : "next"];
//
// type ConvertGetSubKeys<
//   ContextKey extends keyof any,
//   Keys extends readonly KeyItem<any>[],
//   Result extends Record<keyof any, Op> = {}
// > = {
//   next: ConvertGetSubKeys<ContextKey, Tail<Keys>, Result & ConvertKey<any, Head<Keys>, Result>>;
//   end: Simplify<OpShiftContext<ContextKey, OpShape<Result>>>;
// }[Keys extends [] ? "end" : "next"];
//
// export function subGet<ContextKey extends keyof any, Keys extends readonly KeyItem[]>(
//   contextKey: ContextKey,
// ): ContextKey;
//
// export function subGet<ContextKey extends keyof any, Keys extends readonly KeyItem[]>(
//   contextKey: ContextKey,
//   ...keys: Keys
// ): ConvertGetSubKeys<ContextKey, Keys>;
//
// export function subGet<ContextKey extends keyof any, Keys extends readonly KeyItem[]>(
//   contextKey: ContextKey,
//   ...keys: Keys
// ): ConvertGetSubKeys<ContextKey, Keys> {
//   return 0 as any;
// }

// === SECOND VARIANT

// export function rawAs<T>(): <K extends keyof TT, TT = any>(expression: string, alias?: K) => RawType<T, K> {
//   return 0 as any;
// }

export function raw<T = any>(expression: string): IRawType<T> {
  console.log(expression);
  return 0 as any;
}
// export function raw<K extends keyof T, T = any>(expression: string, alias?: K): RawType<any, K>;
// export function raw<K extends keyof T, T = any>(expression: string, alias?: K): RawType<any, K> {
//   return 0 as any;
// }

export class QueryBuilder<ModelResult, RawResult> extends BaseQueryBuilder<ModelResult, RawResult> {
  public select(): SelectQueryBuilder<ModelResult[], unknown[]>;

  // public select<Keys extends readonly KeyItem<ModelResult>[]>(
  //   ...keys: Keys
  // ): SelectQueryBuilder<Array<Resolve<ConvertGetKeys<ModelResult, Keys>>>, unknown[]>;

  public select<TQuery extends Query<ModelResult>>(
    query: TQuery,
  ): SelectQueryBuilder<Array<QuerySimplify<QueryResult<ModelResult, TQuery>, TQuery>>, unknown[]>;

  public select<TQuery extends Query<ModelResult>>(query?: TQuery): SelectQueryBuilder<any[], unknown[]> {
    this.expression.type = "select";

    const selections: QuerySelections = [];
    const iterate = (
      q: TQuery,
      metadata: ModelMetadata,
      from: string,
      prefix?: string,
      embeddedMetadata?: ModelMetadata,
    ) => {
      Object.entries(q).forEach(([key, value]) => {
        if (value === $) {
          const propertyMetadata = (embeddedMetadata || metadata).getPropertyMetadata(key)!;
          const modelMetadata = Metadata.getInstance().getModelMetadata(propertyMetadata.type);

          if (modelMetadata) {
            if (propertyMetadata.reference) {
              iterate(
                modelMetadata.getPropertiesMetadata().reduce(
                  (qq, property) => {
                    qq[property.propertyName] = $;

                    return qq;
                  },
                  {} as any,
                ),
                modelMetadata,
                `${from}_${key}`,
                `${prefix ? `${prefix}_` : ""}${key}`,
              );
            } else {
              iterate(
                modelMetadata.getPropertiesMetadata().reduce(
                  (qq, property) => {
                    qq[property.propertyName] = $;

                    return qq;
                  },
                  {} as any,
                ),
                metadata,
                from,
                `${prefix ? `${prefix}_` : ""}${key}`,
                modelMetadata,
              );
            }
          } else {
            selections.push({
              from,
              select: { alias: `${prefix ? `${prefix}_` : ""}${key}`, value: `${prefix ? `${prefix}_` : ""}${key}` },
            });
          }
        } else if (value === Object(value)) {
          const propertyMetadata = metadata.getPropertyMetadata(key)!;
          const modelMetadata = Metadata.getInstance().getModelMetadata(propertyMetadata.type);

          if (modelMetadata) {
            if (propertyMetadata.reference) {
              iterate(value, modelMetadata, from, `${prefix ? `${prefix}_` : ""}${key}`);
            } else {
              iterate(value, metadata, from, `${prefix ? `${prefix}_` : ""}${key}`, modelMetadata);
            }
          } else {
            throw new Error();
          }
        }
      });
    };

    if (query) {
      iterate(query, this.expression.main!.metadata, this.expression.main!.metadata.name);
    } else {
      iterate(
        this.expression.main!.metadata.getPropertiesMetadata().reduce(
          (qq, property) => {
            qq[property.propertyName] = $;

            return qq;
          },
          {} as any,
        ),
        this.expression.main!.metadata,
        this.expression.main!.metadata.name,
      );
    }

    if (this.expression.select) {
      this.expression.select.selections = selections;
    } else {
      this.expression.select = {
        mode: "many",
        query: query
          ? cloneDeep(query)
          : this.expression.main!.metadata.getPropertiesMetadata().reduce(
              (qq, property) => {
                qq[property.propertyName] = $;

                return qq;
              },
              {} as any,
            ),
        selections,
      };
    }

    return new SelectQueryBuilder(this);
  }

  // public selectRaw<K extends keyof any>(
  //   expression: string,
  //   alias: K,
  // ): SelectQueryBuilder<unknown[], Array<RawResult extends any[] ? RawResult[0] : RawResult & { [key in K]: any }>> {
  //   this.expression.type = "select";
  //
  //   if (this.expression.select) {
  //     this.expression.select.raws = [{ alias: alias as string, expression }];
  //   } else {
  //     this.expression.select = {
  //       mode: "many",
  //       raws: [{ alias: alias as string, expression }],
  //     };
  //   }
  //
  //   return new SelectQueryBuilder(this);
  // }

  // public selectRawAs<R>(): <K extends keyof any>(
  //   expression: string,
  //   alias: K,
  // ) => SelectQueryBuilder<unknown[], Array<RawResult extends any[] ? RawResult[0] : RawResult & { [key in K]: R }>> {
  //   return (expression, alias) => {
  //     return this.selectRaw(expression, alias);
  //   };
  // }
}
