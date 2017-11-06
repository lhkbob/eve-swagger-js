import { SSOAgent } from '../../internal/esi-agent';
import { getBatchedValues, getIteratedValues } from '../../internal/batch';
import { esi } from '../../esi';

import * as r from '../../internal/resource-api';

const ASSET_BATCH_SIZE = 1000;

/**
 * The API specification for all variants that access information about a
 * corporation's asset or multiple assets. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all assets.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's asset, or a collection related
 * to the key's asset if multiple assets are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [assets](https://esi.tech.ccp.is/latest/#/Assets) ESI endpoints.
 */
export interface AssetAPI {
  details: esi.corporation.asset.Asset;
  locations: esi.AssetLocation;
  names: string;
}

/**
 * An api adapter for accessing various details of a single corporation asset,
 * specified by a provided id when the api is instantiated.
 */
export class Asset extends r.impl.SimpleResource implements r.Async<AssetAPI> {
  private assets_?: r.impl.ResourceStreamer<esi.corporation.asset.Asset>;

  constructor(private agent: SSOAgent, id: number) {
    super(id);
  }

  /**
   * @esi_route ~get_corporations_corporation_id_assets
   *
   * @returns Information about the asset
   */
  details() {
    if (this.assets_ === undefined) {
      this.assets_ = getAssets(this.agent);
    }
    return r.impl.filterIterated(this.assets_(), this.id_, e => e.item_id);
  }

  /**
   * @esi_route post_corporations_corporation_id_assets_locations
   *
   * @returns The location of the specific asset
   */
  locations() {
    return getAssetLocations(this.agent, [this.id_]).then(result => result[0]);
  }

  /**
   * @esi_route post_corporations_corporation_id_assets_names
   *
   * @returns The name of the specific asset, for when the asset can have a
   *     user-specified name
   */
  names() {
    return getAssetNames(this.agent, [this.id_])
    .then(result => result[0].name);
  }
}

/**
 * An api adapter for accessing various details of multiple asset ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedAssets extends r.impl.SimpleMappedResource implements r.Mapped<AssetAPI> {
  private assets_?: r.impl.ResourceStreamer<esi.corporation.asset.Asset>;

  constructor(private agent: SSOAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @esi_route ~get_corporations_corporation_id_assets
   *
   * @returns Asset details mapped by asset id
   */
  details() {
    if (this.assets_ === undefined) {
      this.assets_ = getAssets(this.agent);
    }
    return this.arrayIDs()
    .then(ids => r.impl.filterIteratedToMap(this.assets_!(), ids,
        e => e.item_id));
  }

  /**
   * @esi_route post_corporations_corporation_id_assets_locations
   *
   * @returns Asset locations mapped by asset id
   */
  locations() {
    return this.arrayIDs()
    .then(ids => getBatchedValues(ids,
        idSet => getAssetLocations(this.agent, idSet), n => [n.item_id, n],
        ASSET_BATCH_SIZE));
  }

  /**
   * @esi_route post_corporations_corporation_id_assets_names
   *
   * @returns Asset names mapped by asset id
   */
  names() {
    return this.arrayIDs()
    .then(
        ids => getBatchedValues(ids, idSet => getAssetNames(this.agent, idSet),
            n => [n.item_id, n.name], ASSET_BATCH_SIZE));
  }
}

/**
 * An api adapter for accessing various details about every asset of the
 * corporation.
 */
export class IteratedAssets extends r.impl.SimpleIteratedResource<esi.corporation.asset.Asset> implements r.Iterated<AssetAPI> {
  constructor(private agent: SSOAgent) {
    super(getAssets(agent), e => e.item_id);
  }

  /**
   * @esi_route get_corporations_corporation_id_assets
   *
   * @returns Iterator over details of all a corporation's assets
   */
  details() {
    return this.getPaginatedResource();
  }

  /**
   * @esi_route post_corporations_corporation_id_assets_locations
   *
   * @returns All asset locations
   */
  locations() {
    return getIteratedValues(this.ids(),
        idSet => getAssetLocations(this.agent, idSet), n => [n.item_id, n],
        ASSET_BATCH_SIZE);
  }

