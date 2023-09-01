const { BadRequestError } = require("../expressError");

/**
 * Generates SQL for partial data updates.
 *
 * This utility function aids in creating dynamic SQL update strings and corresponding
 * values when only a subset of data fields need to be updated in SQL tables.
 *
 * @param {Object} dataToUpdate - An object containing the data fields to be updated.
 *                                Keys are the JS object fields, and values are the
 *                                corresponding data values.
 *
 * @param {Object} jsToSql - An object that maps JavaScript property names to SQL column
 *                           names. Useful for scenarios where the JS object keys might
 *                           not directly match with SQL table column names.
 *
 * @returns {Object} An object containing two properties:
 *      setCols {string}: A string containing the SQL columns to be updated.
 *                        e.g., '"first_name"=$1, "age"=$2'
 *
 *      values {Array}: An array of values that correspond to the SQL columns.
 *                      These values will be bound to the SQL update query during
 *                      execution to prevent SQL injection.
 *                      e.g., ['Aliya', 32]
 *
 * @throws {BadRequestError} Throws an error if no data is provided in dataToUpdate.
 *
 * @example
 *
 * const data = { firstName: 'Aliya', age: 32 };
 * const jsToSqlMapping = { firstName: 'first_name' };
 * const result = sqlForPartialUpdate(data, jsToSqlMapping);
 * console.log(result);
 * // Outputs: { setCols: '"first_name"=$1, "age"=$2', values: ['Aliya', 32] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
