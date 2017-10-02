import { join } from 'path';
import { readFileSync } from 'fs';

export interface ExplicitNames {
  [name: string]: string;
}

const namespaces = loadNamespaceOverrides();

// Title refers to a route id, name is a valid namespace path
export const NAMESPACE_OVERRIDES: ExplicitNames = namespaces.explicit;

// Full namespaces that should be collapsed into their parent, these
// are spaces that can be consolidated logically but don't match the present
// set of heuristics for automatic collapse.
export const COLLAPSE_NAMESPACE: string[] = namespaces.collapse;

// Title refers to the generated title for a type, name is the new name
export const TYPENAME_OVERRIDES: ExplicitNames = loadTypeNameOverrides();

// Reads ./overrides/namespaces.json
function loadNamespaceOverrides(): { explicit: ExplicitNames, collapse: string[] } {
  let json = readFileSync(getPathTo('namespaces.json'), 'utf8');
  return <{ explicit: ExplicitNames, collapse: string[] }> JSON.parse(json);
}

// Reads ./overrides/types.json
function loadTypeNameOverrides(): ExplicitNames {
  let json = readFileSync(getPathTo('types.json'), 'utf8');
  return <ExplicitNames> JSON.parse(json);
}

// Whenever this script is run, it is from dist/util as compiled JS, but the
// JSON files aren't copied over, so extra directory levels must be stripped off
function getPathTo(jsonFilename: string): string {
  return join(__dirname, '../../../util/type-generator/overrides', jsonFilename);
}
