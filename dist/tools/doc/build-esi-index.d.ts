import { Indexable, LabeledData } from './doc-tree';
/**
 * Each data file blob for the ESI index is an array of ESIData elements.
 */
export interface ESIData extends Indexable {
    tag: string;
    apiURL: string;
    httpMethod: string;
    docURL: string;
    description: string;
    usages: string[];
}
/**
 * Generates the ESI data elements that go into the JSON blobs for displaying
 * the ESI doc accordion. It is not responsible for actually saving those files.
 */
export declare function buildESIIndex(): LabeledData<ESIData>[];
