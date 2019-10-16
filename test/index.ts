import { Model, Property } from "../src";
import { ConnectionManager } from "../src/connection/ConnectionManager";
import Metadata from "../src/metadata/Metadata";

@Model
export class User {
  @Property
  public id!: number;

  @Property({ name: "custom" })
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

connection.connect().then(async connection => {
  const res = await connection
    .createQueryBuilder(User)
    .select()
    .where({
      age: 42,
    });

  console.log(res);
});
