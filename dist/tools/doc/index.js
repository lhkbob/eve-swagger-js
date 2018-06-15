"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_esi_index_1 = require("./build-esi-index");
const build_types_index_1 = require("./build-types-index");
const doc_tree_1 = require("./doc-tree");
const path_1 = require("path");
const fs_1 = require("fs");
function exportDocIndex(options) {
    writeIndex(options.outputDir, options.pathBase, 'esi', build_esi_index_1.buildESIIndex);
    writeIndex(options.outputDir, options.pathBase, 'types', build_types_index_1.buildTypesIndex);
    // TODO add other indices as well
}
exports.exportDocIndex = exportDocIndex;
// Data blobs that have more than X keys are split into separate blob files.
// FIXME tune this higher once testing is done
const DATA_SIZE = 25;
function writeIndex(outputDir, serverPath, name, builder) {
    // Generate tree of labeled data
    let dataTree = builder();
    // Make sure it is sorted for better display
    doc_tree_1.sortIndex(dataTree);
    // Flatten tree for data dump
    let data = doc_tree_1.collectData(dataTree);
    let split = splitData(data);
    // Map from data key to blob file
    let keyFiles = new Map();
    for (let i = 0; i < split.length; i++) {
        let blob = split[i];
        let blobFilename = name + '_' + i + '.json';
        let blobPath = path_1.join(serverPath, blobFilename);
        // Record where the key was stored
        for (let e of blob) {
            keyFiles.set(e.key, blobPath);
        }
        // Save the blob as JSON
        fs_1.writeFileSync(path_1.join(outputDir, blobFilename), JSON.stringify(blob, undefined, 4));
    }
    // Convert the data tree into an index tree
    let index = doc_tree_1.makeIndexTree(dataTree, keyFiles);
    // Save the index as well
    fs_1.writeFileSync(path_1.join(outputDir, 'index_' + name + '.json'), JSON.stringify(index, undefined, 4));
}
function splitData(data) {
    if (data.length < DATA_SIZE) {
        return [data];
    }
    let split = [];
    let i = 0;
    while (i < data.length) {
        split.push(data.slice(i, i + DATA_SIZE));
        i = i + DATA_SIZE;
    }
    return split;
}
function parseArguments() {
    // Default values before handling argument overrides
    let options = {
        outputDir: path_1.join(__dirname, '../../../doc/dist/json/'),
        pathBase: 'dist/json'
    };
    for (let i = 2; i < process.argv.length; i++) {
        if (process.argv[i] === '--out') {
            if (i < process.argv.length - 1) {
                options.outputDir = process.argv[++i];
            }
            else {
                throw new Error('--out requires an argument');
            }
        }
        else if (process.argv[i] === '--path') {
            if (i < process.argv.length - 1) {
                options.pathBase = process.argv[++i];
            }
            else {
                throw new Error('--path requires an argument');
            }
        }
        else if (process.argv[i] === '--help') {
            console.log('ESI document generator arguments:');
            console.log('--help: Show help message and exit');
            console.log('--out [arg]: Root directory in file system to write JSON docs to');
            console.log('--path [arg]: Relative server path to access JSON docs');
            return undefined;
        }
        else {
            console.error('Skipping unknown argument:', process.argv[i]);
        }
    }
    return options;
}
if (!module.parent) {
    try {
        let options = parseArguments();
        if (options !== undefined) {
            exportDocIndex(options);
        }
    }
    catch (e) {
        console.error('Failed to generate documentation:', e.message);
        console.error(e.stack);
    }
}
//# sourceMappingURL=index.js.map