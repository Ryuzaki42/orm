import { Model, Property } from "../src";
import { ConnectionManager } from "../src/connection/ConnectionManager";
import Metadata from "../src/metadata/Metadata";

@Model
export class User {
  @Property
  public name!: string;

  @Property
  public age!: number;
}

console.log(Metadata.getInstance().getModelMetadata(User));

const connection = ConnectionManager.getInstance().create({
  database: "test",
  password: "test",
  type: "postgres",
  user: "test",
});

connection.connect().then(connection => {
  console.log(connection.createQueryBuilder("test").select(["a", "b", "c"]));
});
