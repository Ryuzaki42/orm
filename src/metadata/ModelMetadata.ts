import { Constructor } from "../types";
import PropertyMetadata from "./PropertyMetadata";

export default class ModelMetadata {
  private readonly properties: PropertyMetadata[] = [];
  private readonly propertyByNameRefs = new Map<string, PropertyMetadata>();

  constructor(public readonly constructor: Constructor<any>, public modelName: string, public name: string) {}

  public addPropertyMetadata(propertyMetadata: PropertyMetadata) {
    this.properties.push(propertyMetadata);
    this.propertyByNameRefs.set(propertyMetadata.propertyName, propertyMetadata);
  }

  public getPropertiesMetadata(): PropertyMetadata[] {
    return this.properties;
  }

  public getPropertyMetadata(name: string): PropertyMetadata | undefined {
    return this.propertyByNameRefs.get(name);
  }
}
