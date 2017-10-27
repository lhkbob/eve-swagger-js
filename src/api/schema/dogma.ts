import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about a dogma
 * attribute or multiple attributes. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
    * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all attributes.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple attributes are being accessed at once.
 *
 * This is an API wrapper over the end points handling dogma attributes in the
 * [dogma](https://esi.tech.ccp.is/latest/#/Dogma) ESI endpoints.
 */
export interface AttributeAPI {
  details: Responses['get_dogma_attributes_attribute_id'];
}

/**
 * An api adapter for accessing various details of a single dogma attribute,
 * specified by a provided id when the api is instantiated.
 */
export class Attribute extends r.impl.SimpleResource implements r.Async<AttributeAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the dogma attribute
   */
  details() {
    return getAttribute(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of multiple dogma attributes,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedAttributes extends r.impl.SimpleMappedResource implements r.Mapped<AttributeAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns Attribute details mapped by group id
   */
  details() {
    return this.getResource(id => getAttribute(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every dogma attribute in
 * the game. Even though a route exists to get all attribute ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class AllAttributes extends r.impl.ArrayIteratedResource implements r.Iterated<AttributeAPI> {
  constructor(private agent: ESIAgent) {
    super(() => agent.request('get_dogma_attributes', undefined));
  }

  /**
   * @returns Iterator over details of all dogma attributes
   */
  details() {
    return this.getResource(id => getAttribute(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific dogma attribute, a
 * known set of attribute ids, or every dogma attribute in the game.
 */
export interface AttributeAPIFactory {
  /**
   * Create a new dogma attribute api targeting every single attribute in the
   * game.
   *
   * @esi_route ids get_dogma_attributes
   *
   * @returns An AllDogmaAttributes API wrapper
   */
  (): AllAttributes;

  /**
   * Create a new dogma attribute api targeting the particular attribute by
   * `id`.
   *
   * @param id The attribute id
   * @returns An DogmaAttribute API wrapper for the given id
   */
  (id: number): Attribute;

  /**
   * Create a new dogma attribute api targeting the multiple attribute ids. If
   * an array is provided, duplicates are removed (although the input array is
   * not modified).
   *
   * @param ids The attribute ids
   * @returns A MappedDogmaAttributes API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedAttributes;
}

/**
 * The API specification for all variants that access information about a dogma
 * effect or multiple attributes. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
    * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all effects.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple effects are being accessed at once.
 *
 * This is an API wrapper over the end points handling dogma effects in the
 * [dogma](https://esi.tech.ccp.is/latest/#/Dogma) ESI endpoints.
 */
export interface EffectAPI {
  details: Responses['get_dogma_effects_effect_id'];
}

/**
 * An api adapter for accessing various details of a single dogma effect,
 * specified by a provided id when the api is instantiated.
 */
export class Effect extends r.impl.SimpleResource implements r.Async<EffectAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the dogma attribute
   */
  details() {
    return getEffect(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of multiple dogma effects,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedEffects extends r.impl.SimpleMappedResource implements r.Mapped<EffectAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns Attribute details mapped by group id
   */
  details() {
    return this.getResource(id => getEffect(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every dogma effect in
 * the game. Even though a route exists to get all effect ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class AllEffects extends r.impl.ArrayIteratedResource implements r.Iterated<EffectAPI> {
  constructor(private agent: ESIAgent) {
    super(() => agent.request('get_dogma_effects', undefined));
  }

  /**
   * @returns Iterator over details of all dogma effects
   */
  details() {
    return this.getResource(id => getEffect(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific dogma effect, a
 * known set of effect ids, or every dogma effect in the game.
 */
export interface EffectAPIFactory {
  /**
   * Create a new dogma effect api targeting every single effect in the
   * game.
   *
   * @esi_route ids get_dogma_effects
   *
   * @returns An AllDogmaEffects API wrapper
   */
  (): AllEffects;

  /**
   * Create a new dogma attribute api targeting the particular attribute by
   * `id`.
   *
   * @param id The attribute id
   * @returns An DogmaEffect API wrapper for the given id
   */
  (id: number): Effect;

  /**
   * Create a new dogma effect api targeting the multiple effect ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The effect ids
   * @returns A MappedDogmaEffects API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedEffects;
}

/**
 * A simple wrapper around functional interfaces for getting APIs for dogma
 * attributes and effects, both of which utilize the
 * [dogma](https://esi.tech.ccp.is/latest/#/Dogma) ESI end points.
 */
export interface DogmaFactory {
  /**
   * An instance of AttributeAPIFactory using the previously specified agent.
   */
  readonly attributes: AttributeAPIFactory;

  /**
   * An instance of EffectAPIFactory using the previously specified agent.
   */
  readonly effects: EffectAPIFactory;
}

/**
 * Create a new DogmaFactory instance that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Dogma API instance
 */
export function makeDogmaFactory(agent: ESIAgent): DogmaFactory {
  let attributes = <AttributeAPIFactory> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // No ids so all groups
      return new AllAttributes(agent);
    } else if (typeof ids === 'number') {
      // Single id for a group
      return new Attribute(agent, ids);
    } else {
      // Mapped groups
      return new MappedAttributes(agent, ids);
    }
  };

  let effects = <EffectAPIFactory> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // No ids so all tasks
      return new AllEffects(agent);
    } else if (typeof ids === 'number') {
      // Single id for a task
      return new Effect(agent, ids);
    } else {
      // Mapped tasks
      return new MappedEffects(agent, ids);
    }
  };

  return { attributes, effects };
}

function getAttribute(agent: ESIAgent, id: number) {
  return agent.request('get_dogma_attributes_attribute_id',
      { path: { attribute_id: id } });
}

function getEffect(agent: ESIAgent, id: number) {
  return agent.request('get_dogma_effects_effect_id',
      { path: { effect_id: id } });
}
