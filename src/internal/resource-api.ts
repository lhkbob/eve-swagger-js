export interface ResourceLoader<T> {
  (id: number): Promise<T>;
}

export function getResourcesAsMap<T>(ids: number[],
    loader: ResourceLoader<T>): Promise<Map<number, T>> {
  return getResourcesAsArray(ids, loader).then(arrayMap => {
    let map = new Map();
    for (let e of arrayMap) {
      map.set(e[0], e[1]);
    }
    return map;
  });
}

export function getResourcesAsArray<T>(ids: number[],
    loader: ResourceLoader<T>): Promise<[number, T][]> {
  let elements: Promise<[number, T]>[] = [];
  for (let id of ids) {
    elements.push(loader(id).then(result => <[number, T]> [id, result]));
  }
  return Promise.all(elements);
}
