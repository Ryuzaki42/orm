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

connection.connect().then(async c => {
  const res = await c
    .createQueryBuilder(User)
    .select()
    .where("id", 2)
    .one();

  const res1 = await c
    .createQueryBuilder(User)
    .select()
    .many()
    .where("id", 2);

  const res2 = await c
    .createQueryBuilder(User)
    .select()
    .where("id", 2);

  const res3 = await c
    .createQueryBuilder()
    .selectRaw("1", "something")
    .one();

  const res4 = await c
    .createQueryBuilder()
    .selectRaw("1", "something")
    .many();

  const res5 = await c
    .createQueryBuilder()
    .selectRaw("1", "something")
    .addSelectRawAs<number>()("42", "someNumber")
    .many();

  const res6 = await c
    .createQueryBuilder(User)
    .select()
    .addSelectRawAs<number>()("42", "someNumber")
    .addSelectRawAs<string>()("'text'", "someText")
    .one();

  console.log(res, res1, res2, res3, res4, res5, res6);
});
