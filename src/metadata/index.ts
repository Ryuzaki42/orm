import { Constructor } from "../types";
import ModelMetadata from "./ModelMetadata";

export default class Metadata {
  private static instance: Metadata;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Metadata();
    }

    return this.instance;
  }

  private readonly modelByConstructorRefs = new Map<Constructor, ModelMetadata>();
  private readonly models: ModelMetadata[] = [];

  public addModelMetadata(modelMetadata: ModelMetadata) {
    this.models.push(modelMetadata);
    this.modelByConstructorRefs.set(modelMetadata.constructor, modelMetadata);
  }

  public getModelMetadata(constructor: Constructor) {
    return this.modelByConstructorRefs.get(constructor);
  }
}
