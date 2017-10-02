export interface Options {
    printTypeScript: boolean;
    verbose: boolean;
    outputFile?: string;
    restrictNamespace?: string;
    restrictRoute?: string;
    parameter?: string | '__response__';
    children: boolean;
}
export declare function generateTypes(opts: Options): void;
