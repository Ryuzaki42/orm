import { Connection } from "../connection/Connection";
import { IDriver } from "./Driver";
import { PostgresDriver } from "./postgres/PostgresDriver";

export class DriverFactory {
  public create(connection: Connection): IDriver {
    const { type } = connection.options;
    switch (type) {
      case "postgres":
        return new PostgresDriver(connection);
      default:
        throw new Error();
    }
  }
}
