export class DriverNotFound extends Error {
  constructor(driverType: string) {
    super();
    Object.setPrototypeOf(this, DriverNotFound.prototype);
    this.message = `Driver ${driverType} not found.`;
  }
}
