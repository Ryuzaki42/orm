import { IDriver } from "../drivers/Driver";
import { DriverFactory } from "../drivers/DriverFactory";
import Metadata from "../metadata/Metadata";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { ConnectionOptions, Constructor } from "../types";

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

  public createQueryBuilder<Model>(model: Constructor<Model>, alias?: string): QueryBuilder<Model> {
    const queryBuilder = new QueryBuilder(this);

    const modelMetadata = Metadata.getInstance().getModelMetadata(model);
    if (!modelMetadata) {
      throw new Error("");
    }

    queryBuilder.expressionMap.main = {
      alias: alias || modelMetadata.name,
      metadata: modelMetadata,
    };

    return queryBuilder;
  }

  public createQueryExecutor() {
    return this.driver.createQueryExecutor();
  }
}
