import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * in-game graphic or multiple graphics. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all graphics.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple graphics are being accessed at once.
 *
 * This is an API wrapper over the end points handling graphics in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI
 * endpoints.
 */
export interface GraphicAPI {
  details: Responses['get_universe_graphics_graphic_id'];
}

/**
 * An api adapter for accessing various details of a single in-game graphic,
 * specified by a provided id when the api is instantiated.
 */
export class Graphic extends r.impl.SimpleResource implements r.Async<GraphicAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the graphic
   */
  details() {
    return getDetails(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of multiple graphic ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedGraphics extends r.impl.SimpleMappedResource implements r.Mapped<GraphicAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns Graphic details mapped by graphic id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every graphic in
 * the game. Even though a route exists to get all graphic ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class IteratedGraphics extends r.impl.ArrayIteratedResource implements r.Iterated<GraphicAPI> {
  constructor(private agent: ESIAgent) {
    super(() => agent.request('get_universe_graphics', undefined));
  }

  /**
   * @returns Iterator over details of all in-game graphics
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific graphic, a
 * known set of graphic ids, or every graphic in the game.
 */
export interface Graphics {
  /**
   * Create a new graphic api targeting every single graphic in the game.
   *
   * @esi_route ids get_universe_graphics
   *
   * @returns An IteratedGraphics API wrapper
   */
  (): IteratedGraphics;

  /**
   * Create a new graphic api targeting the particular graphic by `id`.
   *
   * @param id The graphic id
   * @returns An Graphic API wrapper for the given id
   */
  (id: number): Graphic;

  /**
   * Create a new graphic api targeting the multiple graphic ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The graphic ids
   * @returns A MappedGraphics API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedGraphics;
}

/**
 * Create a new Graphics instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Graphics instance
 */
export function makeGraphics(agent: ESIAgent): Graphics {
  return <Graphics> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All graphics since no id
      return new IteratedGraphics(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Graphic(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedGraphics(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_graphics_graphic_id',
      { path: { graphic_id: id } });
}
