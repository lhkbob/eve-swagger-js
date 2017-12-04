import { ESIAgent, SSOAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';

import * as r from '../internal/resource-api';
import { Character, CharacterAPI, MappedCharacters } from './character/characters';
import { getIteratedNames } from '../internal/names';
import { getIteratedValues } from '../internal/batch';

// FIXME move this into a fleet/ package and split it into multiple files
// FIXME can probably move it outside the character package as well, since it
// doesn't use the character id and only requires the token for the fleet boss.
// This would then mirror the planned changes to have corporation/ get its own
// package as well

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
export class Squad extends r.impl.SimpleResource implements r.Async<SquadAPI> {
  private members_?: MappedMembers;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      squadID: number) {
    super(squadID);
  }

  /**
   * @returns A MappedMembers API that is dynamically linked to the members
   *     that are in the squad
   */
  get members(): MappedMembers {
    if (this.members_ === undefined) {
      this.members_ = new MappedMembers(this.agent, () => getMembers(this.agent)
      .then(all => all.filter(e => e.squad_id === this.id_)
      .map(e => e.character_id)));
    }
    return this.members_;
  }

  /**
   * @esi_route ~get_fleets_fleet_id_wings
   *
   * @returns The details of the squad
   */
  details() {
    return getSquads(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.id));
  }

  /**
   * Delete the squad.
   *
   * @esi_route delete_fleets_fleet_id_squads_squad_id
   *
   * @returns An empty promise that resolves when the delete finishes
   */
  del(): Promise<undefined> {
    return deleteSquad(this.agent, this.id_);
  }

  /**
   * Rename the squad.
   *
   * @esi_route put_fleets_fleet_id_squads_squad_id
   *
   * @param name The squad's new name
   * @returns An empty promise that resolves when the update finishes
   */
  rename(name: string): Promise<undefined> {
    return updateSquad(this.agent, this.id_, { name: name });
  }
}

/**
 * An api adapter for accessing various details of a set of squads,
 * specified by provided squad ids when the api is instantiated.
 */
export class MappedSquads extends r.impl.SimpleMappedResource implements r.Mapped<SquadAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @esi_route ~get_fleets_fleet_id_wings
   *
   * @returns Details on each of the squads, mapped by squad id
   */
  details() {
    return this.arrayIDs()
    .then(ids => getSquads(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.id)));
  }

  /**
   * Delete each of the specified squads.
   *
   * @esi_route delete_fleets_fleet_id_squads_squad_id
   *
   * @returns An empty promise that resolves when the specified squads are
   *     deleted
   */
  del(): Promise<undefined> {
    return this.getResource(id => deleteSquad(this.agent, id))
    .then(map => undefined);
  }

  /**
   * Rename each of the specified squads to the same name.
   *
   * @esi_route put_fleets_fleet_id_squads_squad_id
   *
   * @param name The new name for each squad
   * @returns An empty promise that resolves when the specified squads are
   *     renamed
   */
  rename(name: string): Promise<undefined> {
    const naming = { name: name };
    return this.getResource(id => updateSquad(this.agent, id, naming))
    .then(map => undefined);
  }
}

/**
 * An api adapter for accessing various details about every squad in the
 * fleet.
 */
