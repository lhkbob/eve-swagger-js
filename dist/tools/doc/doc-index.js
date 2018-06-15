"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function sortIndex(index) {
    for (let l of index) {
        if (l.children !== undefined) {
            sortIndex(l.children);
        }
    }
    index.sort((a, b) => a.label.localeCompare(b.label));
}
exports.sortIndex = sortIndex;
//# sourceMappingURL=doc-index.js.map