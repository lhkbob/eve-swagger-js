import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { CharacterAPI } from '../character/characters';
/**
 * The API specification for all variants that access information about a
 * corporation's members or multiple members. This interface will not be
 * used directly, but will be filtered through some mapper, such as {@link
    * Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification
 * for all variants: single, multiple, and all members.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related
 * to the key's member if multiple bases are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [corporation](https://esi.tech.ccp.is/latest/#/Corporation) ESI endpoints.
 */
export interface MemberAPI extends CharacterAPI {
    tracking: esi.corporation.MemberDetails;
    roles: esi.corporation.MemberRoles;
    titles: number[];
}
/**
 * An api adapter for accessing various details of a single corporation
 * member, specified by a provided id when the api is instantiated.
 */
export declare class Member extends r.impl.SimpleResource implements r.Async<MemberAPI> {
    private agent;
    private base_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, id: number);
    private readonly base;
    /**
     * @returns The character details of the specific member
     */
    details(): Promise<esi.character.Character>;
    /**
     * @returns The character portraits of the specific member
     */
    portraits(): Promise<esi.character.Portrait>;
    /**
     * @returns The member's corporation history
     */
    history(): Promise<esi.character.CorporationHistory[]>;
    /**
     * @returns The member's affiliation information
     */
    affiliations(): Promise<{
        character_id: number;
        faction_id: number | undefined;
        alliance_id: number | undefined;
        corporation_id: number;
    }>;
    /**
     * @returns The member's character name
     */
    names(): Promise<string>;
    /**
     * @esi_route ~get_corporations_corporation_id_membertracking
     *
     * @returns Online and login status for the specific member
     */
    tracking(): Promise<esi.corporation.MemberDetails>;
    /**
     * @esi_route ~get_corporations_corporation_id_roles
     *
     * @returns The roles of the member
     */
    roles(): Promise<esi.corporation.MemberRoles>;
    /**
     * @esi_route ~get_corporations_corporation_id_members_titles
     *
     * @returns The title ids that are assigned to the member
     */
    titles(): Promise<number[]>;
}
/**
 * An api adapter for accessing various details of multiple member ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedMembers extends r.impl.SimpleMappedResource implements r.Mapped<MemberAPI> {
    private agent;
    private base_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, ids: number[] | Set<number>);
    private readonly base;
    /**
     * @returns The character details of the members, mapped by id
     */
    details(): Promise<Map<number, esi.character.Character>>;
    /**
     * @returns The character portraits of the members, mapped by id
     */
    portraits(): Promise<Map<number, esi.character.Portrait>>;
    /**
     * @returns The members' corporation histories, mapped by id
     */
    history(): Promise<Map<number, esi.character.CorporationHistory[]>>;
    /**
     * @returns The members' affiliations information, mapped by id
     */
    affiliations(): Promise<Map<number, esi.character.Affiliation>>;
    /**
     * @returns The members' character names, mapped by id
     */
    names(): Promise<Map<any, any>>;
    /**
     * @esi_route ~get_corporations_corporation_id_membertracking
     *
     * @returns Online and login status for the members, mapped by id
     */
    tracking(): Promise<Map<number, esi.corporation.MemberDetails>>;
    /**
     * @esi_route ~get_corporations_corporation_id_roles
     *
     * @returns The roles of the members, mapped by id
     */
    roles(): Promise<Map<number, esi.corporation.MemberRoles>>;
    /**
     * @esi_route ~get_corporations_corporation_id_members_titles
     *
     * @returns The title ids that are assigned to each member, mapped by id
     */
    titles(): Promise<Map<any, any>>;
}
/**
 * An api adapter for accessing various details about every member of the
 * corporation.
 */
export declare class IteratedMembers extends r.impl.SimpleIteratedResource<number> implements r.Iterated<MemberAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @returns An iterator over the character details of the members
     */
    details(): AsyncIterableIterator<[number, esi.character.Character]>;
    /**
     * @returns An iterator over the character portraits of the members
     */
    portraits(): AsyncIterableIterator<[number, esi.character.Portrait]>;
    /**
     * @returns An iterator over the members' corporation histories
     */
    history(): AsyncIterableIterator<[number, esi.character.CorporationHistory[]]>;
    /**
     * @esi_route post_characters_affiliation
     *
     * @returns An iterator over the members' affiliations information
     */
    affiliations(): AsyncIterableIterator<[number, esi.character.Affiliation]>;
    /**
     * @esi_route post_universe_names [character]
     *
     * @returns An iterator over the members' character names
     */
    names(): AsyncIterableIterator<[number, string]>;
    /**
     * @esi_route get_corporations_corporation_id_roles
     *
     * @returns An iterator over the roles of each member
     */
    roles(): AsyncIterableIterator<[number, esi.corporation.MemberRoles]>;
    /**
     * @esi_route get_corporations_corporation_id_members_titles
     *
     * @returns An iterator over the title ids assigned to each member
     */
    titles(): AsyncIterableIterator<[number, number[]]>;
    /**
     * @esi_route get_corporations_corporation_id_membertracking
     *
     * @returns An iterator over the login status and tracking details of every
     *     member
     */
    tracking(): AsyncIterableIterator<[number, esi.corporation.MemberDetails]>;
}
/**
 * A functional interface for getting APIs for a specific member, a
 * known set of member ids, or every member for a corporation.
 */
export interface Members {
    /**
     * Create a new member api targeting every single member of the
     * corporation.
     *
     * @esi_route ids get_corporation_id_members
     *
     * @returns An IteratedMembers API wrapper
     */
    (): IteratedMembers;
    /**
     * Create a new member api targeting the particular member by `id`.
     *
     * @param id The member id
     * @returns A Member API wrapper for the given id
     */
    (id: number): Member;
    /**
     * Create a new member api targeting the multiple member ids. If an array is
     * provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The member ids
     * @returns A MappedMembers API wrapper
     */
    (ids: number[] | Set<number>): MappedMembers;
}
/**
 * Create a new Members instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * corporation id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * corporation.
 *
 * @param agent The agent making actual requests
 * @returns A Members instance
 */
export declare function makeMembers(agent: SSOAgent<number | r.impl.IDProvider>): Members;
