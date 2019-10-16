import { PropertyType } from "../types";

export default class PropertyMetadata {
  constructor(public propertyName: string, public readonly name: string, public readonly type: PropertyType) {}
}
