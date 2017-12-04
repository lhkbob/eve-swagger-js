declare global  {
    interface SymbolConstructor {
        readonly asyncIterator: symbol;
    }
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
declare const asyncSymbol: symbol;
export = asyncSymbol;
export {};
