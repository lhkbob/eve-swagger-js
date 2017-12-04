import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * corporation or multiple corporations. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all corporations.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple corporations are being accessed at once.
 *
 * This is an API wrapper over the end points handling corporations via
 * functions in the [corporation](https://esi.tech.ccp.is/latest/#/Corporation)
 * ESI endpoints.
 */
export interface CorporationAPI {
    details: Responses['get_corporations_corporation_id'];
    history: Responses['get_corporations_corporation_id_alliancehistory'];
    icons: Responses['get_corporations_corporation_id_icons'];
    loyaltyOffers: Responses['get_loyalty_stores_corporation_id_offers'];
    names: string;
}
/**
 * An api adapter for accessing various details of a single corporation,
 * specified by a provided id when the api is instantiated.
 */
export declare class Corporation implements r.SingleResource, r.Async<CorporationAPI> {
    private agent;
    private id;
    constructor(agent: ESIAgent, id: number | r.impl.IDProvider);
    /**
     * @returns The public info of the corporation
     */
    details(): Promise<esi.corporation.Corporation>;
    /**
     * @returns The alliance history of the corporation
     */
    history(): Promise<esi.corporation.AllianceHistory[]>;
    /**
     * @returns URL lookup information for the corporation icon images
     */
    icons(): Promise<esi.corporation.Icons>;
    /**
     * @returns Loyalty offers available for the NPC corporation
     */
    loyaltyOffers(): Promise<esi.corporation.LoyaltyStoreOffer[]>;
    /**
     * @esi_route ~get_corporations_corporation_id
     *
     * @returns The name of the corporation
     */
    names(): Promise<string>;
    ids(): Promise<number>;
}
/**
 * An api adapter for accessing various details of multiple corporations,
 * specified by a provided an array, set of ids, search query, or NPC
 * corporations when the api is instantiated.
 */
export declare class MappedCorporations extends r.impl.SimpleMappedResource implements r.Mapped<CorporationAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns The public details of the corporations, mapped by their id
     */
    details(): Promise<Map<number, esi.corporation.Corporation>>;
    /**
     * @returns The alliance history of the corporations, mapped by their id
     */
    history(): Promise<Map<number, esi.corporation.AllianceHistory[]>>;
    /**
     * @returns The icons of the corporations, mapped by their id
     */
    icons(): Promise<Map<number, esi.corporation.Icons>>;
    /**
     * @returns The loyalty offers for the corporations, mapped by their id
     */
    loyaltyOffers(): Promise<Map<number, esi.corporation.LoyaltyStoreOffer[]>>;
    /**
     * @esi_route post_universe_names [corporation]
     * @esi_route get_corporations_names
     *
     * @returns Map from corporation id to their name
     */
    names(): Promise<Map<any, any>>;
}
