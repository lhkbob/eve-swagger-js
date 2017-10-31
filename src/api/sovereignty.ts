import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';

import * as r from '../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * in-game campaign or multiple campaigns. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all campaigns.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's campaign, or a collection related
 * to the key's campaign if multiple campaigns are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty) ESI endpoints.
 */
export interface CampaignAPI {
  details: esi.sovereignty.Campaign;
}

/**
 * An api adapter for accessing various details of a single in-game campaign,
 * specified by a provided id when the api is instantiated.
 */
export class Campaign extends r.impl.SimpleResource implements r.Async<CampaignAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @esi_route ~get_universe_campaigns
   *
   * @returns Information about the campaign
   */
  details() {
    return getCampaigns(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, r => r.campaign_id));
  }
}

/**
 * An api adapter for accessing various details of multiple campaign ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedCampaigns extends r.impl.SimpleMappedResource implements r.Mapped<CampaignAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @esi_route ~get_universe_campaigns
   *
   * @returns Campaign details mapped by campaign id
   */
  details() {
    return this.arrayIDs().then(ids => {
      return getCampaigns(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, r => r.campaign_id));
    });
  }
}

/**
 * An api adapter for accessing various details about every campaign in the
 * game.
 */
export class IteratedCampaigns extends r.impl.SimpleIteratedResource<esi.sovereignty.Campaign> implements r.Iterated<CampaignAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(
        () => agent.request('get_sovereignty_campaigns', undefined)), r => r.campaign_id);
  }

  /**
   * @esi_route get_universe_campaigns
   *
   * @returns Iterator over details of all in-game types
   */
  details() {
    return this.getPaginatedResource();
  }
}

/**
 * A functional interface for getting APIs for a specific campaign, a
 * known set of campaign ids, or every campaign in the game.
 */
export interface Campaigns {
  /**
   * Create a new campaign api targeting every single campaign in the game.
   *
   * @esi_route ids get_universe_types
   *
   * @returns An IteratedCampaigns API wrapper
   */
  (): IteratedCampaigns;

  /**
   * Create a new campaign api targeting the particular campaign by `id`.
   *
   * @param id The campaign id
   * @returns An Campaign API wrapper for the given id
   */
  (id: number): Campaign;

  /**
   * Create a new campaign api targeting the multiple campaign ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The campaign ids
   * @returns A MappedCampaigns API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedCampaigns;
}

/**
 * A simple wrapper around functional interfaces for getting APIs for campaigns,
 * sovereignty structures, and the sovereignty map. The sovereignty map is also
 * accessible through the solar system apis. These utilize the
 * [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty) ESI end points.
 */
export class Sovereignty {
  private campaigns_?:Campaigns;

  constructor(private agent:ESIAgent) { }

  get campaigns() :Campaigns {
    if (this.campaigns_ === undefined) {
      this.campaigns_ = makeCampaigns(this.agent);
    }
    return this.campaigns_;
  }

  /**
   * @returns Information on all structures involved in sovereignty
   *    conflicts
   */
  structures() : Promise<Responses['get_sovereignty_structures']> {
    return this.agent.request('get_sovereignty_structures', undefined);
  }

  /**
   * @returns The complete sovereignty map
   */
  map() :Promise<Responses['get_sovereignty_map']> {
    return this.agent.request('get_sovereignty_map', undefined);
  }
}

function makeCampaigns(agent: ESIAgent): Campaigns {
  return <Campaigns> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All types since no id
      return new IteratedCampaigns(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Campaign(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedCampaigns(agent, ids);
    }
  };
}

function getCampaigns(agent: ESIAgent) {
  return agent.request('get_sovereignty_campaigns', undefined);
}
