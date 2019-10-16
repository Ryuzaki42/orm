import { BaseWhereQueryBuilder } from "./WhereQueryBuilder";

export class SelectQueryBuilder<Result> extends BaseWhereQueryBuilder<Result> {
  public many<Model>(): SelectQueryBuilder<Model[]> {
    if (this.expression.select) {
      this.expression.select.mode = "many";
    } else {
      this.expression.select = {
        mode: "many",
      };
    }
    return (this as unknown) as SelectQueryBuilder<Model[]>;
  }
  public one<Model>(): SelectQueryBuilder<Model> {
    if (this.expression.select) {
      this.expression.select.mode = "one";
    } else {
      this.expression.select = {
        mode: "one",
      };
    }
    return (this as unknown) as SelectQueryBuilder<Model>;
  }

  public transformResult(result: any[]): any {
    // console.log(result);

    const items: Result[] = result.map(itemData => {
      const item = new this.expression.main!.metadata.constructor();

      Object.entries(itemData).forEach(([key, value]) => {
        item[key] = value;
      });

      return item;
    });

    return this.expression.select!.mode === "one" ? items[0] : items;
  }
}
