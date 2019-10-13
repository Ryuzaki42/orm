import ModelMetadata from "../metadata/ModelMetadata";

export class Alias {
  constructor(public name: string, public type?: "select", public metadata?: ModelMetadata) {}
}
