import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';

/**
 * An api adapter that provides functions for accessing a particular dogma
 * attribute, specified by id via functions in the
 * [dogma](https://esi.evetech.net/latest/#/Dogma) ESI endpoints.
 */
export interface Attribute {
  /**
   * @esi_example esi.dogma.attributes(id).info()
   *
   * @returns Information on the specific dogma attribute
   */
  info(): Promise<Responses['get_dogma_attributes_attribute_id']>;
}

/**
 * An api adapter over the end points handling multiple dogma attributes via
 * functions in the [dogma](https://esi.evetech.net/latest/#/Dogma)
 * ESI endpoints.
 */
export interface Attributes {
  /**
   * @esi_example esi.dogma.attributes()
   *
   * @returns All attribute ids
   */
  (): Promise<Responses['get_dogma_attributes']>;

  /**
   * Create a new Attribute end point targeting the particular attribute by
   * `id`.
   *
   * @param id The attribute id
   * @returns An Attribute API wrapper for the id
   */
  (id: number): Attribute;
}

/**
 * An api adapter that provides functions for accessing a particular dogma
 * effect, specified by id via functions in the
 * [dogma](https://esi.evetech.net/latest/#/Dogma) ESI endpoints.
 */
export interface Effect {
  /**
   * @esi_example esi.dogma.effects(id).info()
   *
   * @returns Information on the specific dogma effect
   */
  info(): Promise<Responses['get_dogma_effects_effect_id']>;
}

/**
 * An api adapter over the end points handling multiple dogma effects via
 * functions in the [dogma](https://esi.evetech.net/latest/#/Dogma)
 * ESI endpoints.
 */
export interface Effects {
  /**
   * @esi_example esi.dogma.effects()
   *
   * @returns All effect ids
   */
  (): Promise<Responses['get_dogma_effects']>;

  /**
   * Create a new Effect end point targeting the particular effect by `id`.
   *
   * @param id The effect id
   * @returns An Effect API wrapper for the id
   */
  (id: number): Effect;
}

/**
 * An api adapter over the end points accessing dogma effects and attributes via
 * functions in the [dogma](https://esi.evetech.net/latest/#/Dogma) ESI
 * endpoints.
 */
export interface Dogma {
  /**
   * An instance of {@link Attributes} for all dogma attributes.
   */
  attributes: Attributes;

  /**
   * An instance of {@link Effects} for all dogma effects.
   */
  effects: Effects;
}

/**
 * Create a new {@link Dogma} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Dogma API instance
 */
export function makeDogma(agent: ESIAgent): Dogma {
  let attributes = <Attributes> <any> function (id?: number) {
    if (id === undefined) {
      return agent.request('get_dogma_attributes', undefined);
    } else {
      return new AttributeImpl(agent, id);
    }
  };

  let effects = <Effects> <any> function (id?: number) {
    if (id === undefined) {
      return agent.request('get_dogma_effects', undefined);
    } else {
      return new EffectImpl(agent, id);
    }
  };

  return { attributes, effects };
}

class AttributeImpl implements Attribute {
  constructor(private agent: ESIAgent, private id: number) {
  }

  info() {
    return this.agent.request('get_dogma_attributes_attribute_id',
        { path: { attribute_id: this.id } });
  }
}

class EffectImpl implements Effect {
  constructor(private agent: ESIAgent, private id: number) {
  }

  info() {
    return this.agent.request('get_dogma_effects_effect_id',
        { path: { effect_id: this.id } });
  }
}