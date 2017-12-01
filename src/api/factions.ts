import { getNames, getIteratedNames } from '../internal/names';
import { makeDefaultSearch } from '../internal/search';
import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';

import * as r from '../internal/resource-api';
import { Corporation } from './corporation/corporations';
import { MappedSolarSystems } from './universe/solar-systems';

/**
 * The API specification for all variants that access information about an
 * faction or multiple factions. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all factions.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple factions are being accessed at once.
 *
 * This is an API wrapper over the end points handling factions via functions
 * in the [faction warfare](https://esi.tech.ccp.is/latest/#/Faction_Warfare)
 * and [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface FactionAPI {
  details: esi.universe.Faction;
  stats: esi.factionwarfare.FactionStatistics;
  wars: Set<number>;
  owned: esi.factionwarfare.System[];
  occupied: esi.factionwarfare.System[];
  names: string;
}

/**
 * An api adapter for accessing various details of a single faction, specified
 * by a provided id when the api is instantiated.
 */
export class Faction extends r.impl.SimpleResource implements r.Async<FactionAPI> {
  private corp_?: Corporation;
  private militia_?: Corporation;
  private owned_?: MappedSolarSystems;
  private occupied_?: MappedSolarSystems;

  constructor(private agent: ESIAgent, id_: number) {
    super(id_);
  }

  /**
   * @esi_route ~get_universe_factions
   *
   * @returns The public info of the faction
   */
  details() {
    return getFactions(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.faction_id));
  }

  /**
   * @esi_route ~get_universe_factions
   *
   * @returns The name of the faction
   */
  names() {
    return this.details().then(d => d.name);
  }

  /**
   * @esi_route ~get_fw_stats
   *
   * @returns The faction warfare statistics for this faction
   */
  stats() {
    return getStats(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.faction_id));
  }

  /**
   * @esi_route ~get_fw_wars
   *
   * @returns The faction ids of factions involved in war with this faction
   */
  wars() {
    return getWars(this.agent).then(all => getWarsForFaction(all, this.id_));
  }

  /**
   * @esi_route ~get_fw_systems
   *
   * @returns The statuses of all systems owned by the faction's militia
   */
  owned() {
    return getSystems(this.agent).then(all => getOwnedSystems(all, this.id_));
  }

  /**
   * @esi_route ~get_fw_systems
   *
   * @returns The statuses of all systems occupied by the faction's militia
   */
  occupied() {
    return getSystems(this.agent)
    .then(all => getOccupiedSystems(all, this.id_));
  }

  /**
   * @esi_route ids ~get_universe_factions
   *
   * @returns A Corporation API instance linked with the corporation id of the
   *     faction
   */
  get corporation(): Corporation {
    if (this.corp_ === undefined) {
      this.corp_ = new Corporation(this.agent,
          () => this.details().then(d => d.corporation_id));
    }
    return this.corp_;
  }

  /**
   * @esi_route ids ~get_universe_factions
   *
   * @returns A Corporation API instance linked with the militia corporation of
   *     the faction
   */
  get militia(): Corporation {
    if (this.militia_ === undefined) {
      this.militia_ = new Corporation(this.agent,
          () => this.details().then(d => d.militia_corporation_id || 0));
    }
    return this.militia_;
  }

  /**
   * @esi_route ids ~get_fw_systems [owned]
   *
   * @returns A MappedSolarSystems API dynamically linked with solar system ids
   *     that are owned by the faction's militia
   */
  get ownedSystems(): MappedSolarSystems {
    if (this.owned_ === undefined) {
      this.owned_ = new MappedSolarSystems(this.agent, () => this.owned()
      .then(systems => systems.map(s => s.owner_faction_id)));
    }
    return this.owned_;
  }

  /**
   * @esi_route ids ~get_fw_systems [occupied]
   *
   * @returns A MappedSolarSystems API dynamically linked with the solar system
   *     ids that are occupied by the faction's militia
   */
  get occupiedSystems(): MappedSolarSystems {
    if (this.occupied_ === undefined) {
      this.occupied_ = new MappedSolarSystems(this.agent, () => this.owned()
      .then(systems => systems.map(s => s.occupier_faction_id)));
    }
    return this.occupied_;
  }
}

