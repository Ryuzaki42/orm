import Metadata from "../metadata/Metadata";
import ModelMetadata from "../metadata/ModelMetadata";
import { Constructor } from "../types";
import { $, Query } from "./QueryExpression";
import { BaseWhereQueryBuilder } from "./WhereQueryBuilder";

export class SelectQueryBuilder<ModelResult, RawResult> extends BaseWhereQueryBuilder<ModelResult, RawResult> {
  // public addSelectRaw<K extends keyof any>(
  //   expression: string,
  //   alias: K,
  // ): SelectQueryBuilder<
  //   ModelResult,
  //   RawResult extends any[]
  //     ? Array<unknown extends RawResult[0] ? { [key in K]: any } : RawResult[0] & { [key in K]: any }>
  //     : unknown extends RawResult
  //     ? { [key in K]: any }
  //     : RawResult & { [key in K]: any }
  // > {
  //   if (this.expression.select!.raws) {
  //     this.expression.select!.raws.push({ alias: alias as string, expression });
  //   } else {
  //     this.expression.select!.raws = [{ alias: alias as string, expression }];
  //   }
  //
  //   return new SelectQueryBuilder(this);
  // }
  //
  // public addSelectRawAs<R>(): <K extends keyof any>(
  //   expression: string,
  //   alias: K,
  // ) => SelectQueryBuilder<
  //   ModelResult,
  //   RawResult extends any[]
  //     ? Array<unknown extends RawResult[0] ? { [key in K]: R } : RawResult[0] & { [key in K]: R }>
  //     : unknown extends RawResult
  //     ? { [key in K]: R }
  //     : RawResult & { [key in K]: R }
  // > {
  //   return (expression, alias) => {
  //     return this.addSelectRaw(expression, alias);
  //   };
  // }

  public from<Model>(
    model: Constructor<Model>,
    alias?: string,
  ): SelectQueryBuilder<ModelResult extends any[] ? Model[] : Model, RawResult> {
    const modelMetadata = Metadata.getInstance().getModelMetadata(model);
    if (!modelMetadata) {
      throw new Error();
    }

    this.expression.main = {
      alias: alias || modelMetadata.modelName,
      metadata: modelMetadata,
    };

    return (this as unknown) as SelectQueryBuilder<ModelResult extends any[] ? Model[] : Model, RawResult>;
  }

  public many(): SelectQueryBuilder<
    ModelResult extends any[] ? ModelResult : ModelResult[],
    RawResult extends any[] ? RawResult : RawResult[]
  > {
    if (this.expression.select) {
      this.expression.select.mode = "many";
    } else {
      this.expression.select = {
        mode: "many",
        query: {},
        selections: [],
      };
    }
    return (this as unknown) as SelectQueryBuilder<
      ModelResult extends any[] ? ModelResult : ModelResult[],
      RawResult extends any[] ? RawResult : RawResult[]
    >;
  }

  public one(): SelectQueryBuilder<
    ModelResult extends any[] ? ModelResult[0] : ModelResult,
    RawResult extends any[] ? RawResult[0] : RawResult
  > {
    if (this.expression.select) {
      this.expression.select.mode = "one";
    } else {
      this.expression.select = {
        mode: "one",
        query: {},
        selections: [],
      };
    }
    return (this as unknown) as SelectQueryBuilder<
      ModelResult extends any[] ? ModelResult[0] : ModelResult,
      RawResult extends any[] ? RawResult[0] : RawResult
    >;
  }

  public transformResult(
    result: any[],
  ): unknown extends ModelResult
    ? RawResult
    : unknown[] extends ModelResult
    ? RawResult
    : unknown extends RawResult
    ? ModelResult
    : unknown[] extends RawResult
    ? ModelResult
    : { model: ModelResult; raw: RawResult } {
    let modelItems: ModelResult[] | undefined;
    modelItems = result.map(itemData => {
      const iterate = (query: Query<any>, metadata: ModelMetadata, path?: string, newClass?: boolean) => {
        const item: any = newClass ? new metadata.constructor() : {};

        Object.entries(query).forEach(([key, value]) => {
          if (value === $) {
            const propertyMetadata = metadata.getPropertyMetadata(key)!;
            const modelMetadata = Metadata.getInstance().getModelMetadata(propertyMetadata.type);

            if (modelMetadata) {
              item[key] = iterate(
                modelMetadata.getPropertiesMetadata().reduce(
                  (qq, property) => {
                    qq[property.propertyName] = $;

                    return qq;
                  },
                  {} as any,
                ),
                modelMetadata,
                `${path ? `${path}_` : ""}${key}`,
                true,
              );
            } else {
              item[key] = itemData[`${path ? `${path}_` : ""}${key}`];
            }
          } else {
            item[key] = iterate(
              value,
              Metadata.getInstance().getModelMetadata(metadata.getPropertyMetadata(key)!.type)!,
              `${path ? `${path}_` : ""}${key}`,
            );
          }
        });

        return item;
      };

      return iterate(this.expression.select!.query, this.expression.main!.metadata);
    });
    let rawItems: RawResult[] | undefined;
    // if (this.expression.select!.raws) {
    //   rawItems = result.map(itemData => {
    //     const item: any = {};
    //
    //     this.expression.select!.raws!.forEach(raw => {
    //       item[raw.alias] = itemData[raw.alias];
    //     });
    //
    //     return item;
    //   });
    // }
    if (modelItems && rawItems) {
      // @ts-ignore
      return {
        model: this.expression.select!.mode === "one" ? modelItems[0] : modelItems,
        raw: this.expression.select!.mode === "one" ? rawItems[0] : rawItems,
      };
    } else if (modelItems) {
      // @ts-ignore
      return this.expression.select!.mode === "one" ? modelItems[0] : modelItems;
    } else {
      // @ts-ignore
      return this.expression.select!.mode === "one" ? rawItems[0] : rawItems;
    }
  }
}
