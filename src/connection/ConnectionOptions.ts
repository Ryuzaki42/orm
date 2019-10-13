import { DriverType } from "../types";

export interface IConnectionOptions {
  readonly name?: string;
  readonly type: DriverType;
}