export class IteratedSquads extends r.impl.SimpleIteratedResource<esi.fleet.Squad> implements r.Iterated<SquadAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {
    super(r.impl.makeArrayStreamer(() => getSquads(agent)), e => e.id);
  }

  /**
   * @returns An iterator over each of the squads in the fleet.
   */
  details() {
    return this.getPaginatedResource();
  }
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
export class Wing extends r.impl.SimpleResource implements r.Async<WingAPI> {
  private squads_?: MappedSquads;
  private members_?: MappedMembers;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      wingID: number) {
    super(wingID);
  }

  /**
   * @returns A dynamic MappedSquads interface over the squads within this wing
   */
  get squads(): MappedSquads {
    if (this.squads_ === undefined) {
      this.squads_ = new MappedSquads(this.agent,
          () => this.details().then(details => details.squads.map(e => e.id)));
    }
    return this.squads_;
  }

  /**
   * @returns A dynamic MappedMembers interface over the members in the wing
   */
  get members(): MappedMembers {
    if (this.members_ === undefined) {
      this.members_ = new MappedMembers(this.agent, () => getMembers(this.agent)
      .then(members => members.filter(e => e.wing_id === this.id_)
      .map(e => e.character_id)));
    }
    return this.members_;
  }

  /**
   * @esi_route ~get_fleets_fleet_id_wings
   *
   * @returns The details of this wing
   */
  details() {
    return getWings(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.id));
  }

  /**
   * Delete the wing.
   *
   * @esi_route delete_fleets_fleet_id_wings_wing_id
   *
   * @returns An empty promise that resolves when the delete has finished
   */
  del(): Promise<undefined> {
    return deleteWing(this.agent, this.id_);
  }

  /**
   * Rename the wing.
   *
   * @esi_route put_fleets_fleet_id_wings_wing_id
   *
   * @param name The new name for the wing
   * @returns An empty promise that resolves when the update has finished
   */
  rename(name: string): Promise<undefined> {
    return updateWing(this.agent, this.id_, { name: name });
  }
}

/**
 * An api adapter for accessing various details of a set of wings,
 * specified by provided wing ids when the api is instantiated.
 */
export class MappedWings extends r.impl.SimpleMappedResource implements r.Mapped<WingAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns Details of each of the wings, mapped by wing id
   */
  details() {
    return this.arrayIDs()
    .then(ids => getWings(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.id)));
  }

  /**
   * Delete each of the wings.
   *
   * @esi_route delete_fleets_fleet_id_wings_wing_id
   *
   * @returns An empty promise that resolves when each of the wings has been
   *     deleted
   */
  del(): Promise<undefined> {
    return this.getResource(id => deleteWing(this.agent, id))
    .then(map => undefined);
  }

  /**
   * Rename each of the wings to `name`.
   *
   * @esi_route put_fleets_fleet_id_wings_wing_id
   *
   * @param name The new name for each wing
   * @returns An empty promise that resolves when each of the wings has been
   *     renamed
   */
  rename(name: string): Promise<undefined> {
    const naming = { name: name };
    return this.getResource(id => updateWing(this.agent, id, naming))
    .then(map => undefined);
  }
}

/**
 * An api adapter for accessing various details about every wing in the
 * fleet.
 */
export class IteratedWings extends r.impl.SimpleIteratedResource<esi.fleet.Wing> implements r.Iterated<WingAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {
    super(r.impl.makeArrayStreamer(() => getWings(agent)), e => e.id);
  }

  /**
   * @returns An iterator over each of the wings in the fleet.
   */
  details() {
    return this.getPaginatedResource();
  }
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
export class Member extends r.impl.SimpleResource implements r.Async<MemberAPI> {
  private base_?: Character;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      charID: number) {
    super(charID);
  }

  private get base(): Character {
    if (this.base_ === undefined) {
      this.base_ = new Character(this.agent.agent, this.id_);
    }
    return this.base_;
  }

  /**
   * @returns The character details of the specific member
   */
  details() {
    return this.base.details();
  }

  /**
   * @returns The character portraits of the specific member
   */
  portraits() {
    return this.base.portraits();
  }

  /**
   * @returns The member's corporation history
   */
  history() {
    return this.base.history();
  }

  /**
   * @returns The member's affiliation information
   */
  affiliations() {
    return this.base.affiliations();
  }

  /**
   * @returns The member's character name
   */
  names() {
    return this.base.names();
  }

  /**
   * @esi_route ~get_fleets_fleet_id_members
   *
   * @returns The fleet role details of the member
   */
  roles() {
    return getMembers(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.character_id));
  }

  /**
   * Kick the member from the fleet.
   *
   * @esi_route delete_fleets_fleet_id_members_member_id
   *
   * @returns An empty promise that resolves when the kick has been issued
   */
  kick(): Promise<undefined> {
    return kickMember(this.agent, this.id_);
  }

  /**
   * Move the specific member to a new role or position in the fleet.
   *
   * @esi_route put_fleets_fleet_id_members_member_id
   *
   * @param moveOrder The details of the move
   * @returns An empty promise that resolves when the member has been moved
   */
  move(moveOrder: esi.fleet.Movement): Promise<undefined> {
    return moveMember(this.agent, this.id_, moveOrder);
  };
}

