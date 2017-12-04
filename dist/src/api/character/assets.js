"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const batch_1 = require("../../internal/batch");
const r = require("../../internal/resource-api");
const ASSET_BATCH_SIZE = 1000;
/**
 * An api adapter for accessing various details of a single character asset,
 * specified by a provided id when the api is instantiated.
 */
class Asset extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_characters_character_id_assets
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
     * @esi_route post_characters_character_id_assets_locations
     *
     * @returns The location of the specific asset
     */
    locations() {
        return getAssetLocations(this.agent, [this.id_]).then(result => result[0]);
    }
    /**
     * @esi_route post_characters_character_id_assets_names
     *
     * @returns The name of the specific asset, for when the asset can have a
     *     user-specified name
     */
    names() {
        return getAssetNames(this.agent, [this.id_])
            .then(result => result[0].name);
    }
}
exports.Asset = Asset;
/**
 * An api adapter for accessing various details of multiple asset ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedAssets extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_characters_character_id_assets
     *
     * @returns Asset details mapped by asset id
     */
    details() {
        if (this.assets_ === undefined) {
            this.assets_ = getAssets(this.agent);
        }
        return this.arrayIDs()
            .then(ids => r.impl.filterIteratedToMap(this.assets_(), ids, e => e.item_id));
    }
    /**
     * @esi_route post_characters_character_id_assets_locations
     *
     * @returns Asset locations mapped by asset id
     */
    locations() {
        return this.arrayIDs()
            .then(ids => batch_1.getBatchedValues(ids, idSet => getAssetLocations(this.agent, idSet), n => [n.item_id, n], ASSET_BATCH_SIZE));
    }
    /**
     * @esi_route post_characters_character_id_assets_names
     *
     * @returns Asset names mapped by asset id
     */
    names() {
        return this.arrayIDs()
            .then(ids => batch_1.getBatchedValues(ids, idSet => getAssetNames(this.agent, idSet), n => [n.item_id, n.name], ASSET_BATCH_SIZE));
    }
}
exports.MappedAssets = MappedAssets;
/**
 * An api adapter for accessing various details about every asset of the
 * character.
 */
class IteratedAssets extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(getAssets(agent), e => e.item_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_characters_character_id_assets
     *
     * @returns Iterator over details of all a character's assets
     */
    details() {
        return this.getPaginatedResource();
    }
    /**
     * @esi_route post_characters_character_id_assets_locations
     *
     * @returns All asset locations
     */
    locations() {
        return batch_1.getIteratedValues(this.ids(), idSet => getAssetLocations(this.agent, idSet), n => [n.item_id, n], ASSET_BATCH_SIZE);
    }
    /**
     * @esi_route post_characters_character_id_assets_names
     *
     * @returns All asset names
     */
    names() {
        return batch_1.getIteratedValues(this.ids(), idSet => getAssetNames(this.agent, idSet), n => [n.item_id, n.name], ASSET_BATCH_SIZE);
    }
}
exports.IteratedAssets = IteratedAssets;
/**
 * Create a new Assets instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * character id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * character.
 *
 * @param agent The agent making actual requests
 * @returns A Assets instance
 */
function makeAssets(agent) {
    let assets = function (ids) {
        if (ids === undefined) {
            // All types since no id
            return new IteratedAssets(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Asset(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedAssets(agent, ids);
        }
    };
    // Add additional functions
    let bpStreamer;
    assets.blueprints = function () {
        if (bpStreamer === undefined) {
            bpStreamer = r.impl.makePageBasedStreamer(page => getBlueprints(agent, page)
                .then(result => ({ result, maxPages: undefined })), 1000);
        }
        return bpStreamer();
    };
    return assets;
}
exports.makeAssets = makeAssets;
function getAssets(agent) {
    return r.impl.makePageBasedStreamer(page => getAssetsPage(agent, page)
        .then(result => ({ result, maxPage: undefined })), 5000);
}
function getBlueprints(agent, page) {
    return agent.agent.request('get_characters_character_id_blueprints', { path: { character_id: agent.id }, query: { page: page } }, agent.ssoToken);
}
function getAssetsPage(agent, page) {
    return agent.agent.request('get_characters_character_id_assets', { path: { character_id: agent.id }, query: { page: page } }, agent.ssoToken);
}
function getAssetNames(agent, ids) {
    return agent.agent.request('post_characters_character_id_assets_names', { path: { character_id: agent.id }, body: ids }, agent.ssoToken);
}
function getAssetLocations(agent, ids) {
    return agent.agent.request('post_characters_character_id_assets_locations', { path: { character_id: agent.id }, body: ids }, agent.ssoToken);
}
//# sourceMappingURL=assets.js.map