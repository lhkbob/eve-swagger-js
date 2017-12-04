import { SSOAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';
import * as r from '../internal/resource-api';
import { CharacterAPI } from './character/characters';
/**
 * The API specification for all variants that access information about a
 * fleet's specific squad or squads. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all squads.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related to
 * the key's member if multiple squads are being accessed at once.
 *
 * An api adapter over the end points handling a specific squad via functions
 * in the [fleet](https://esi.tech.ccp.is/latest/#Fleet) ESI endpoints.
 */
export interface SquadAPI {
    details: esi.fleet.Squad;
}
/**
 * An api adapter for accessing various details of a single squad,
 * specified by a provided squad id when the api is instantiated.
 */
export declare class Squad extends r.impl.SimpleResource implements r.Async<SquadAPI> {
    private agent;
    private members_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, squadID: number);
    /**
     * @returns A MappedMembers API that is dynamically linked to the members
     *     that are in the squad
     */
    readonly members: MappedMembers;
    /**
     * @esi_route ~get_fleets_fleet_id_wings
     *
     * @returns The details of the squad
     */
    details(): Promise<esi.fleet.Squad>;
    /**
     * Delete the squad.
     *
     * @esi_route delete_fleets_fleet_id_squads_squad_id
     *
     * @returns An empty promise that resolves when the delete finishes
     */
    del(): Promise<undefined>;
    /**
     * Rename the squad.
     *
     * @esi_route put_fleets_fleet_id_squads_squad_id
     *
     * @param name The squad's new name
     * @returns An empty promise that resolves when the update finishes
     */
    rename(name: string): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of a set of squads,
 * specified by provided squad ids when the api is instantiated.
 */
export declare class MappedSquads extends r.impl.SimpleMappedResource implements r.Mapped<SquadAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @esi_route ~get_fleets_fleet_id_wings
     *
     * @returns Details on each of the squads, mapped by squad id
     */
    details(): Promise<Map<number, esi.fleet.Squad>>;
    /**
     * Delete each of the specified squads.
     *
     * @esi_route delete_fleets_fleet_id_squads_squad_id
     *
     * @returns An empty promise that resolves when the specified squads are
     *     deleted
     */
    del(): Promise<undefined>;
    /**
     * Rename each of the specified squads to the same name.
     *
     * @esi_route put_fleets_fleet_id_squads_squad_id
     *
     * @param name The new name for each squad
     * @returns An empty promise that resolves when the specified squads are
     *     renamed
     */
    rename(name: string): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every squad in the
 * fleet.
 */
export declare class IteratedSquads extends r.impl.SimpleIteratedResource<esi.fleet.Squad> implements r.Iterated<SquadAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @returns An iterator over each of the squads in the fleet.
     */
    details(): AsyncIterableIterator<[number, esi.fleet.Squad]>;
}
/**
 * A functional interface for creating APIs to access a single squad, a specific
 * set of squads, or every squad in a particular fleet. It additionally has
 * members for adding a new squad to a wing.
 */
export interface Squads {
    /**
     * Create a new squads api targeting every squad of the fleet.
     *
     * @returns An IteratedSquads API wrapper
     */
    (): IteratedSquads;
    /**
     * Create a new squad end point targeting the particular squad by `id`.
     *
     * @param id The squad's id
     * @returns An Squad API wrapper for the id
     */
    (id: number): Squad;
    /**
     * Create a new squads api targeting the multiple squad ids. If an array
     * is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The squad ids
     * @returns A MappedSquads API wrapper
     */
    (ids: number[] | Set<number>): MappedSquads;
    /**
     * Add a new squad to the fleet, organized under the specified `wingID`,
     * which must be an existing wing in the fleet.
     *
     * @param wingID The wing of the fleet the new squad will be assigned to
     * @returns The id of the new squad
     */
    add(wingID: number): Promise<number>;
}
/**
 * The API specification for all variants that access information about a
 * fleet's specific wing or wings. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all wings.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related to
 * the key's member if multiple wings are being accessed at once.
 *
 * An api adapter over the end points handling a specific wing via functions
 * in the [fleet](https://esi.tech.ccp.is/latest/#Fleet) ESI endpoints.
 */
