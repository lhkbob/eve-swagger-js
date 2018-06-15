import { IndexElement } from '../doc-tree';
import axios from 'axios';

// Cannot really inherit IndexElement since Vue forces the use of null instead of undefined
// and we want these instances to have their property binding/state-tracking
export interface DocNode {
  // general
  label: string;

  // leaf-only
  key: string | null;
  file: string | null;
  // keyed-value from blob file, initialized after first expansion
  blob: any | null;
  // internal
  children: DocNode[] | null;

  // user interface
  expanded: boolean;
  errorMessage: string | null;
}

// null for unloaded, Promise for loading, empty string for ready, any other
// string for an error message;
type Status = null | Promise<any> | string;

export class DynamicDocTree {
  private index:DocNode[];
  private indexStatus:Status;

  // key is filename of data file
  private blobCache:Map<string, Status>;


  constructor(readonly indexFile:string) {
    this.index = [];
    this.indexStatus = null;
    this.blobCache = new Map();
  }

  get status() :string {
    if (this.indexStatus === null || this.indexStatus instanceof Promise) {
      return 'loading';
    } else {
      // Will be empty or an error message
      return this.indexStatus;
    }
  }

  get roots() :DocNode[] {
    return this.index;
  }

  setExpanded(element:DocNode, expand:boolean, visitChildren:boolean = false) :void {
    // Visit children if present
    if (visitChildren && element.children !== null) {
      for (let c of element.children) {
        this.setExpanded(c, expand, visitChildren);
      }
    }

    // Escape early if no change needs to be made
    if (element.expanded == expand) {
      return;
    }

    // Special case to load data lazily if expanding
    if (expand) {
      if (element.key !== null && element.blob === null && element.errorMessage === null) {
        // Nothing appears to have been loaded yet, so request a load
        // (but don't reset so that duplicate effort isn't done)
        this.loadDataBlob(element.file!);
      } // else it has loaded or it has failed to load, so the template will take care of visualizing it
    }

    // Set the state of the accordion tile
    element.expanded = expand;
  }

  collapseAll() {
    for (let i of this.index) {
      this.setExpanded(i, false, true);
    }
  }

  expandAll() {
    for (let i of this.index) {
      this.setExpanded(i, true, true);
    }
  }

  loadIndex(reset:boolean = false) :Promise<DocNode[]> {
    if (reset) {
      // First reset the loaded index
      this.index = [];
      // Second reset the blob cache
      this.blobCache.clear();
      // And reset status
      this.indexStatus = null;
    }

    if (this.indexStatus === null) {
      // The data is unloaded, no error, and no pending request
      let request = axios.get(this.indexFile).then(response => {
        // Set to the empty string since there was no error
        this.indexStatus = '';
        // Push all elements into the actual index, adding the additional fields
        // for the IndexElement type
        this.index = upgradeIndex(response.data);

        return this.index;
      }).catch(error => {
        // Unable to load the data, so set the status
        this.indexStatus = 'Error loading index: ' + error;
        return [];
      });
      this.indexStatus = request;
      return request;
    } else {
      // Else the index is being loaded, was already loaded, or had an error
      // that was not reset.
      return Promise.resolve(this.index);
    }
  }

  private setElementError(filename:string, message:string) :void {
    setErrorMessage(this.index, filename, message);
  }

  private setElementBlob(filename:string, blobs:Map<string, any>) :void {
    setData(this.index, filename, blobs);
  }

  private loadDataBlob(filename:string, reset:boolean = false) :void {
    if (reset) {
      // Delete any cached value from the map associated with the filename
      this.blobCache.delete(filename);
    }

    let status = this.blobCache.get(filename);
    if (status === undefined || status === null) {
      // Nothing has been loaded or requested for this file
      this.blobCache.set(filename, axios.get(filename).then(response => {
        // Successfully loaded the blob file, so update status to '' and push
        // the blob values associated with each key to the index
        this.blobCache.set(filename, '');

        // Convert response data into a map
        let blobs = new Map();
        for (let b of response.data) {
          blobs.set(b.key, b);
        }

        this.setElementBlob(filename, blobs);
        return 'ready';
      }).catch(error => {
        // Failed to load the blob, so record the status and push the error
        // message out to all indices that rely on the blob
        let msg = 'Error loading data: ' + error;
        this.blobCache.set(filename, msg);
        this.setElementError(filename, msg);
        return 'error';
      }));
    } // else it is already loading, finished, or had an error
  }
}


function setErrorMessage(index:DocNode[], filename: string, error: string) :void {
  for (let i of index) {
    if (i.children !== null) {
      // Recurse to children
      setErrorMessage(i.children, filename, error);
    } else if (i.file == filename) {
      i.errorMessage = error;
      i.blob = null;
    }
  }
}

function setData(index:DocNode[], filename:string, blobs:Map<string, any>) :void {
  for (let i of index) {
    if (i.children !== null) {
      setData(i.children, filename, blobs);
    } else if (i.file == filename) {
      let blob = blobs.get(i.key!);
      if (blob) {
        i.errorMessage = null;
        i.blob = blob;
      } else {
        i.errorMessage = 'Missing key in data file: ' + i.key;
        i.blob = null;
      }
    }
  }
}

function upgradeIndex(index:IndexElement[]) :DocNode[] {
  let upgraded = [];
  // FIXME could use this to vivify incomplete file values from an optimized data file
  // FIXME should automatically assign unique keys to the non-leaf nodes
  for (let node of index) {
    let remapped:DocNode = {
      label: node.label,
      key: null, file: null, blob: null, children: null,
      expanded: false, errorMessage: null};

    if (node.children !== undefined) {
      remapped.children = upgradeIndex(node.children);
    } else {
      remapped.key = node.key!;
      remapped.file = node.file!;
    }

    upgraded.push(remapped);
  }

  return upgraded;
}