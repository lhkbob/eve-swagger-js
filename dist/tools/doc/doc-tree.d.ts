export declare type Indexable = {
    key: string;
};
export interface LabeledData<T extends Indexable> {
    label: string;
    data?: T;
    children?: LabeledData<T>[];
}
export interface IndexElement {
    label: string;
    key?: string;
    file?: string;
    children?: IndexElement[];
}
export interface Builder<T extends Indexable> {
    (): LabeledData<T>[];
}
export declare function makeIndexTree<T extends Indexable>(data: LabeledData<T>[], dataFileMap: Map<string, string>): IndexElement[];
export declare function collectData<T extends Indexable>(index: LabeledData<T>[]): T[];
export declare function sortIndex<T extends Indexable>(index: LabeledData<T>[]): void;