/**
 * An api adapter for accessing various details of a set of members,
 * specified by provided member character ids when the api is instantiated.
 */
export class MappedMembers extends r.impl.SimpleMappedResource implements r.Mapped<MemberAPI> {
  private base_?: MappedCharacters;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  private get base(): MappedCharacters {
    if (this.base_ === undefined) {
      this.base_ = new MappedCharacters(this.agent.agent, this.ids_);
    }
    return this.base_;
  }

  /**
   * @returns The character details of the members, mapped by id
   */
  details() {
    return this.base.details();
  }

  /**
   * @returns The character portraits of the members, mapped by id
   */
  portraits() {
    return this.base.portraits();
  }

  /**
   * @returns The members' corporation histories, mapped by id
   */
  history() {
    return this.base.history();
  }

  /**
   * @returns The members' affiliations information, mapped by id
   */
  affiliations() {
    return this.base.affiliations();
  }

  /**
   * @returns The members' character names, mapped by id
   */
  names() {
    return this.base.names();
  }

  /**
   * @returns Fleet roles of each of the members, mapped by character id
   */
  roles() {
    return this.arrayIDs()
    .then(ids => getMembers(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id)));
  }

  /**
   * Kick each of the members.
   *
   * @esi_route delete_fleets_fleet_id_members_member_id
   *
   * @returns An empty promise that resolves when each of the members have been
   *     kicked
   */
  kick(): Promise<undefined> {
    return this.getResource(id => kickMember(this.agent, id))
    .then(map => undefined);
  }

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
  move(moveOrder: esi.fleet.Movement): Promise<undefined> {
    return this.getResource(id => moveMember(this.agent, id, moveOrder))
    .then(map => undefined);
  };
}

/**
 * An api adapter for accessing various details about every member in the fleet.
 */
export class IteratedMembers extends r.impl.SimpleIteratedResource<esi.fleet.Member> implements r.Iterated<MemberAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {
    super(r.impl.makeArrayStreamer(() => getMembers(agent)),
        e => e.character_id);
  }

  /**
   * @returns An iterator over the character details of the members
   */
  details() {
    return this.getResource(
        id => this.agent.agent.request('get_characters_character_id',
            { path: { character_id: id } }));
  }

  /**
   * @returns An iterator over the character portraits of the members
   */
  portraits() {
    return this.getResource(
        id => this.agent.agent.request('get_characters_character_id_portrait',
            { path: { character_id: id } }));
  }

  /**
   * @returns An iterator over the members' corporation histories
   */
  history() {
    return this.getResource(id => this.agent.agent.request(
        'get_characters_character_id_corporationhistory',
        { path: { character_id: id } }));
  }

  /**
   * @esi_route post_characters_affiliation
   *
   * @returns An iterator over the members' affiliations information
   */
  affiliations() {
    return getIteratedValues(this.ids(),
        idSet => this.agent.agent.request('post_characters_affiliation',
            { body: idSet }), e => [e.character_id, e], 1000);
  }

  /**
   * @esi_route post_universe_names [character]
   *
   * @returns An iterator over the members' character names
   */
  names() {
    return getIteratedNames(this.agent.agent,
        esi.universe.NameCategory.CHARACTER, this.ids());
  }


  /**
   * @returns An iterator over each of the members' fleet details for the fleet.
   */
  roles() {
    return this.getPaginatedResource();
  }
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