export interface WingAPI {
    details: esi.fleet.Wing;
}
/**
 * An api adapter for accessing various details of a single wing,
 * specified by a provided wing id when the api is instantiated.
 */
export declare class Wing extends r.impl.SimpleResource implements r.Async<WingAPI> {
    private agent;
    private squads_?;
    private members_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, wingID: number);
    /**
     * @returns A dynamic MappedSquads interface over the squads within this wing
     */
    readonly squads: MappedSquads;
    /**
     * @returns A dynamic MappedMembers interface over the members in the wing
     */
    readonly members: MappedMembers;
    /**
     * @esi_route ~get_fleets_fleet_id_wings
     *
     * @returns The details of this wing
     */
    details(): Promise<esi.fleet.Wing>;
    /**
     * Delete the wing.
     *
     * @esi_route delete_fleets_fleet_id_wings_wing_id
     *
     * @returns An empty promise that resolves when the delete has finished
     */
    del(): Promise<undefined>;
    /**
     * Rename the wing.
     *
     * @esi_route put_fleets_fleet_id_wings_wing_id
     *
     * @param name The new name for the wing
     * @returns An empty promise that resolves when the update has finished
     */
    rename(name: string): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of a set of wings,
 * specified by provided wing ids when the api is instantiated.
 */
export declare class MappedWings extends r.impl.SimpleMappedResource implements r.Mapped<WingAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, ids: number[] | Set<number>);
    /**
     * @returns Details of each of the wings, mapped by wing id
     */
    details(): Promise<Map<number, esi.fleet.Wing>>;
    /**
     * Delete each of the wings.
     *
     * @esi_route delete_fleets_fleet_id_wings_wing_id
     *
     * @returns An empty promise that resolves when each of the wings has been
     *     deleted
     */
    del(): Promise<undefined>;
    /**
     * Rename each of the wings to `name`.
     *
     * @esi_route put_fleets_fleet_id_wings_wing_id
     *
     * @param name The new name for each wing
     * @returns An empty promise that resolves when each of the wings has been
     *     renamed
     */
    rename(name: string): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every wing in the
 * fleet.
 */
export declare class IteratedWings extends r.impl.SimpleIteratedResource<esi.fleet.Wing> implements r.Iterated<WingAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @returns An iterator over each of the wings in the fleet.
     */
    details(): AsyncIterableIterator<[number, esi.fleet.Wing]>;
}
/**
 * A functional interface for creating APIs to access a single wing, a specific
 * set of wings, or every wing in a particular fleet. It additionally has
 * members for adding a new wing to the fleet.
 */
export interface Wings {
    /**
     * Create a new wings api targeting every squad of the fleet.
     *
     * @returns An IteratedWings API wrapper
     */
    (): IteratedWings;
    /**
     * Create a new wing end point targeting the particular wing by `id`.
     *
     * @param id The wing's id
     * @returns An Wing API wrapper for the id
     */
    (id: number): Wing;
    /**
     * Create a new wings api targeting the multiple wing ids. If an array
     * is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The wing ids
     * @returns A MappedWings API wrapper
     */
    (ids: number[] | Set<number>): MappedWings;
    /**
     * Add a new wing to the fleet.
     *
     * @returns The id of the new wing
     */
    add(): Promise<number>;
}
/**
 * The API specification for all variants that access information about a
 * fleet's specific member or members. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all members.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related to
 * the key's member if multiple members are being accessed at once.
 *
 * An api adapter over the end points handling a specific member via functions
 * in the [fleet](https://esi.tech.ccp.is/latest/#Fleet) ESI endpoints.
 */
export interface MemberAPI extends CharacterAPI {
    roles: esi.fleet.Member;
}
/**
 * An api adapter for accessing various details of a single member,
 * specified by a provided member's character id when the api is instantiated.
 */
