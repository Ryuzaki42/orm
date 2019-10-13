import { ConnectionOptions } from "../types";
import { Connection } from "./Connection";

export class ConnectionManager {
  private static instance: ConnectionManager;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ConnectionManager();
    }

    return this.instance;
  }

  public readonly connections = new Map<string, Connection>();

  public create(options: ConnectionOptions): Connection {
    const connection = new Connection(options);
    this.connections.set(connection.name, connection);
    return connection;
  }
}
