"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME a space-saving optimization could be to lift up the file value into parent
// index elements if every child has the same file value, but this would require more work
// on the part of the client as well to then determine what file was necessary
function makeIndexTree(data, dataFileMap) {
    let index = [];
    for (let l of data) {
        if (l.children !== undefined) {
            // This is a non-leaf index element
            index.push({
                label: l.label,
                children: makeIndexTree(l.children, dataFileMap)
            });
        }
        else {
            // This is a leaf index, so look up the file of the actual data
            index.push({
                label: l.label,
                key: l.data.key,
                file: dataFileMap.get(l.data.key)
            });
        }
    }
    return index;
}
exports.makeIndexTree = makeIndexTree;
function collectData(index) {
    let all = [];
    for (let l of index) {
        if (l.children !== undefined) {
            all.push(...collectData(l.children));
        }
        else {
            all.push(l.data);
        }
    }
    return all;
}
exports.collectData = collectData;
// FIXME group by non-leaf vs leaf first, then sort by label
function sortIndex(index) {
    for (let l of index) {
        if (l.children !== undefined) {
            sortIndex(l.children);
        }
    }
    index.sort((a, b) => {
        if (a.data === undefined && b.data !== undefined) {
            return -1;
        }
        else if (a.data !== undefined && b.data === undefined) {
            return 1;
        }
        else {
            return a.label.localeCompare(b.label);
        }
    });
}
exports.sortIndex = sortIndex;
//# sourceMappingURL=doc-tree.js.map