import { BaseQueryBuilder } from "./BaseQueryBuilder";
import { SelectQueryBuilder } from "./SelectQueryBuilder";

export class QueryBuilder<ModelResult, RawResult> extends BaseQueryBuilder<ModelResult, RawResult> {
  public select(...selection: string[]): SelectQueryBuilder<ModelResult[], unknown[]> {
    this.expression.type = "select";

    if (selection.length === 0) {
      selection = this.expression
        .main!.metadata.getPropertiesMetadata()
        .map(propertyMetadata => propertyMetadata.propertyName);
    }

    if (this.expression.select) {
      this.expression.select.properties = selection;
    } else {
      this.expression.select = {
        mode: "many",
        properties: selection,
      };
    }

    return new SelectQueryBuilder(this);
  }

  public selectRaw<K extends keyof any>(
    expression: string,
    alias: K,
  ): SelectQueryBuilder<unknown[], Array<RawResult extends any[] ? RawResult[0] : RawResult & { [key in K]: any }>> {
    this.expression.type = "select";

    if (this.expression.select) {
      this.expression.select.raws = [{ alias: alias as string, expression }];
    } else {
      this.expression.select = {
        mode: "many",
        raws: [{ alias: alias as string, expression }],
      };
    }

    return new SelectQueryBuilder(this);
  }

  public selectRawAs<R>(): <K extends keyof any>(
    expression: string,
    alias: K,
  ) => SelectQueryBuilder<unknown[], Array<RawResult extends any[] ? RawResult[0] : RawResult & { [key in K]: R }>> {
    return (expression, alias) => {
      return this.selectRaw(expression, alias);
    };
  }
}
