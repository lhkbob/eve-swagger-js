"use strict";
// Polyfill to make sure asyncIterator is actually there at run time.
// TypeScript generates the rest of the necessary code to handle using this.
const asyncSymbol = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
Symbol.asyncIterator = asyncSymbol;
module.exports = asyncSymbol;
//# sourceMappingURL=async-iterator.js.map