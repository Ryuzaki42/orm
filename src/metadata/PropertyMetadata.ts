import { PropertyType } from "../types";

export default class PropertyMetadata {
  constructor(public readonly name: string, public readonly type: PropertyType) {}
}
