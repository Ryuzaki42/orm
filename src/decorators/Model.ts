import Metadata from "../metadata/Metadata";
import ModelMetadata from "../metadata/ModelMetadata";
import { Constructor } from "../types";

interface IModelOptions {
  name?: string;
}

export function Model(constructor: Constructor<any>): void;
export function Model(options: IModelOptions): any;
export function Model(constructorOrOptions: Constructor<any> | IModelOptions) {
  const emitMetadata = (constructor: Constructor<any>, options: IModelOptions = {}) => {
    let modelMetadata = Metadata.getInstance().getModelMetadata(constructor);
    if (!modelMetadata) {
      modelMetadata = new ModelMetadata(constructor, constructor.name, options.name || constructor.name);
      Metadata.getInstance().addModelMetadata(modelMetadata);
    } else {
      modelMetadata.name = options.name || constructor.name;
    }
  };

  if (typeof constructorOrOptions === "function") {
    emitMetadata(constructorOrOptions as Constructor<any>);
    return;
  }

  return (constructor: Constructor<any>) => {
    emitMetadata(constructor, constructorOrOptions);
  };
}
