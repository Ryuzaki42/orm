import { IDriver } from "../drivers/Driver";
import { DriverFactory } from "../drivers/DriverFactory";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { ConnectionOptions } from "../types";

export class Connection {
  public readonly driver: IDriver;
  public readonly name: string;

  constructor(public readonly options: ConnectionOptions) {
    this.name = options.name || "default";
    this.driver = new DriverFactory().create(this);
  }

  public async connect(): Promise<this> {
    await this.driver.connect();
    return this;
  }

  public createQueryBuilder<Model>(model: string): QueryBuilder<Model> {
    const queryBuilder = new QueryBuilder();

    queryBuilder.expressionMap.main = model;

    return queryBuilder;
  }
}
