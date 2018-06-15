export type Indexable = {
  key: string
}

export interface LabeledData<T extends Indexable> {
  label: string;
  // One of data or children will be non-null
  data?: T;
  children?: LabeledData<T>[];
}

export interface IndexElement {
  label: string;

  // If a leaf, it will specify both key and file
  key?: string;
  file?: string;

  // If not, children will be defined
  children?: IndexElement[];
}

export interface Builder<T extends Indexable> {
  (): LabeledData<T>[];
}

// FIXME a space-saving optimization could be to lift up the file value into parent
// index elements if every child has the same file value, but this would require more work
// on the part of the client as well to then determine what file was necessary
export function makeIndexTree<T extends Indexable>(data: LabeledData<T>[], dataFileMap :Map<string, string>) : IndexElement[] {
  let index = [];
  for (let l of data) {
    if (l.children !== undefined) {
      // This is a non-leaf index element
      index.push({
        label: l.label,
        children: makeIndexTree(l.children, dataFileMap)
      });
    } else {
      // This is a leaf index, so look up the file of the actual data
      index.push({
        label: l.label,
        key: l.data!.key,
        file: dataFileMap.get(l.data!.key)!
      });
    }
  }

  return index;
}

export function collectData<T extends Indexable>(index: LabeledData<T>[]) :T[] {
  let all = [];

  for (let l of index) {
    if (l.children !== undefined) {
      all.push(...collectData(l.children));
    } else {
      all.push(l.data!);
    }
  }

  return all;
}

// FIXME group by non-leaf vs leaf first, then sort by label
export function sortIndex<T extends Indexable>(index: LabeledData<T>[]) :void {
  for (let l of index) {
    if (l.children !== undefined) {
      sortIndex(l.children);
    }
  }

  index.sort((a, b) => {
    if (a.data === undefined && b.data !== undefined) {
      return -1;
    } else if (a.data !== undefined && b.data === undefined) {
      return 1;
    } else {
      return a.label.localeCompare(b.label);
    }
  });
}
