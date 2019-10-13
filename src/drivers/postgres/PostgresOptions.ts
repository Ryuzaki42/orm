import { IConnectionOptions } from "../../connection/ConnectionOptions";

export interface IPostgresCredentialsOptions {
  readonly database?: string;
  readonly host?: string;
  readonly password?: string;
  readonly port?: number;
  readonly user?: string;
}

export interface IPostgresOptions extends IConnectionOptions, IPostgresCredentialsOptions {
  readonly type: "postgres";
}
