import { Constructor } from "../types";
import PropertyMetadata from "./PropertyMetadata";

export default class ModelMetadata {
  private readonly properties: PropertyMetadata[] = [];

  constructor(public readonly constructor: Constructor<any>, public name: string) {}

  public addPropertyMetadata(propertyMetadata: PropertyMetadata) {
    this.properties.push(propertyMetadata);
  }

  public getPropertiesMetadata(): PropertyMetadata[] {
    return this.properties;
  }
}
