import { IPostgresOptions } from "../drivers/postgres/PostgresOptions";

export type Constructor<T> = new () => T;

export type PropertyType = Constructor<any>;

export type DriverType = "postgres";

export type ConnectionOptions = IPostgresOptions;