/**
 * An api adapter for accessing various details of multiple faction, specified
 * by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
export class MappedFactions extends r.impl.SimpleMappedResource implements r.Mapped<FactionAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @esi_route ~get_universe_factions
   *
   * @returns The public info of the factions, mapped by id
   */
  details() {
    return this.arrayIDs()
    .then(ids => getFactions(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.faction_id)));
  }

  /**
   * @esi_route ~get_universe_factions
   *
   * @returns The names of the factions, mapped by id
   */
  names() {
    return this.details().then(map => {
      let remap = new Map();
      for (let [k, v] of map.entries()) {
        remap.set(k, v.name);
      }
      return remap;
    });
  }

  /**
   * @esi_route ~get_fw_stats
   *
   * @returns The faction warfare statistics for the factions, mapped by id
   */
  stats() {
    return this.arrayIDs().then(ids => getStats(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.faction_id)));
  }

  /**
   * @esi_route ~get_fw_wars
   *
   * @returns The faction ids involved in wars against each faction
   */
  wars() {
    return this.arrayIDs().then(ids => getWars(this.agent).then(wars => {
      let mapped = new Map();
      for (let id of ids) {
        mapped.set(id, getWarsForFaction(wars, id));
      }

      return mapped;
    }));
  }

  /**
   * @esi_route ~get_fw_systems [owned]
   *
   * @returns The statuses of all systems owned by the faction's militia
   */
  owned() {
    return this.arrayIDs().then(ids => getSystems(this.agent).then(all => {
      let mapped = new Map();
      for (let id of ids) {
        mapped.set(id, getOwnedSystems(all, id));
      }
      return mapped;
    }));
  }

  /**
   * @esi_route ~get_fw_systems [occupied]
   *
   * @returns The statuses of all systems occupied by the faction's militia
   */
  occupied() {
    return this.arrayIDs().then(ids => getSystems(this.agent)
    .then(all => {
      let mapped = new Map();
      for (let id of ids) {
        mapped.set(id, getOccupiedSystems(all, id));
      }
      return mapped;
    }));
  }
}

/**
 * An api adapter for accessing various details about every faction in the
 * game. Even though a route exists to get all faction ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class IteratedFactions extends r.impl.SimpleIteratedResource<esi.universe.Faction> implements r.Iterated<FactionAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(() => getFactions(agent)),
        e => e.faction_id);
  }

  /**
   * @esi_route get_universe_factions
   *
   * @returns Iterator for details of every faction
   */
  details() {
    return this.getPaginatedResource();
  }

  /**
   * @esi_route ~get_universe_factions
   *
   * @returns Iterator for the names of every faction
   */
  async * names() {
    for await (let [id, details] of this.details()) {
      yield <[number, string]> [id, details.name];
    }
  }

  /**
   * @esi_route get_fw_stats
   *
   * @returns Iterator over stats of every faction
   */
  async * stats() {
    let stats = await getStats(this.agent);
    for (let s of stats) {
      yield <[number, esi.factionwarfare.FactionStatistics]> [s.faction_id, s];
    }
  }

  /**
   * @esi_route get_fw_wars
   *
   * @returns Iterator over the wars each faction is involved in
   */
  async * wars() {
    let wars = await getWars(this.agent);
    let groups: Map<number, Set<number>> = new Map();

    for (let w of wars) {
      let f1 = groups.get(w.faction_id);
      let f2 = groups.get(w.against_id);

      if (f1 === undefined) {
        f1 = new Set();
        groups.set(w.faction_id, f1);
      }
      if (f2 === undefined) {
        f2 = new Set();
        groups.set(w.faction_id, f2);
      }

      f1.add(w.against_id);
      f2.add(w.faction_id);
    }

    // Now that they are grouped, yield each one
    yield* groups.entries();
  }

  /**
   * @esi_route get_fw_systems [owned]
   *
   * @returns Iterator over the systems owned by each faction
   */
  async * owned() {
    let systems = await getSystems(this.agent);
    let groups: Map<number, esi.factionwarfare.System[]> = new Map();

    for (let s of systems) {
      let owned = groups.get(s.owner_faction_id);
      if (owned === undefined) {
        owned = [s];
        groups.set(s.owner_faction_id, owned);
      } else {
        owned.push(s);
      }
    }

    yield* groups.entries();
  }

  /**
   * @esi_route get_fw_systems [occupied]
   *
   * @returns Iterator over the systems occupied by each faction
   */
  async * occupied() {
    let systems = await getSystems(this.agent);
    let groups: Map<number, esi.factionwarfare.System[]> = new Map();

    for (let s of systems) {
      let occupied = groups.get(s.occupier_faction_id);
      if (occupied === undefined) {
        occupied = [s];
        groups.set(s.occupier_faction_id, occupied);
      } else {
        occupied.push(s);
      }
    }

    yield* groups.entries();
  }
}

