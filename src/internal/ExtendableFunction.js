/**
 * ExtensibleFunction extends Function, allowing the addition of members and
 * other methods to be added to the instance like a regular object while still
 * being callable as a regular function. The default function that is executed
 * when called as a function is passed to the constructor.
 * @private
 */
class ExtensibleFunction extends Function {
  /**
   * Create an extensible function
   *
   * @param f The default action
   * @returns {*} The function f with updated prototype
   */
  constructor(f) {
    super();
    Object.setPrototypeOf(f, new.target.prototype);
    return f;
  }
}

module.exports = ExtensibleFunction;