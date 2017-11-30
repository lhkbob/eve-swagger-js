import { SSOAgent } from '../../internal/esi-agent';
import * as r from '../../internal/resource-api';
import { esi, Responses } from '../../esi';

/**
 * The API specification for all variants that access information about a
 * character's planetery interaction colony or colonies. This interface will not
 * be used directly, but will be filtered through some mapper, such as {@link
 * Async} or {@link Mapped} depending on what types of ids are being accessed.
 * However, this allows for a concise and consistent specification for all
 * variants: single, multiple, and all colonies.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related
 * to the key's member if multiple colonies are being accessed at once.
 *
 * An api adapter over the end points handling a specific colony via functions
 * in the [planetary
 * interaction](https://esi.tech.ccp.is/latest/#Planetary_Interaction) ESI
 * endpoints.
 */
export interface ColonyAPI {
  summary: esi.character.planetaryinteraction.PlanetSummary;
  details: Responses['get_characters_character_id_planets_planet_id'];
}

/**
 * An api adapter for accessing various details of a single planetary colony,
 * specified by a provided planet id when the api is instantiated.
 */
export class Colony extends r.impl.SimpleResource implements r.Async<ColonyAPI> {
  constructor(private agent: SSOAgent<number>, id: number) {
    super(id);
  }

  /**
   * @esi_route ~get_characters_character_id_planets
   *
   * @returns The colony summary for the specific planet id
   */
  summary() {
    return getColonies(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.planet_id));
  }

  /**
   * @returns The colony factory configuration for the planet
   */
  details() {
    return getPlanet(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of multiple colony ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedColonies extends r.impl.SimpleMappedResource implements r.Mapped<ColonyAPI> {
  constructor(private agent: SSOAgent<number>, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @esi_route ~get_characters_character_id_planets
   *
   * @returns The colony summaries for the specified planets, mapped by id
   */
  summary() {
    return this.arrayIDs()
    .then(ids => getColonies(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.planet_id)));
  }

  /**
   * @returns The colony factory configurations, mapped by id
   */
  details() {
    return this.getResource(id => getPlanet(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every colony of the
 * character.
 */
export class IteratedColonies extends r.impl.SimpleIteratedResource<esi.character.planetaryinteraction.PlanetSummary> implements r.Iterated<ColonyAPI> {
  constructor(private agent: SSOAgent<number>) {
    super(r.impl.makeArrayStreamer(() => getColonies(agent)), e => e.planet_id);
  }

  /**
   * @esi_route get_characters_character_id_planets
   *
   * @returns The colony summaries for each of the character's PI planets
   */
  summary() {
    return this.getPaginatedResource();
  }

  /**
   * @returns The colony factory configurations for each of the PI colonies
   */
  details() {
    return this.getResource(id => getPlanet(this.agent, id));
  }
}

/**
 * An api adapter over the end points handling the planetary interaction
 * colonies for a character via functions in the [planetary
 * interaction](https://esi.tech.ccp.is/latest/#/Planetary_Interaction) ESI
 * endpoints.
 */
export interface Colonies {
  /**
   * Create a new colonies api targeting every PI planet of the character.
   *
   * @returns An IteratedColonies API wrapper
   */
  (): IteratedColonies;

  /**
   * Create a new colony api targeting the particular planet by `id`.
   *
   * @param id The planet id
   * @returns A Colony API wrapper for the given id
   */
  (id: number): Colony;

  /**
   * Create a new colonies api targeting the multiple planet ids. If an array is
   * provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The planet ids
   * @returns A MappedColonies API wrapper
   */
  (ids: number[] | Set<number>): MappedColonies;
}

/**
 * Create a new {@link Colonies} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Colonies API instance
 */
export function makeColonies(agent: SSOAgent<number>): Colonies {
  return <Colonies> <any> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All colonies
      return new IteratedColonies(agent);
    } else if (typeof ids === 'number') {
      // Single colony
      return new Colony(agent, ids);
    } else {
      // Mapped colonies
      return new MappedColonies(agent, ids);
    }
  };
}

function getPlanet(agent: SSOAgent<number>, id: number) {
  return agent.agent.request('get_characters_character_id_planets_planet_id',
      { path: { character_id: agent.id, planet_id: id } }, agent.ssoToken);
}

function getColonies(agent: SSOAgent<number>) {
  return agent.agent.request('get_characters_character_id_planets',
      { path: { character_id: agent.id } }, agent.ssoToken);
}