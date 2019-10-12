import "reflect-metadata";

import Metadata from "../metadata";
import ModelMetadata from "../metadata/ModelMetadata";
import PropertyMetadata from "../metadata/PropertyMetadata";
import { Constructor, PropertyType } from "../types";

interface IPropertyOptions {
  name?: string;
  type?: PropertyType;
}

export function Property(target: object, propertyName: string): void;
export function Property(options: IPropertyOptions): any;
export function Property(targetOrOptions: object | IPropertyOptions, propertyName?: string) {
  const emitMetadata = (target: object, propertyName: string, options: IPropertyOptions = {}) => {
    let modelMetadata = Metadata.getInstance().getModelMetadata(target.constructor as Constructor);
    if (!modelMetadata) {
      modelMetadata = new ModelMetadata(target.constructor as Constructor, target.constructor.name);
      Metadata.getInstance().addModelMetadata(modelMetadata);
    }

    let type = options.type;
    if (!type) {
      type = Reflect.getMetadata("design:type", target, propertyName);

      if (!type) {
        throw new Error("Property type is undefined");
      }
    }

    modelMetadata.addPropertyMetadata(new PropertyMetadata(options.name || propertyName, type));
  };

  if (propertyName) {
    emitMetadata(targetOrOptions, propertyName);
    return;
  }

  return (target: object, propertyName: string) => {
    emitMetadata(target, propertyName, targetOrOptions as IPropertyOptions);
  };
}
