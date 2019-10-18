import { BaseQueryBuilder } from "./BaseQueryBuilder";

export class BaseWhereQueryBuilder<ModelResult, RawResult> extends BaseQueryBuilder<ModelResult, RawResult> {
  public where(property: string, value: any): this {
    if (this.expression.where) {
      if (this.expression.where.properties) {
        this.expression.where.properties.push({ property, value });
      } else {
        this.expression.where.properties = [{ property, value }];
      }
    } else {
      this.expression.where = {
        properties: [{ property, value }],
      };
    }

    return this;
  }

  public whereRaw(expression: string, value: any): this {
    if (this.expression.where) {
      if (this.expression.where.raws) {
        this.expression.where.raws.push({ expression, value });
      } else {
        this.expression.where.raws = [{ expression, value }];
      }
    } else {
      this.expression.where = {
        raws: [{ expression, value }],
      };
    }

    return this;
  }
}
