// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

const PARAMETER_COUNT_ZERO = 0;
const PARAMETER_COUNT_ONE = 1;
const PARAMETER_COUNT_TWO = 2;

const MAX_PRECISION = 11;

const INDEX_DIGITS = 0;
const INDEX_DECIMAL_PLACES = 1;


/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
  }

  match(input) {
    let result = new ValidationResult();

    if (input != null) {
      let number = this.extractDecimal(input, result);
      switch (this.params.length) {
        case PARAMETER_COUNT_ZERO:
          this.validateParamsZero(number, result);
          break;
        case PARAMETER_COUNT_ONE:
          this.validateParamsOne(number, result);
          break;
        case PARAMETER_COUNT_TWO:
          this.validateParamsTwo(number, result);
          break;
      }
    }
    return result;
  }

  extractDecimal(input, result) {
    let number;
    try {
      number = new Decimal(input);
    } catch (e) {
      number = null;
      result.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
    }
    return number;
  }

  validateParamsZero(number, result) {
    if (number) {
      if (number.precision(true) > MAX_PRECISION) {
        result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
      }
    }
  }

  validateParamsOne(number, result) {
    if (number) {
      if (number.precision(true) > this.params[INDEX_DIGITS]) {
        result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
      }
    }
  }

  validateParamsTwo(number, result) {
    if (number) {
      if (number.precision(true) > this.params[INDEX_DIGITS]) {
        result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
      }
      if (number.decimalPlaces() > this.params[INDEX_DECIMAL_PLACES]) {
        result.addInvalidTypeError("doubleNumber.e003", "The value exceeded maximum number of decimal places.");
      }
    }
  }
}

module.exports = DecimalNumberMatcher;
