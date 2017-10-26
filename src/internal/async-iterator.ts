// Must be in global namespace or it won't line up with other definitions that
// might be included in the environment, and it won't work with type inference
// on async generator functions.
declare global {
  // Merge with the global definition to include the asyncIterator that gets
  // polyfilled in by this module.
  interface SymbolConstructor {
    readonly asyncIterator: symbol;
  }

  // Definitions taken from lib.esnext.asynciterator.d.ts
  interface AsyncIterator<T> {
    next(value?: any): Promise<IteratorResult<T>>;
    return?(value?: any): Promise<IteratorResult<T>>;
    throw?(e?: any): Promise<IteratorResult<T>>;
  }

  interface AsyncIterable<T> {
    [Symbol.asyncIterator](): AsyncIterator<T>;
  }

  interface AsyncIterableIterator<T> extends AsyncIterator<T> {
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
  }
}

// Polyfill to make sure asyncIterator is actually there at run time.
// TypeScript generates the rest of the necessary code to handle using this.
const asyncSymbol:symbol = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
(Symbol as any).asyncIterator = asyncSymbol;

// Must export something to be an actual module with side-effects instead of
// just ambient declarations.
export = asyncSymbol;
