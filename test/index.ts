import { Model, Property } from "../src";
import Metadata from "../src/metadata";

@Model
export class User {
  @Property
  public name!: string;

  @Property
  public age!: number;
}

console.log(Metadata.getInstance().getModelMetadata(User));
