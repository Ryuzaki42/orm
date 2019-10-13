export interface IDriver {
  connect(): Promise<void>;
}
