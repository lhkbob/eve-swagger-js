import {buildESIIndex} from './build-esi-index';
import { buildTypesIndex } from './build-types-index';
import {
  IndexElement, Indexable, Builder, LabeledData, sortIndex, collectData,
  makeIndexTree
} from './doc-tree';

import {join} from 'path';
import {writeFileSync} from 'fs';


export interface Options {
  outputDir: string; // Directory to write index data to
  pathBase: string; // Server relative path to access the data
}

export function exportDocIndex(options:Options) :void {
  writeIndex(options.outputDir, options.pathBase, 'esi', buildESIIndex);
  writeIndex(options.outputDir, options.pathBase, 'types', buildTypesIndex);
  // TODO add other indices as well
}


// Data blobs that have more than X keys are split into separate blob files.
// FIXME tune this higher once testing is done
const DATA_SIZE = 25;

function writeIndex<T extends Indexable>(outputDir:string, serverPath:string, name:string, builder:Builder<T>) :void {
  // Generate tree of labeled data
  let dataTree = builder();
  // Make sure it is sorted for better display
  sortIndex(dataTree);
  // Flatten tree for data dump
  let data = collectData(dataTree);

  let split = splitData(data);
  // Map from data key to blob file
  let keyFiles = new Map();

  for (let i = 0; i < split.length; i++) {
    let blob = split[i];
    let blobFilename = name + '_' + i + '.json';
    let blobPath = join(serverPath, blobFilename);
    // Record where the key was stored
    for (let e of blob) {
      keyFiles.set(e.key, blobPath);
    }

    // Save the blob as JSON
    writeFileSync(join(outputDir, blobFilename), JSON.stringify(blob, undefined, 4));
  }

  // Convert the data tree into an index tree
  let index = makeIndexTree(dataTree, keyFiles);

  // Save the index as well
  writeFileSync(join(outputDir, 'index_' + name + '.json'), JSON.stringify(index, undefined, 4));
}

function splitData<T extends Indexable>(data:T[]) : T[][] {
  if (data.length < DATA_SIZE) {
    return [ data ];
  }

  let split = [];
  let i = 0;
  while (i < data.length) {
    split.push(data.slice(i, i + DATA_SIZE));
    i = i + DATA_SIZE;
  }

  return split;
}

function parseArguments(): Options | undefined {
  // Default values before handling argument overrides

  let options: Options = {
    outputDir: join(__dirname, '../../../doc/dist/json/'),
    pathBase: 'dist/json'
  };

  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--out') {
      if (i < process.argv.length - 1) {
        options.outputDir = process.argv[++i];
      } else {
        throw new Error('--out requires an argument');
      }
    } else if (process.argv[i] === '--path') {
      if (i < process.argv.length - 1) {
        options.pathBase = process.argv[++i];
      } else {
        throw new Error('--path requires an argument');
      }
    } else if (process.argv[i] === '--help') {
      console.log('ESI document generator arguments:');
      console.log('--help: Show help message and exit');
      console.log('--out [arg]: Root directory in file system to write JSON docs to');
      console.log('--path [arg]: Relative server path to access JSON docs');
      return undefined;
    } else {
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
  } catch (e) {
    console.error('Failed to generate documentation:', e.message);
    console.error(e.stack);
  }
}