  /**
   * @esi_route post_corporations_corporation_id_assets_names
   *
   * @returns All asset names
   */
  names() {
    return getIteratedValues(this.ids(),
        idSet => getAssetNames(this.agent, idSet), n => [n.item_id, n.name],
        ASSET_BATCH_SIZE);
  }
}

/**
 * A functional interface for getting APIs for a specific asset, a
 * known set of asset ids, or every asset for a corporation.
 */
export interface Assets {
  /**
   * Create a new asset api targeting every single asset of the corporation.
   *
   * @returns An IteratedAssets API wrapper
   */
  (): IteratedAssets;

  /**
   * Create a new asset api targeting the particular asset by `id`.
   *
   * @param id The asset id
   * @returns An Asset API wrapper for the given id
   */
  (id: number): Asset;

  /**
   * Create a new asset api targeting the multiple asset ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The asset ids
   * @returns A MappedAssets API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedAssets;

  /**
   * @esi_route get_corporations_corporation_id_containers_logs
   *
   * @returns The container logs for all audit-able containers owned by a corp
   */
  containerLogs(): AsyncIterableIterator<esi.corporation.asset.ContainersLog>;

  /**
   * @esi_route get_corporations_corporation_id_blueprints
   *
   * @returns All blueprints owned by a corporation
   */
  blueprints(): AsyncIterableIterator<esi.corporation.asset.Blueprint>;

  /**
   * @esi_route ~get_corporations_corporation_id_divisions
   *
   * @returns The hangar divisions of a corp, mapped from division to name
   */
  hangarDivisions(): Promise<Map<number, string>>;
}

/**
 * Create a new Assets instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * corporation id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * corporation.
 *
 * @param agent The agent making actual requests
 * @returns A Assets instance
 */
export function makeAssets(agent: SSOAgent): Assets {
  let assets = <Assets> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All types since no id
      return new IteratedAssets(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Asset(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedAssets(agent, ids);
    }
  };

  // Add additional functions
  let logStreamer: r.impl.ResourceStreamer<esi.corporation.asset.ContainersLog> | undefined;
  assets.containerLogs = function () {
    if (logStreamer === undefined) {
      logStreamer = r.impl.makePageBasedStreamer(page => agent.agent.request(
          'get_corporations_corporation_id_containers_logs',
          { path: { corporation_id: agent.id }, query: { page: page } },
          agent.ssoToken)
      .then(result => ({ result, maxPages: undefined })), 1000);
    }
    return logStreamer();
  };

  let bpStreamer: r.impl.ResourceStreamer<esi.corporation.asset.Blueprint> | undefined;
  assets.blueprints = function () {
    if (bpStreamer === undefined) {
      bpStreamer = r.impl.makePageBasedStreamer(page => agent.agent.request(
          'get_corporations_corporation_id_blueprints',
          { path: { corporation_id: agent.id }, query: { page: page } },
          agent.ssoToken)
      .then(result => ({ result, maxPages: undefined })), 1000);
    }
    return bpStreamer();
  };

  return assets;
}

function getAssets(agent: SSOAgent) {
  return r.impl.makePageBasedStreamer(page => getAssetsPage(agent, page)
  .then(result => ({ result, maxPage: undefined })), 5000);
}

function getAssetsPage(agent: SSOAgent, page: number) {
  return agent.agent.request('get_corporations_corporation_id_assets',
      { path: { corporation_id: agent.id }, query: { page: page } },
      agent.ssoToken);
}

function getAssetNames(agent: SSOAgent, ids: number[]) {
  return agent.agent.request('post_corporations_corporation_id_assets_names',
      { path: { corporation_id: agent.id }, body: ids }, agent.ssoToken);
}

function getAssetLocations(agent: SSOAgent, ids: number[]) {
  return agent.agent.request(
      'post_corporations_corporation_id_assets_locations',
      { path: { corporation_id: agent.id }, body: ids }, agent.ssoToken);
}
