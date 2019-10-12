import Metadata from "../metadata";
import ModelMetadata from "../metadata/ModelMetadata";
import { Constructor } from "../types";

interface IModelOptions {
  name?: string;
}

export function Model(constructor: Constructor): void;
export function Model(options: IModelOptions): any;
export function Model(constructorOrOptions: Constructor | IModelOptions) {
  const emitMetadata = (constructor: Constructor, options: IModelOptions = {}) => {
    let modelMetadata = Metadata.getInstance().getModelMetadata(constructor);
    if (!modelMetadata) {
      modelMetadata = new ModelMetadata(constructor, options.name || constructor.name);
      Metadata.getInstance().addModelMetadata(modelMetadata);
    } else {
      modelMetadata.name = options.name || constructor.name;
    }
  };

  if (typeof constructorOrOptions === "function") {
    emitMetadata(constructorOrOptions as Constructor);
    return;
  }

  return (constructor: Constructor) => {
    emitMetadata(constructor, constructorOrOptions);
  };
}
