const _CallableInstance = require('callable-instance');

/**
 * ExtensibleFunction extends Function, allowing the addition of members and
 * other methods to be added to the instance like a regular object while still
 * being callable as a regular function. The default function that is executed
 * when called as a function is passed to the constructor.
 * @private
 */
class CallableInstance extends _CallableInstance {
  /**
   * Create an extensible function
   *
   * @param f The default action
   * @constructor
   */
  constructor(f) {
    super('__callSelf');
    this._func = f;
  }

  __callSelf(...args) {
    return this._func(...args);
  }
}

module.exports = CallableInstance;
