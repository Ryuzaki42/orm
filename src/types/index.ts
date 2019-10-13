import { IPostgresOptions } from "../drivers/postgres/PostgresOptions";

export type Constructor = new () => any;

export type PropertyType = Constructor;

export type DriverType = "postgres";

export type ConnectionOptions = IPostgresOptions;
