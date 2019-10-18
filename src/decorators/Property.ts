import "reflect-metadata";

import Metadata from "../metadata/Metadata";
import ModelMetadata from "../metadata/ModelMetadata";
import PropertyMetadata from "../metadata/PropertyMetadata";
import { Constructor, PropertyType } from "../types";

interface IPropertyOptions {
  name?: string;
  type?: PropertyType;
}

export function Property(target: object, propertyName: string): void;
export function Property(options: IPropertyOptions): any;
export function Property(targetOrOptions: object | IPropertyOptions, maybePropertyName?: string) {
  const emitMetadata = (target: object, name: string, options: IPropertyOptions = {}) => {
    let modelMetadata = Metadata.getInstance().getModelMetadata(target.constructor as Constructor<any>);
    if (!modelMetadata) {
      modelMetadata = new ModelMetadata(
        target.constructor as Constructor<any>,
        target.constructor.name,
        target.constructor.name,
      );
      Metadata.getInstance().addModelMetadata(modelMetadata);
    }

    let type = options.type;
    if (!type) {
      type = Reflect.getMetadata("design:type", target, name);

      if (!type) {
        throw new Error();
      }
    }

    modelMetadata.addPropertyMetadata(new PropertyMetadata(name, options.name || name, type));
  };

  if (maybePropertyName) {
    emitMetadata(targetOrOptions, maybePropertyName);
    return;
  }

  return (target: object, propertyName: string) => {
    emitMetadata(target, propertyName, targetOrOptions as IPropertyOptions);
  };
}