export function makeFleet(agent: SSOAgent<number>, type: 'fleet'): Fleet;
export function makeFleet(agent: SSOAgent<number>,
    type: 'character'): CharacterFleet;
export function makeFleet(agent: SSOAgent<number>,
    type: 'fleet' | 'character') {
  if (type === 'fleet') {
    // The SSOAgent's id refers to a fleet's id, and there's no character
    // specified
    return new FleetImpl(agent.agent, agent.ssoToken, undefined, agent.id);
  } else {
    // The SSOAgent's id refers to a character's id, so no need to provide a
    // fleet id
    return new FleetImpl(agent.agent, agent.ssoToken, agent.id, undefined);
  }
}

class FleetImpl implements CharacterFleet {
  private charAgent_?: SSOAgent<number>;
  private agent: SSOAgent<number | r.impl.IDProvider>;

  private wings_?: Wings;
  private squads_?: Squads;
  private members_?: Members;

  constructor(agent: ESIAgent, ssoToken: string, charID?: number,
      fleetID?: number) {
    if (charID === undefined) {
      // No character, so assume the fleet ID is provided explicitly
      this.charAgent_ = undefined;
      this.agent = { agent, ssoToken, id: fleetID! };
    } else {
      // Character provided, so ignore the fleetID and load it dynamically
      this.charAgent_ = { agent, ssoToken, id: charID };
      this.agent = {
        agent,
        ssoToken,
        id: () => getRole(this.charAgent_!).then(role => role.fleet_id)
      };
    }
  }

  get wings() {
    if (this.wings_ === undefined) {
      this.wings_ = makeWings(this.agent);
    }
    return this.wings_;
  }

  get squads() {
    if (this.squads_ === undefined) {
      this.squads_ = makeSquads(this.agent);
    }
    return this.squads_;
  }

  get members() {
    if (this.members_ === undefined) {
      this.members_ = makeMembers(this.agent);
    }
    return this.members_;
  }

  ids() {
    if (typeof this.agent.id === 'number') {
      return Promise.resolve(this.agent.id);
    } else {
      return this.agent.id();
    }
  }

  role() {
    if (this.charAgent_ === undefined) {
      return Promise.reject('Not a CharacterFleet instance');
    } else {
      return getRole(this.charAgent_);
    }
  }

  details() {
    return getFleet(this.agent);
  }

  update(settings: esi.fleet.NewSettings) {
    return updateFleet(this.agent, settings);
  }

  structure() {
    return getWings(this.agent);
  }
}


function makeSquads(agent: SSOAgent<number | r.impl.IDProvider>): Squads {
  let squads = <Squads> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All squads of a fleet
      return new IteratedSquads(agent);
    } else if (typeof ids === 'number') {
      // Specific squad
      return new Squad(agent, ids);
    } else {
      // Set of squads
      return new MappedSquads(agent, ids);
    }
  };

  squads.add = function (wingID: number) {
    return addSquad(agent, wingID).then(id => id.squad_id);
  };

  return squads;
}

function makeWings(agent: SSOAgent<number | r.impl.IDProvider>): Wings {
  let wings = <Wings> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All wings of a fleet
      return new IteratedWings(agent);
    } else if (typeof ids === 'number') {
      // Specific wing
      return new Wing(agent, ids);
    } else {
      // Set of wings
      return new MappedWings(agent, ids);
    }
  };

  wings.add = function () {
    return addWing(agent).then(id => id.wing_id);
  };

  return wings;
}

function makeMembers(agent: SSOAgent<number | r.impl.IDProvider>): Members {
  let members = <Members> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All members of a fleet
      return new IteratedMembers(agent);
    } else if (typeof ids === 'number') {
      // Specific member
      return new Member(agent, ids);
    } else {
      // Set of members
      return new MappedMembers(agent, ids);
    }
  };

  members.invite = function (invitation: esi.fleet.Invitation) {
    return inviteMember(agent, invitation);
  };

  return members;
}