/**
 * API wrapper around faction warfare leaderboards, measuring performance
 * over the recent past.
 */
export class Leaderboard {
  constructor(private agent: ESIAgent) {
  }

  /**
   * @returns Leaderboard of factions in faction warfare
   */
  forFactions(): Promise<Responses['get_fw_leaderboards']> {
    return this.agent.request('get_fw_leaderboards', undefined);
  }

  /**
   * @returns Leaderboard of characters participating in faction warfare
   */
  forCharacters(): Promise<Responses['get_fw_leaderboards_characters']> {
    return this.agent.request('get_fw_leaderboards_characters', undefined);
  }

  /**
   * @returns Leaderboard of militia corporations participating in faction
   *     warfare
   */
  forCorporations(): Promise<Responses['get_fw_leaderboards_corporations']> {
    return this.agent.request('get_fw_leaderboards_corporations', undefined);
  }
}

/**
 * A functional interface for getting APIs for a specific faction, a known
 * set of faction ids, the factions returned by a search query, or every
 * faction in the game.
 *
 * Additionally exposes the faction warfare leaderboard and faction warfare
 * system map.
 */
export interface Factions {
  /**
   * Create a new faction api targeting every single faction in the game.
   *
   * @esi_route ids get_factions
   *
   * @returns An AllFactions API wrapper
   */
  (): IteratedFactions;

  /**
   * Create a new faction api targeting the particular faction by `id`.
   *
   * @param id The faction id
   * @returns An Faction API wrapper for the given id
   */
  (id: number): Faction;

  /**
   * Create a new faction api targeting the multiple faction ids. If an
   * array is provided, duplicates are removed (although the input array
   * is not modified).
   *
   * @param ids The faction ids
   * @returns A MappedFactions API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedFactions;

  /**
   * Create a new faction api targeting the factions returned from a
   * search given the `query` text.
   *
   * @esi_route ids get_search [faction]
   *
   * @param query The search terms
   * @param strict Whether or not the search is strict, defaults to false
   * @returns A MappedFactions API which accesses factions based on the
   *    dynamic search results
   */
  (query: string, strict?: boolean): MappedFactions;

  /**
   * @returns The raw solar systems status for each faction
   */
  systemStatuses(): Promise<Responses['get_fw_systems']>;

  readonly leaderboard: Leaderboard;
}

/**
 * Create a new factions API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Factions
 */
export function makeFactions(agent: ESIAgent): Factions {
  // First create a search function for factions using the agent
  const factionSearch = makeDefaultSearch(agent, esi.SearchCategory.FACTION);

  let factions = <Factions> function (ids: number | number[] | Set<number> | string | undefined,
      strict: boolean = false) {
    if (ids === undefined) {
      // No argument
      return new IteratedFactions(agent);
    } else if (typeof ids === 'number') {
      // Single id variant
      return new Faction(agent, ids);
    } else if (typeof ids === 'string') {
      // Search variant that uses the IDSetProvider variant
      return new MappedFactions(agent, () => factionSearch(ids, strict));
    } else {
      // Either a set or an array
      return new MappedFactions(agent, ids);
    }
  };

  factions.systemStatuses = function () {
    return agent.request('get_fw_systems', undefined);
  };

  (factions as any).leaderboard = new Leaderboard(agent);

  return factions;
}

function getWarsForFaction(wars: esi.factionwarfare.War[],
    faction: number): Set<number> {
  let forFaction = new Set();
  for (let w of wars) {
    if (w.faction_id === faction) {
      forFaction.add(w.against_id);
    } else if (w.against_id === faction) {
      forFaction.add(w.faction_id);
    }
  }
  return forFaction;
}

function getOwnedSystems(systems: esi.factionwarfare.System[],
    faction: number): esi.factionwarfare.System[] {
  return systems.filter(s => s.owner_faction_id === faction);
}

function getOccupiedSystems(systems: esi.factionwarfare.System[],
    faction: number): esi.factionwarfare.System[] {
  return systems.filter(s => s.occupier_faction_id === faction);
}

function getFactions(agent: ESIAgent) {
  return agent.request('get_universe_factions', undefined);
}

function getStats(agent: ESIAgent) {
  return agent.request('get_fw_stats', undefined);
}

function getWars(agent: ESIAgent) {
  return agent.request('get_fw_wars', undefined);
}

function getSystems(agent: ESIAgent) {
  return agent.request('get_fw_systems', undefined);
}
