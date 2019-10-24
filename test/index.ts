import { Model, Property } from "../src";
import { ConnectionManager } from "../src/connection/ConnectionManager";
import Metadata from "../src/metadata/Metadata";
import { $ } from "../src/query-builder/QueryBuilder";

@Model
export class PetStat {
  @Property
  public id1!: number;

  @Property
  public something!: number;

  public s!: PetStat;
}

@Model
export class Pet {
  @Property
  public id!: number;

  @Property
  public name!: string;

  @Property
  public stat!: PetStat;
}

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
    .select({
      age: $,
    })
    .where("id", 2)
    .one();

  console.log(res);

  const res1 = await c
    .createQueryBuilder(User)
    .select()
    .where("id", 2)
    .one();

  console.log(res1);

  // const res1 = await c
  //   .createQueryBuilder(User)
  //   .select(
  //     "id",
  //     "name",
  //     "age",
  //     subGet("pet",
  //       "id",
  //       subGet("stat",
  //         rawAs<Date>()("", "test111"),
  //         raw("", "sdfds")
  //       )
  //     ),
  //   )
  //   .one()
  //   .where("id", 2);
  //
  // const res2 = await c
  //   .createQueryBuilder(User)
  //   .select()
  //   .where("id", 2);
  //
  // const res3 = await c
  //   .createQueryBuilder()
  //   .selectRaw("1", "something")
  //   .one();
  //
  // const res4 = await c
  //   .createQueryBuilder()
  //   .selectRaw("1", "something")
  //   .many();
  //
  // const res5 = await c
  //   .createQueryBuilder()
  //   .selectRaw("1", "something")
  //   .addSelectRawAs<number>()("42", "someNumber")
  //   .one();
  //
  // const res6 = await c
  //   .createQueryBuilder(User)
  //   .select()
  //   .addSelectRawAs<number>()("42", "someNumber")
  //   .addSelectRawAs<string>()("'text'", "someText")
  //   .one();
  //
  // console.log(res, res1, res2, res3, res4, res5, res6);
});
