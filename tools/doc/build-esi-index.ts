import * as esi from '../esi-api';
import {Indexable, LabeledData} from './doc-tree';

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
// FIXME will need to be updated to actually build usages maps
export function buildESIIndex() : LabeledData<ESIData>[] {
  let api = esi.API.getLocalAPI();

  // This organizes everything into tags first
  let tagMap :Map<string, LabeledData<ESIData>> = new Map();

  for (let routeID of api.routeIDs) {
    let route = api.route(routeID)!;

    let tagIndex = tagMap.get(route.tag);
    if (tagIndex === undefined) {
      tagIndex = { label: route.tag, children: [] };
      tagMap.set(route.tag, tagIndex);
    }

    // Add the route to the tag's children
    let data = {
      key: routeID,
      label: route.httpMethod + ' ' + route.path,
      tag: route.tag,
      apiURL: route.path,
      httpMethod: route.httpMethod,
      docURL: route.docURL,
      description: route.description,
      usages: []
    };
    let label = route.httpMethod.toUpperCase() + ' ' + route.path.substring(1 + route.version.length);
    tagIndex.children!.push({ label, data });
  }

  return Array.from(tagMap.values());
}
