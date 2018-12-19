import { SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';
/**
 * An api adapter over the end points handling a specific squad in a character's
 * fleet via functions in the [fleets](https://esi.evetech.net/latest/#/Fleets)
 * ESI endpoints.
 */
export interface Squad {
    /**
     * @esi_example esi.characters(1,
     *     'token').fleet(2).wings(3).squads(4).rename('name')
     *
     * @param name The new name of the squad
     * @returns An empty promise that resolves when the update finishes
     */
    rename(name: string): Promise<Responses['put_fleets_fleet_id_squads_squad_id']>;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).wings(3).squads(4).del()
     *
     * @returns An empty promise that resolves when the delete finishes
     */
    del(): Promise<Responses['delete_fleets_fleet_id_squads_squad_id']>;
    /**
     * @returns The squad's id
     */
    id(): Promise<number>;
    /**
     * @returns The wing id this squad belongs to
     */
    wing(): Promise<number>;
    /**
     * @returns The fleet id this squad belongs to
     */
    fleet(): Promise<number>;
}
/**
 * An api adapter over the end points handling the squads in a wing in the
 * character's fleet via functions in the
 * [fleets](https://esi.evetech.net/latest/#/Fleets) ESI endpoints.
 */
export interface Squads {
    /**
     * The Squad API adapter for accessing and modifying the specific squad of a
     * wing.
     *
     * @returns A Squad API instance
     */
    (id: number): Squad;
    /**
     * @esi_route post_fleets_fleet_id_wings_wing_id_squads
     * @esi_example esi.characters(1, 'token').fleet(2).wings(3).squads.add()
     *
     * @returns The id of the new squad to the selected wing
     */
    add(): Promise<number>;
    /**
     * @returns The wing id whose squads are accessed
     */
    wing(): Promise<number>;
    /**
     * @returns The fleet id the squads belong to
     */
    fleet(): Promise<number>;
}
/**
 * An api adapter over the end points handling a specific wing in a character's
 * fleet via functions in the [fleets](https://esi.evetech.net/latest/#/Fleets)
 * ESI endpoints.
 */
export interface Wing {
    /**
     * The Squads end point for this particular wing.
     */
    squads: Squads;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).wings(3).rename('name')
     *
     * @param name The new name of the wing
     * @returns An empty promise that resolves when the update completes
     */
    rename(name: string): Promise<Responses['put_fleets_fleet_id_wings_wing_id']>;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).wings(3).del()
     *
     * @returns An empty promise that resolves when the delete finishes
     */
    del(): Promise<Responses['delete_fleets_fleet_id_wings_wing_id']>;
    /**
     * @returns The wing id
     */
    id(): Promise<number>;
    /**
     * @returns The fleet id of the wing
     */
    fleet(): Promise<number>;
}
/**
 * An api adapter over the end points handling the wings in the character's
 * fleet via functions in the [fleets](https://esi.evetech.net/latest/#/Fleets)
 * ESI endpoints.
 */
export interface Wings {
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).wings()
     *
     * @returns Details about all of the wings and their squads in the fleet
     */
    (): Promise<Responses['get_fleets_fleet_id_wings']>;
    /**
     * The Wing api adapter for accessing and modifying the specific wing of a
     * fleet.
     *
     * @returns A Wing API for the specific id
     */
    (id: number): Wing;
    /**
     * @esi_route post_fleets_fleet_id_wings
     * @esi_example esi.characters(1, 'token').fleet(2).wings.add()
     *
     * @returns The new wing's id
     */
    add(): Promise<number>;
    /**
     * @returns The fleet id whose wings are accessed
     */
    fleet(): Promise<number>;
}
/**
 * An api adapter over the end points handling a character's fleet via
 * functions in the [fleets](https://esi.evetech.net/latest/#/Fleets) ESI
 * endpoints.
 */
export interface Fleet {
    /**
     * The Wings API adapter for accessing and modifying the wing state of the
     * fleet.
     */
    wings: Wings;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).info()
     *
     * @returns Details about the fleet
     */
    info(): Promise<Responses['get_fleets_fleet_id']>;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).members()
     *
     * @returns List of members of the fleet
     */
    members(): Promise<Responses['get_fleets_fleet_id_members']>;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).invite({...})
     *
     * @param invitation The details of the invitation
     * @returns An empty promise that resolves when the invitation has been sent
     */
    invite(invitation: esi.fleet.Invitation): Promise<Responses['post_fleets_fleet_id_members']>;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).kick(3)
     *
     * @param memberID The id of the member to remove from the fleet
     * @returns An empty promise that resolves when the member has been kicked
     */
    kick(memberID: number): Promise<Responses['delete_fleets_fleet_id_members_member_id']>;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).move(3, {...})
     *
     * @param memberID The member to reposition in the fleet
     * @param moveOrder The details of the move
     * @returns An empty promise that resolves when the member has been moved
     */
    move(memberID: number, moveOrder: esi.fleet.Movement): Promise<Responses['put_fleets_fleet_id_members_member_id']>;
    /**
     * @esi_example esi.characters(1, 'token').fleet(2).update({...})
     *
     * @param settings The new settings for the fleet
     * @returns An empty promise that resolves when the settings have been saved
     */
    update(settings: esi.fleet.NewSettings): Promise<Responses['put_fleets_fleet_id']>;
}
/**
 * Create a new {@link Fleet} instance that uses the given fleet agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param fleet The fleet access information
 * @returns An Fleet API instance
 */
export declare function makeFleet(fleet: SSOAgent): Fleet;