function getRole(agent: SSOAgent<number>) {
  return agent.agent.request('get_characters_character_id_fleet',
      { path: { character_id: agent.id } }, agent.ssoToken);
}

async function getFleet(agent: SSOAgent<number | r.impl.IDProvider>) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('get_fleets_fleet_id',
      { path: { fleet_id: fleetID } }, agent.ssoToken);
}

async function updateFleet(agent: SSOAgent<number | r.impl.IDProvider>,
    update: esi.fleet.NewSettings) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('put_fleets_fleet_id',
      { path: { fleet_id: fleetID }, body: update }, agent.ssoToken);
}

async function getMembers(agent: SSOAgent<number | r.impl.IDProvider>) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('get_fleets_fleet_id_members',
      { path: { fleet_id: fleetID } }, agent.ssoToken);
}

async function kickMember(agent: SSOAgent<number | r.impl.IDProvider>,
    member: number) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('delete_fleets_fleet_id_members_member_id',
      { path: { fleet_id: fleetID, member_id: member } }, agent.ssoToken);
}

async function moveMember(agent: SSOAgent<number | r.impl.IDProvider>,
    member: number, move: esi.fleet.Movement) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('put_fleets_fleet_id_members_member_id',
      { path: { fleet_id: fleetID, member_id: member }, body: move },
      agent.ssoToken);
}

async function inviteMember(agent: SSOAgent<number | r.impl.IDProvider>,
    invitation: esi.fleet.Invitation) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('post_fleets_fleet_id_members',
      { path: { fleet_id: fleetID }, body: invitation }, agent.ssoToken);
}

async function addWing(agent: SSOAgent<number | r.impl.IDProvider>) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('post_fleets_fleet_id_wings',
      { path: { fleet_id: fleetID } }, agent.ssoToken);
}

async function getWings(agent: SSOAgent<number | r.impl.IDProvider>) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('get_fleets_fleet_id_wings',
      { path: { fleet_id: fleetID } }, agent.ssoToken);
}

async function updateWing(agent: SSOAgent<number | r.impl.IDProvider>,
    wing: number, update: esi.fleet.Naming) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('put_fleets_fleet_id_wings_wing_id',
      { path: { fleet_id: fleetID, wing_id: wing }, body: update },
      agent.ssoToken);
}

async function deleteWing(agent: SSOAgent<number | r.impl.IDProvider>,
    wing: number) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('delete_fleets_fleet_id_wings_wing_id',
      { path: { fleet_id: fleetID, wing_id: wing } }, agent.ssoToken);
}

async function getSquads(agent: SSOAgent<number | r.impl.IDProvider>): Promise<esi.fleet.Squad[]> {
  let wings = await getWings(agent);
  let squads = [];
  for (let w of wings) {
    squads.push(...w.squads);
  }
  return squads;
}

async function addSquad(agent: SSOAgent<number | r.impl.IDProvider>,
    wing: number) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('post_fleets_fleet_id_wings_wing_id_squads',
      { path: { fleet_id: fleetID, wing_id: wing } }, agent.ssoToken);
}

async function updateSquad(agent: SSOAgent<number | r.impl.IDProvider>,
    squad: number, update: esi.fleet.Naming) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('put_fleets_fleet_id_squads_squad_id',
      { path: { fleet_id: fleetID, squad_id: squad }, body: update },
      agent.ssoToken);
}

async function deleteSquad(agent: SSOAgent<number | r.impl.IDProvider>,
    squad: number) {
  let fleetID: number = typeof agent.id === 'number' ? agent.id
      : await agent.id();

  return agent.agent.request('delete_fleets_fleet_id_squads_squad_id',
      { path: { fleet_id: fleetID, squad_id: squad } }, agent.ssoToken);
}