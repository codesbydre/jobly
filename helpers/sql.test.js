const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", () => {
  test("works: all keys", () => {
    const result = sqlForPartialUpdate(
      { firstName: "Aliya", age: 32 },
      { firstName: "first_name" }
    );

    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });

  test("works: only some keys", () => {
    const result = sqlForPartialUpdate(
      { age: 32 },
      { firstName: "first_name" }
    );

    expect(result).toEqual({
      setCols: '"age"=$1',
      values: [32],
    });
  });

  test("throws BadRequestError with no data", () => {
    expect(() => sqlForPartialUpdate({}, {})).toThrow(BadRequestError);
  });
});
