import Metadata from "../metadata/Metadata";
import ModelMetadata from "../metadata/ModelMetadata";
import { Constructor } from "../types";
import { QuerySelections } from "./QueryExpression";
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
  ): SelectQueryBuilder<ModelResult extends any[] ? Model[] : Model, RawResult> {
    const modelMetadata = Metadata.getInstance().getModelMetadata(model);
    if (!modelMetadata) {
      throw new Error();
    }

    this.expression.main = modelMetadata;

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
      const iterate = (selections: QuerySelections, metadata: ModelMetadata, path?: string, newClass?: boolean) => {
        const item: any = newClass ? new metadata.constructor() : {};

        selections.forEach(selection => {
          if (typeof selection === "string") {
            const propertyMetadata = metadata.getPropertyMetadata(selection)!;
            const modelMetadata = Metadata.getInstance().getModelMetadata(propertyMetadata.type);

            if (modelMetadata) {
              item[selection] = iterate(
                modelMetadata.getPropertiesMetadata().map(m => m.propertyName),
                modelMetadata,
                `${path ? `${path}_` : ""}${selection}`,
                true,
              );
            } else {
              item[selection] = itemData[`${path ? `${path}_` : ""}${selection}`];
            }
          } else {
            item[selection.name] = iterate(
              selection.selections,
              Metadata.getInstance().getModelMetadata(metadata.getPropertyMetadata(selection.name)!.type)!,
              `${path ? `${path}_` : ""}${selection.name}`,
            );
          }
        });

        return item;
      };

      if (this.expression.select!.selections.length === 0) {
        return iterate(
          this.expression.main!.getPropertiesMetadata().map(m => m.propertyName),
          this.expression.main!,
          undefined,
          true,
        );
      } else {
        return iterate(this.expression.select!.selections, this.expression.main!);
      }
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