export declare class Member extends r.impl.SimpleResource implements r.Async<MemberAPI> {
    private agent;
    private base_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, charID: number);
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
     * @esi_route ~get_fleets_fleet_id_members
     *
     * @returns The fleet role details of the member
     */
    roles(): Promise<esi.fleet.Member>;
    /**
     * Kick the member from the fleet.
     *
     * @esi_route delete_fleets_fleet_id_members_member_id
     *
     * @returns An empty promise that resolves when the kick has been issued
     */
    kick(): Promise<undefined>;
    /**
     * Move the specific member to a new role or position in the fleet.
     *
     * @esi_route put_fleets_fleet_id_members_member_id
     *
     * @param moveOrder The details of the move
     * @returns An empty promise that resolves when the member has been moved
     */
    move(moveOrder: esi.fleet.Movement): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of a set of members,
 * specified by provided member character ids when the api is instantiated.
 */
export declare class MappedMembers extends r.impl.SimpleMappedResource implements r.Mapped<MemberAPI> {
    private agent;
    private base_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, ids: number[] | Set<number> | r.impl.IDSetProvider);
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
     * @returns Fleet roles of each of the members, mapped by character id
     */
    roles(): Promise<Map<number, esi.fleet.Member>>;
    /**
     * Kick each of the members.
     *
     * @esi_route delete_fleets_fleet_id_members_member_id
     *
     * @returns An empty promise that resolves when each of the members have been
     *     kicked
     */
    kick(): Promise<undefined>;
    /**
     * Move the members to a new role or position in the fleet. Since the same
     * move order is applied to every member in this set, the move order's
     * new role should be for squad member.
     *
     * @esi_route put_fleets_fleet_id_members_member_id
     *
     * @param moveOrder The details of the move
     * @returns An empty promise that resolves when the members have been moved
     */
    move(moveOrder: esi.fleet.Movement): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every member in the fleet.
 */
export declare class IteratedMembers extends r.impl.SimpleIteratedResource<esi.fleet.Member> implements r.Iterated<MemberAPI> {
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
     * @returns An iterator over each of the members' fleet details for the fleet.
     */
    roles(): AsyncIterableIterator<[number, esi.fleet.Member]>;
}
/**
 * A functional interface for creating APIs to access a single member, a
 * specific set of members, or every member in a particular fleet. It
 * additionally has members for inviting a new member to the fleet.
 */
export interface Members {
    /**
     * Create a new members api targeting every squad of the fleet.
     *
     * @returns An IteratedMembers API wrapper
     */
    (): IteratedMembers;
    /**
     * Create a new member end point targeting the particular member by `id`.
     *
     * @param id The member's character id
     * @returns An Member API wrapper for the id
     */
    (id: number): Member;
    /**
     * Create a new members api targeting the multiple member character ids. If
     * an array is provided, duplicates are removed (although the input array is
     * not modified).
     *
     * @param ids The member character ids
     * @returns A MappedMembers API wrapper
     */
    (ids: number[] | Set<number>): MappedMembers;
    /**
     * Invite a character to the fleet.
     *
     * @returns An empty promise when the invitation has been issued
     */
    invite(invitation: esi.fleet.Invitation): Promise<undefined>;
}
/**
 * An api adapter over the end points handling a character's fleet via
 * functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets) ESI
 * endpoints.
 */
export interface Fleet extends r.SingleResource {
    readonly wings: Wings;
    readonly squads: Squads;
    readonly members: Members;
    /**
     * @returns The structure of the fleet for simple, direct access
     */
    structure(): Promise<Responses['get_fleets_fleet_id_wings']>;
    /**
     * Update the settings and information of the fleet.
     *
     * @esi_route put_fleets_fleet_id
     *
     * @param settings The new fleet settings
     * @returns An empty promise that resolves when the update completes
     */
    update(settings: esi.fleet.NewSettings): Promise<undefined>;
    /**
     * Get the settings and information of the fleet.
     *
     * @esi_route get_fleets_fleet_id
     *
     * @returns The details of the fleet
     */
    details(): Promise<Responses['get_fleets_fleet_id']>;
}
/**
 * An extension of Fleet that is associated with a known character, so the
 * specific character's status within the fleet can be queried.
 */
export interface CharacterFleet extends Fleet {
    /**
     * @returns The associated character's fleet role
     */
    role(): Promise<Responses['get_characters_character_id_fleet']>;
}
export declare function makeFleet(agent: SSOAgent<number>, type: 'fleet'): Fleet;
export declare function makeFleet(agent: SSOAgent<number>, type: 'character'): CharacterFleet;
