// This is a generated file, take caution when editing manually.
// Run `npm run gen:esi` to regenerate.
// Generated 196 types in monolithic namespace for ESI v0.6.0.
export namespace esi {
    export namespace alliance {
        /**
         * This is the response type for the route, [`GET /v2/alliances/{alliance_id}/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id).
         */
        export interface Alliance {
            /**
             * The full name of the alliance.
             */
            alliance_name: string;
            date_founded: string;
            /**
             * The executor corporation ID, if this alliance is not closed.
             */
            executor_corp?: number;
            /**
             * The short name of the alliance.
             */
            ticker: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/alliances/{alliance_id}/icons/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id_icons).
         */
        export interface Icons {
            px128x128?: string;
            px64x64?: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/alliances/names/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_names).
         */
        export interface Name {
            alliance_id: number;
            alliance_name: string;
        }
    }
    export namespace character {
        export namespace asset {
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/assets/`](https://esi.tech.ccp.is//#!/Assets/get_characters_character_id_assets).
             */
            export interface Asset {
                is_singleton: boolean;
                item_id: number;
                location_flag: esi.character.asset.LocationType;
                location_id: number;
                location_type: "station" | "solar_system" | "other";
                quantity?: number;
                type_id: number;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/blueprints/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_blueprints).
             */
            export interface Blueprint {
                /**
                 * Unique ID for this item. The ID of an item is stable if that item is not repackaged, stacked, detached from a stack, assembled, or otherwise altered. If an item is changed in one of these ways, then the ID will also change.
                 */
                item_id: number;
                location_flag: esi.character.asset.LocationType;
                /**
                 * References a solar system, station or item_id if this blueprint is located within a container. If an item_id the Character - AssetList API must be queried to find the container using the item_id, from which the correct location of the Blueprint can be derived.
                 */
                location_id: number;
                /**
                 * Material Efficiency Level of the blueprint, can be any integer between 0 and 10.
                 */
                material_efficiency: number;
                /**
                 * Typically will be -1 or -2 designating a singleton item, where -1 is an original and -2 is a copy. It can be a positive integer if it is a stack of blueprint originals fresh from the market (no activities performed on them yet).
                 */
                quantity: number;
                /**
                 * Number of runs remaining if the blueprint is a copy, -1 if it is an original.
                 */
                runs: number;
                /**
                 * Time Efficiency Level of the blueprint, can be any even integer between 0 and 20.
                 */
                time_efficiency: number;
                type_id: number;
            }
            /**
             * This is the response type for the route, [`POST /v1/characters/{character_id}/assets/locations/`](https://esi.tech.ccp.is//#!/Assets/post_characters_character_id_assets_locations).
             */
            export interface Location {
                item_id: number;
                x: number;
                y: number;
                z: number;
            }
            /**
             * Indicates something about this item's storage location. The flag is used to differentiate between hangar divisions, drone bay, fitting location, and similar.
             */
            export const enum LocationType {
                ASSET_SAFETY = "AssetSafety",
                AUTO_FIT = "AutoFit",
                CARGO = "Cargo",
                CORPSE_BAY = "CorpseBay",
                DELIVERIES = "Deliveries",
                DRONE_BAY = "DroneBay",
                FIGHTER_BAY = "FighterBay",
                FIGHTER_TUBE_0 = "FighterTube0",
                FIGHTER_TUBE_1 = "FighterTube1",
                FIGHTER_TUBE_2 = "FighterTube2",
                FIGHTER_TUBE_3 = "FighterTube3",
                FIGHTER_TUBE_4 = "FighterTube4",
                FLEET_HANGAR = "FleetHangar",
                HANGAR = "Hangar",
                HANGAR_ALL = "HangarAll",
                HI_SLOT_0 = "HiSlot0",
                HI_SLOT_1 = "HiSlot1",
                HI_SLOT_2 = "HiSlot2",
                HI_SLOT_3 = "HiSlot3",
                HI_SLOT_4 = "HiSlot4",
                HI_SLOT_5 = "HiSlot5",
                HI_SLOT_6 = "HiSlot6",
                HI_SLOT_7 = "HiSlot7",
                HIDDEN_MODIFIERS = "HiddenModifiers",
                IMPLANT = "Implant",
                LO_SLOT_0 = "LoSlot0",
                LO_SLOT_1 = "LoSlot1",
                LO_SLOT_2 = "LoSlot2",
                LO_SLOT_3 = "LoSlot3",
                LO_SLOT_4 = "LoSlot4",
                LO_SLOT_5 = "LoSlot5",
                LO_SLOT_6 = "LoSlot6",
                LO_SLOT_7 = "LoSlot7",
                LOCKED = "Locked",
                MED_SLOT_0 = "MedSlot0",
                MED_SLOT_1 = "MedSlot1",
                MED_SLOT_2 = "MedSlot2",
                MED_SLOT_3 = "MedSlot3",
                MED_SLOT_4 = "MedSlot4",
                MED_SLOT_5 = "MedSlot5",
                MED_SLOT_6 = "MedSlot6",
                MED_SLOT_7 = "MedSlot7",
                MODULE = "Module",
                QUAFE_BAY = "QuafeBay",
                RIG_SLOT_0 = "RigSlot0",
                RIG_SLOT_1 = "RigSlot1",
                RIG_SLOT_2 = "RigSlot2",
                RIG_SLOT_3 = "RigSlot3",
                RIG_SLOT_4 = "RigSlot4",
                RIG_SLOT_5 = "RigSlot5",
                RIG_SLOT_6 = "RigSlot6",
                RIG_SLOT_7 = "RigSlot7",
                SHIP_HANGAR = "ShipHangar",
                SPECIALIZED_AMMO_HOLD = "SpecializedAmmoHold",
                SPECIALIZED_COMMAND_CENTER_HOLD = "SpecializedCommandCenterHold",
                SPECIALIZED_FUEL_BAY = "SpecializedFuelBay",
                SPECIALIZED_GAS_HOLD = "SpecializedGasHold",
                SPECIALIZED_INDUSTRIAL_SHIP_HOLD = "SpecializedIndustrialShipHold",
                SPECIALIZED_LARGE_SHIP_HOLD = "SpecializedLargeShipHold",
                SPECIALIZED_MATERIAL_BAY = "SpecializedMaterialBay",
                SPECIALIZED_MEDIUM_SHIP_HOLD = "SpecializedMediumShipHold",
                SPECIALIZED_MINERAL_HOLD = "SpecializedMineralHold",
                SPECIALIZED_ORE_HOLD = "SpecializedOreHold",
                SPECIALIZED_PLANETARY_COMMODITIES_HOLD = "SpecializedPlanetaryCommoditiesHold",
                SPECIALIZED_SALVAGE_HOLD = "SpecializedSalvageHold",
                SPECIALIZED_SHIP_HOLD = "SpecializedShipHold",
                SPECIALIZED_SMALL_SHIP_HOLD = "SpecializedSmallShipHold",
                SUB_SYSTEM_BAY = "SubSystemBay",
                SUB_SYSTEM_SLOT_0 = "SubSystemSlot0",
                SUB_SYSTEM_SLOT_1 = "SubSystemSlot1",
                SUB_SYSTEM_SLOT_2 = "SubSystemSlot2",
                SUB_SYSTEM_SLOT_3 = "SubSystemSlot3",
                SUB_SYSTEM_SLOT_4 = "SubSystemSlot4",
                SUB_SYSTEM_SLOT_5 = "SubSystemSlot5",
                SUB_SYSTEM_SLOT_6 = "SubSystemSlot6",
                SUB_SYSTEM_SLOT_7 = "SubSystemSlot7",
                UNLOCKED = "Unlocked",
                WARDROBE = "Wardrobe"
            }
            /**
             * This is the response type for the route, [`POST /v1/characters/{character_id}/assets/names/`](https://esi.tech.ccp.is//#!/Assets/post_characters_character_id_assets_names).
             */
            export interface Name {
                item_id: number;
                name: string;
            }
        }
        export namespace calendar {
            export interface Attendee {
                character_id?: number;
                event_response?: esi.character.calendar.ResponseState;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/calendar/`](https://esi.tech.ccp.is//#!/Calendar/get_characters_character_id_calendar).
             */
            export interface Calendar {
                event_date?: string;
                event_id?: number;
                event_response?: esi.character.calendar.ResponseState;
                importance?: number;
                title?: string;
            }
            export interface Event {
                date: string;
                /**
                 * Length in minutes.
                 */
                duration: number;
                event_id: number;
                importance: number;
                owner_id: number;
                owner_name: string;
                owner_type: esi.character.calendar.OwnerType;
                response: string;
                text: string;
                title: string;
            }
            export const enum OwnerType {
                ALLIANCE = "alliance",
                CHARACTER = "character",
                CORPORATION = "corporation",
                EVE_SERVER = "eve_server",
                FACTION = "faction"
            }
            /**
             * This type is a parameter for the route, [`PUT /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.tech.ccp.is//#!/Calendar/put_characters_character_id_calendar_event_id).
             */
            export interface Response {
                response: "accepted" | "declined" | "tentative";
            }
            export const enum ResponseState {
                ACCEPTED = "accepted",
                DECLINED = "declined",
                NOT_RESPONDED = "not_responded",
                TENTATIVE = "tentative"
            }
        }
        export namespace channel {
            export interface AllowedAccessor {
                /**
                 * ID of an allowed channel member. ID of a channel operator.
                 */
                accessor_id: number;
                accessor_type: "character" | "corporation" | "alliance";
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/chat_channels/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_chat_channels).
             */
            export interface ChatChannel {
                allowed: esi.character.channel.AllowedAccessor[];
                blocked: esi.character.channel.RestrictedAccessor[];
                /**
                 * Unique channel ID. Always negative for player-created channels. Permanent (CCP created) channels have a positive ID, but don't appear in the API.
                 */
                channel_id: number;
                /**
                 * Normalized, unique string used to compare channel names.
                 */
                comparison_key: string;
                /**
                 * If this is a password protected channel.
                 */
                has_password: boolean;
                /**
                 * Message of the day for this channel.
                 */
                motd: string;
                muted: esi.character.channel.RestrictedAccessor[];
                /**
                 * Displayed name of channel.
                 */
                name: string;
                operators: esi.character.channel.AllowedAccessor[];
                owner_id: number;
            }
            export interface RestrictedAccessor {
                /**
                 * ID of a blocked channel member. ID of a muted channel member.
                 */
                accessor_id: number;
                accessor_type: "character" | "corporation" | "alliance";
                /**
                 * Time at which this accessor will no longer be blocked. Time at which this accessor will no longer be muted.
                 */
                end_at?: string;
                /**
                 * Reason this accessor is blocked. Reason this accessor is muted.
                 */
                reason?: string;
            }
        }
        export namespace contract {
            /**
             * To whom the contract is available.
             */
            export const enum Availability {
                ALLIANCE = "alliance",
                CORPORATION = "corporation",
                PERSONAL = "personal",
                PUBLIC = "public"
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/contracts/{contract_id}/bids/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts_contract_id_bids).
             */
            export interface Bid {
                /**
                 * The ammount bid.
                 */
                amount: number;
                /**
                 * Unique ID for the bid.
                 */
                bid_id: number;
                /**
                 * Character ID of the bidder.
                 */
                bidder_id: number;
                /**
                 * Datetime when the bid was placed.
                 */
                date_bid: string;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/contracts/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts).
             */
            export interface Contract {
                /**
                 * Who will accept the contract. If assignee_id is same as acceptorID then character ID else corporation ID (The contract accepted by the corporation).
                 */
                acceptor_id: number;
                /**
                 * ID to whom the contract is assigned, can be corporation or character ID.
                 */
                assignee_id: number;
                availability: esi.character.contract.Availability;
                /**
                 * Buyout price (for Auctions only).
                 */
                buyout?: number;
                /**
                 * Collateral price (for Couriers only).
                 */
                collateral?: number;
                contract_id: number;
                /**
                 * Date of confirmation of contract.
                 */
                date_accepted?: string;
                /**
                 * Date of completed of contract.
                 */
                date_completed?: string;
                /**
                 * Expiration date of the contract.
                 */
                date_expired: string;
                /**
                 * Сreation date of the contract.
                 */
                date_issued: string;
                /**
                 * Number of days to perform the contract.
                 */
                days_to_complete?: number;
                /**
                 * End location ID (for Couriers contract).
                 */
                end_location_id?: number;
                /**
                 * True if the contract was issued on behalf of the issuer's corporation.
                 */
                for_corporation: boolean;
                /**
                 * Character's corporation ID for the issuer.
                 */
                issuer_corporation_id: number;
                /**
                 * Character ID for the issuer.
                 */
                issuer_id: number;
                /**
                 * Price of contract (for ItemsExchange and Auctions).
                 */
                price?: number;
                /**
                 * Remuneration for contract (for Couriers only).
                 */
                reward?: number;
                /**
                 * Start location ID (for Couriers contract).
                 */
                start_location_id?: number;
                status: esi.character.contract.Status;
                /**
                 * Title of the contract.
                 */
                title?: string;
                type: esi.character.contract.Type;
                /**
                 * Volume of items in the contract.
                 */
                volume?: number;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/contracts/{contract_id}/items/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts_contract_id_items).
             */
            export interface Item {
                /**
                 * True if the contract issuer has submitted this item with the contract, false if the isser is asking for this item in the contract.
                 */
                is_included: boolean;
                is_singleton: boolean;
                /**
                 * Number of items in the stack.
                 */
                quantity: number;
                /**
                 * -1 indicates that the item is a singleton (non-stackable). If the item happens to be a Blueprint, -1 is an Original and -2 is a Blueprint Copy.
                 */
                raw_quantity?: number;
                /**
                 * Unique ID for the item.
                 */
                record_id: number;
                /**
                 * Type ID for item.
                 */
                type_id: number;
            }
            /**
             * Status of the the contract.
             */
            export const enum Status {
                CANCELLED = "cancelled",
                DELETED = "deleted",
                FAILED = "failed",
                FINISHED = "finished",
                FINISHED_CONTRACTOR = "finished_contractor",
                FINISHED_ISSUER = "finished_issuer",
                IN_PROGRESS = "in_progress",
                OUTSTANDING = "outstanding",
                REJECTED = "rejected",
                REVERSED = "reversed"
            }
            /**
             * Type of the contract.
             */
            export const enum Type {
                AUCTION = "auction",
                COURIER = "courier",
                ITEM_EXCHANGE = "item_exchange",
                LOAN = "loan",
                UNKNOWN = "unknown"
            }
        }
        export namespace fitting {
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/fittings/`](https://esi.tech.ccp.is//#!/Fittings/get_characters_character_id_fittings).
             */
            export interface Fitting {
                description: string;
                fitting_id: number;
                items: esi.character.fitting.Item[];
                name: string;
                ship_type_id: number;
            }
            /**
             * This is the response type for the route, [`POST /v1/characters/{character_id}/fittings/`](https://esi.tech.ccp.is//#!/Fittings/post_characters_character_id_fittings).
             */
            export interface FittingID {
                fitting_id: number;
            }
            export interface Item {
                flag: number;
                quantity: number;
                type_id: number;
            }
            /**
             * This type is a parameter for the route, [`POST /v1/characters/{character_id}/fittings/`](https://esi.tech.ccp.is//#!/Fittings/post_characters_character_id_fittings).
             */
            export interface NewFitting {
                description: string;
                items: esi.character.fitting.Item[];
                name: string;
                ship_type_id: number;
            }
        }
        export namespace mail {
            /**
             * Hexadecimal string representing label color, in RGB format.
             */
            export const enum Color {
                C_0000FE = "#0000fe",
                C_006634 = "#006634",
                C_0099FF = "#0099ff",
                C_00FF33 = "#00ff33",
                C_01FFFF = "#01ffff",
                C_349800 = "#349800",
                C_660066 = "#660066",
                C_666666 = "#666666",
                C_999999 = "#999999",
                C_99FFFF = "#99ffff",
                C_9A0000 = "#9a0000",
                C_CCFF9A = "#ccff9a",
                C_E6E6E6 = "#e6e6e6",
                C_FE0000 = "#fe0000",
                C_FF6600 = "#ff6600",
                C_FFFF01 = "#ffff01",
                C_FFFFCD = "#ffffcd",
                C_FFFFFF = "#ffffff"
            }
            export interface Label {
                color?: esi.character.mail.Color;
                label_id?: number;
                name?: string;
                unread_count?: number;
            }
            /**
             * This is the response type for the route, [`GET /v3/characters/{character_id}/mail/labels/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_labels).
             */
            export interface Labels {
                labels?: esi.character.mail.Label[];
                total_unread_count?: number;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/mail/lists/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_lists).
             */
            export interface List {
                /**
                 * Mailing list ID.
                 */
                mailing_list_id: number;
                name: string;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_mail_id).
             */
            export interface Mail {
                body?: string;
                /**
                 * From whom the mail was sent.
                 */
                from?: number;
                /**
                 * Labels attached to the mail.
                 */
                labels?: number[];
                /**
                 * Whether the mail is flagged as read.
                 */
                read?: boolean;
                /**
                 * Recipients of the mail.
                 */
                recipients?: esi.character.mail.Recipient[];
                subject?: string;
                /**
                 * When the mail was sent.
                 */
                timestamp?: string;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/mail/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail).
             */
            export interface MailHeader {
                /**
                 * From whom the mail was sent.
                 */
                from?: number;
                is_read?: boolean;
                labels?: number[];
                mail_id?: number;
                /**
                 * Recipients of the mail.
                 */
                recipients?: esi.character.mail.Recipient[];
                subject?: string;
                /**
                 * When the mail was sent.
                 */
                timestamp?: string;
            }
            /**
             * This type is a parameter for the route, [`PUT /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/put_characters_character_id_mail_mail_id).
             */
            export interface MailUpdate {
                /**
                 * Labels to assign to the mail. Pre-existing labels are unassigned.
                 */
                labels?: number[];
                /**
                 * Whether the mail is flagged as read.
                 */
                read?: boolean;
            }
            /**
             * This type is a parameter for the route, [`POST /v2/characters/{character_id}/mail/labels/`](https://esi.tech.ccp.is//#!/Mail/post_characters_character_id_mail_labels).
             */
            export interface NewLabel {
                color?: esi.character.mail.Color;
                name: string;
            }
            /**
             * This type is a parameter for the route, [`POST /v1/characters/{character_id}/mail/`](https://esi.tech.ccp.is//#!/Mail/post_characters_character_id_mail).
             */
            export interface NewMail {
                approved_cost?: number;
                body: string;
                recipients: esi.character.mail.Recipient[];
                subject: string;
            }
            /**
             * This type is a parameter for the route, [`POST /v1/ui/openwindow/newmail/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_newmail).
             */
            export interface NewMailWindow {
                body: string;
                recipients: number[];
                subject: string;
                to_corp_or_alliance_id?: number;
                /**
                 * Corporations, alliances and mailing lists are all types of mailing groups. You may only send to one mailing group, at a time, so you may fill out either this field or the to_corp_or_alliance_ids field.
                 */
                to_mailing_list_id?: number;
            }
            export interface Recipient {
                recipient_id: number;
                recipient_type: esi.character.mail.RecipientType;
            }
            export const enum RecipientType {
                ALLIANCE = "alliance",
                CHARACTER = "character",
                CORPORATION = "corporation",
                MAILING_LIST = "mailing_list"
            }
        }
        export namespace notification {
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/notifications/contacts/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_notifications_contacts).
             */
            export interface ContactNotification {
                message: string;
                notification_id: number;
                send_date: string;
                sender_character_id: number;
                /**
                 * A number representing the standing level the receiver has been added at by the sender. The standing levels are as follows: -10 -> Terrible | -5 -> Bad |  0 -> Neutral |  5 -> Good |  10 -> Excellent.
                 */
                standing_level: number;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/notifications/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_notifications).
             */
            export interface Notification {
                is_read?: boolean;
                notification_id: number;
                sender_id: number;
                sender_type: esi.character.notification.SenderType;
                text?: string;
                timestamp: string;
                type: esi.character.notification.Type;
            }
            export const enum SenderType {
                ALLIANCE = "alliance",
                CHARACTER = "character",
                CORPORATION = "corporation",
                FACTION = "faction",
                OTHER = "other"
            }
            export const enum Type {
                ACCEPTED_ALLY = "AcceptedAlly",
                ACCEPTED_SURRENDER = "AcceptedSurrender",
                ALL_ANCHORING_MSG = "AllAnchoringMsg",
                ALL_MAINTENANCE_BILL_MSG = "AllMaintenanceBillMsg",
                ALL_STRUC_INVULNERABLE_MSG = "AllStrucInvulnerableMsg",
                ALL_STRUCT_VULNERABLE_MSG = "AllStructVulnerableMsg",
                ALL_WAR_CORP_JOINED_ALLIANCE_MSG = "AllWarCorpJoinedAllianceMsg",
                ALL_WAR_DECLARED_MSG = "AllWarDeclaredMsg",
                ALL_WAR_INVALIDATED_MSG = "AllWarInvalidatedMsg",
                ALL_WAR_RETRACTED_MSG = "AllWarRetractedMsg",
                ALL_WAR_SURRENDER_MSG = "AllWarSurrenderMsg",
                ALLIANCE_CAPITAL_CHANGED = "AllianceCapitalChanged",
                ALLY_CONTRACT_CANCELLED = "AllyContractCancelled",
                ALLY_JOINED_WAR_AGGRESSOR_MSG = "AllyJoinedWarAggressorMsg",
                ALLY_JOINED_WAR_ALLY_MSG = "AllyJoinedWarAllyMsg",
                ALLY_JOINED_WAR_DEFENDER_MSG = "AllyJoinedWarDefenderMsg",
                BATTLE_PUNISH_FRIENDLY_FIRE = "BattlePunishFriendlyFire",
                BILL_OUT_OF_MONEY_MSG = "BillOutOfMoneyMsg",
                BILL_PAID_CORP_ALL_MSG = "BillPaidCorpAllMsg",
                BOUNTY_CLAIM_MSG = "BountyClaimMsg",
                BOUNTY_ESSSHARED = "BountyESSShared",
                BOUNTY_ESSTAKEN = "BountyESSTaken",
                BOUNTY_PLACED_ALLIANCE = "BountyPlacedAlliance",
                BOUNTY_PLACED_CHAR = "BountyPlacedChar",
                BOUNTY_PLACED_CORP = "BountyPlacedCorp",
                BOUNTY_YOUR_BOUNTY_CLAIMED = "BountyYourBountyClaimed",
                BUDDY_CONNECT_CONTACT_ADD = "BuddyConnectContactAdd",
                CHAR_APP_ACCEPT_MSG = "CharAppAcceptMsg",
                CHAR_APP_REJECT_MSG = "CharAppRejectMsg",
                CHAR_APP_WITHDRAW_MSG = "CharAppWithdrawMsg",
                CHAR_LEFT_CORP_MSG = "CharLeftCorpMsg",
                CHAR_MEDAL_MSG = "CharMedalMsg",
                CHAR_TERMINATION_MSG = "CharTerminationMsg",
                CLONE_ACTIVATION_MSG = "CloneActivationMsg",
                CLONE_ACTIVATION_MSG_2 = "CloneActivationMsg2",
                CLONE_MOVED_MSG = "CloneMovedMsg",
                CLONE_REVOKED_MSG_1 = "CloneRevokedMsg1",
                CLONE_REVOKED_MSG_2 = "CloneRevokedMsg2",
                CONTACT_ADD = "ContactAdd",
                CONTACT_EDIT = "ContactEdit",
                CONTAINER_PASSWORD_MSG = "ContainerPasswordMsg",
                CORP_ALL_BILL_MSG = "CorpAllBillMsg",
                CORP_APP_ACCEPT_MSG = "CorpAppAcceptMsg",
                CORP_APP_INVITED_MSG = "CorpAppInvitedMsg",
                CORP_APP_NEW_MSG = "CorpAppNewMsg",
                CORP_APP_REJECT_CUSTOM_MSG = "CorpAppRejectCustomMsg",
                CORP_APP_REJECT_MSG = "CorpAppRejectMsg",
                CORP_DIVIDEND_MSG = "CorpDividendMsg",
                CORP_FRIENDLY_FIRE_DISABLE_TIMER_COMPLETED = "CorpFriendlyFireDisableTimerCompleted",
                CORP_FRIENDLY_FIRE_DISABLE_TIMER_STARTED = "CorpFriendlyFireDisableTimerStarted",
                CORP_FRIENDLY_FIRE_ENABLE_TIMER_COMPLETED = "CorpFriendlyFireEnableTimerCompleted",
                CORP_FRIENDLY_FIRE_ENABLE_TIMER_STARTED = "CorpFriendlyFireEnableTimerStarted",
                CORP_KICKED = "CorpKicked",
                CORP_LIQUIDATION_MSG = "CorpLiquidationMsg",
                CORP_NEW_CEOMSG = "CorpNewCEOMsg",
                CORP_NEWS_MSG = "CorpNewsMsg",
                CORP_OFFICE_EXPIRATION_MSG = "CorpOfficeExpirationMsg",
                CORP_STRUCT_LOST_MSG = "CorpStructLostMsg",
                CORP_TAX_CHANGE_MSG = "CorpTaxChangeMsg",
                CORP_VOTE_CEOREVOKED_MSG = "CorpVoteCEORevokedMsg",
                CORP_VOTE_MSG = "CorpVoteMsg",
                CORP_WAR_DECLARED_MSG = "CorpWarDeclaredMsg",
                CORP_WAR_FIGHTING_LEGAL_MSG = "CorpWarFightingLegalMsg",
                CORP_WAR_INVALIDATED_MSG = "CorpWarInvalidatedMsg",
                CORP_WAR_RETRACTED_MSG = "CorpWarRetractedMsg",
                CORP_WAR_SURRENDER_MSG = "CorpWarSurrenderMsg",
                CUSTOMS_MSG = "CustomsMsg",
                DECLARE_WAR = "DeclareWar",
                DISTRICT_ATTACKED = "DistrictAttacked",
                DUST_APP_ACCEPTED_MSG = "DustAppAcceptedMsg",
                ENTOSIS_CAPTURE_STARTED = "EntosisCaptureStarted",
                FAC_WAR_CORP_JOIN_REQUEST_MSG = "FacWarCorpJoinRequestMsg",
                FAC_WAR_CORP_JOIN_WITHDRAW_MSG = "FacWarCorpJoinWithdrawMsg",
                FAC_WAR_CORP_LEAVE_REQUEST_MSG = "FacWarCorpLeaveRequestMsg",
                FAC_WAR_CORP_LEAVE_WITHDRAW_MSG = "FacWarCorpLeaveWithdrawMsg",
                FAC_WAR_LPDISQUALIFIED_EVENT = "FacWarLPDisqualifiedEvent",
                FAC_WAR_LPDISQUALIFIED_KILL = "FacWarLPDisqualifiedKill",
                FAC_WAR_LPPAYOUT_EVENT = "FacWarLPPayoutEvent",
                FAC_WAR_LPPAYOUT_KILL = "FacWarLPPayoutKill",
                FWALLIANCE_KICK_MSG = "FWAllianceKickMsg",
                FWALLIANCE_WARNING_MSG = "FWAllianceWarningMsg",
                FWCHAR_KICK_MSG = "FWCharKickMsg",
                FWCHAR_RANK_GAIN_MSG = "FWCharRankGainMsg",
                FWCHAR_RANK_LOSS_MSG = "FWCharRankLossMsg",
                FWCHAR_WARNING_MSG = "FWCharWarningMsg",
                FWCORP_JOIN_MSG = "FWCorpJoinMsg",
                FWCORP_KICK_MSG = "FWCorpKickMsg",
                FWCORP_LEAVE_MSG = "FWCorpLeaveMsg",
                FWCORP_WARNING_MSG = "FWCorpWarningMsg",
                GAME_TIME_ADDED = "GameTimeAdded",
                GAME_TIME_RECEIVED = "GameTimeReceived",
                GAME_TIME_SENT = "GameTimeSent",
                GIFT_RECEIVED = "GiftReceived",
                IHUB_DESTROYED_BY_BILL_FAILURE = "IHubDestroyedByBillFailure",
                INCURSION_COMPLETED_MSG = "IncursionCompletedMsg",
                INDUSTRY_TEAM_AUCTION_LOST = "IndustryTeamAuctionLost",
                INDUSTRY_TEAM_AUCTION_WON = "IndustryTeamAuctionWon",
                INFRASTRUCTURE_HUB_BILL_ABOUT_TO_EXPIRE = "InfrastructureHubBillAboutToExpire",
                INSURANCE_EXPIRATION_MSG = "InsuranceExpirationMsg",
                INSURANCE_FIRST_SHIP_MSG = "InsuranceFirstShipMsg",
                INSURANCE_INVALIDATED_MSG = "InsuranceInvalidatedMsg",
                INSURANCE_ISSUED_MSG = "InsuranceIssuedMsg",
                INSURANCE_PAYOUT_MSG = "InsurancePayoutMsg",
                JUMP_CLONE_DELETED_MSG_1 = "JumpCloneDeletedMsg1",
                JUMP_CLONE_DELETED_MSG_2 = "JumpCloneDeletedMsg2",
                KILL_REPORT_FINAL_BLOW = "KillReportFinalBlow",
                KILL_REPORT_VICTIM = "KillReportVictim",
                KILL_RIGHT_AVAILABLE = "KillRightAvailable",
                KILL_RIGHT_AVAILABLE_OPEN = "KillRightAvailableOpen",
                KILL_RIGHT_EARNED = "KillRightEarned",
                KILL_RIGHT_UNAVAILABLE = "KillRightUnavailable",
                KILL_RIGHT_UNAVAILABLE_OPEN = "KillRightUnavailableOpen",
                KILL_RIGHT_USED = "KillRightUsed",
                LOCATE_CHAR_MSG = "LocateCharMsg",
                MADE_WAR_MUTUAL = "MadeWarMutual",
                MERC_OFFERED_NEGOTIATION_MSG = "MercOfferedNegotiationMsg",
                MISSION_OFFER_EXPIRATION_MSG = "MissionOfferExpirationMsg",
                MISSION_TIMEOUT_MSG = "MissionTimeoutMsg",
                NPCSTANDINGS_GAINED = "NPCStandingsGained",
                NPCSTANDINGS_LOST = "NPCStandingsLost",
                OFFERED_SURRENDER = "OfferedSurrender",
                OFFERED_TO_ALLY = "OfferedToAlly",
                OLD_LSC_MESSAGES = "OldLscMessages",
                OPERATION_FINISHED = "OperationFinished",
                ORBITAL_ATTACKED = "OrbitalAttacked",
                ORBITAL_REINFORCED = "OrbitalReinforced",
                OWNERSHIP_TRANSFERRED = "OwnershipTransferred",
                REIMBURSEMENT_MSG = "ReimbursementMsg",
                RESEARCH_MISSION_AVAILABLE_MSG = "ResearchMissionAvailableMsg",
                RETRACTS_WAR = "RetractsWar",
                SEASONAL_CHALLENGE_COMPLETED = "SeasonalChallengeCompleted",
                SOV_ALL_CLAIM_AQUIRED_MSG = "SovAllClaimAquiredMsg",
                SOV_ALL_CLAIM_LOST_MSG = "SovAllClaimLostMsg",
                SOV_COMMAND_NODE_EVENT_STARTED = "SovCommandNodeEventStarted",
                SOV_CORP_BILL_LATE_MSG = "SovCorpBillLateMsg",
                SOV_CORP_CLAIM_FAIL_MSG = "SovCorpClaimFailMsg",
                SOV_DISRUPTOR_MSG = "SovDisruptorMsg",
                SOV_STATION_ENTERED_FREEPORT = "SovStationEnteredFreeport",
                SOV_STRUCTURE_DESTROYED = "SovStructureDestroyed",
                SOV_STRUCTURE_REINFORCED = "SovStructureReinforced",
                SOV_STRUCTURE_SELF_DESTRUCT_CANCEL = "SovStructureSelfDestructCancel",
                SOV_STRUCTURE_SELF_DESTRUCT_FINISHED = "SovStructureSelfDestructFinished",
                SOV_STRUCTURE_SELF_DESTRUCT_REQUESTED = "SovStructureSelfDestructRequested",
                SOVEREIGNTY_IHDAMAGE_MSG = "SovereigntyIHDamageMsg",
                SOVEREIGNTY_SBUDAMAGE_MSG = "SovereigntySBUDamageMsg",
                SOVEREIGNTY_TCUDAMAGE_MSG = "SovereigntyTCUDamageMsg",
                STATION_AGGRESSION_MSG_1 = "StationAggressionMsg1",
                STATION_AGGRESSION_MSG_2 = "StationAggressionMsg2",
                STATION_CONQUER_MSG = "StationConquerMsg",
                STATION_SERVICE_DISABLED = "StationServiceDisabled",
                STATION_SERVICE_ENABLED = "StationServiceEnabled",
                STATION_STATE_CHANGE_MSG = "StationStateChangeMsg",
                STORY_LINE_MISSION_AVAILABLE_MSG = "StoryLineMissionAvailableMsg",
                STRUCTURE_ANCHORING = "StructureAnchoring",
                STRUCTURE_COURIER_CONTRACT_CHANGED = "StructureCourierContractChanged",
                STRUCTURE_DESTROYED = "StructureDestroyed",
                STRUCTURE_FUEL_ALERT = "StructureFuelAlert",
                STRUCTURE_ITEMS_DELIVERED = "StructureItemsDelivered",
                STRUCTURE_LOST_ARMOR = "StructureLostArmor",
                STRUCTURE_LOST_SHIELDS = "StructureLostShields",
                STRUCTURE_ONLINE = "StructureOnline",
                STRUCTURE_SERVICES_OFFLINE = "StructureServicesOffline",
                STRUCTURE_UNANCHORING = "StructureUnanchoring",
                STRUCTURE_UNDER_ATTACK = "StructureUnderAttack",
                TOWER_ALERT_MSG = "TowerAlertMsg",
                TOWER_RESOURCE_ALERT_MSG = "TowerResourceAlertMsg",
                TRANSACTION_REVERSAL_MSG = "TransactionReversalMsg",
                TUTORIAL_MSG = "TutorialMsg",
                WAR_ALLY_OFFER_DECLINED_MSG = "WarAllyOfferDeclinedMsg",
                WAR_SURRENDER_DECLINED_MSG = "WarSurrenderDeclinedMsg",
                WAR_SURRENDER_OFFER_MSG = "WarSurrenderOfferMsg"
            }
        }
        export namespace planetaryinteraction {
            export interface Content {
                amount: number;
                type_id: number;
            }
            export interface ExtractorHead {
                head_id: number;
                latitude: number;
                longitude: number;
            }
            export interface Link {
                destination_pin_id: number;
                link_level: number;
                source_pin_id: number;
            }
            export interface Pin {
                contents?: esi.character.planetaryinteraction.Content[];
                expiry_time?: string;
                extractor_details?: {
                    cycle_time?: number;
                    head_radius?: number;
                    heads: esi.character.planetaryinteraction.ExtractorHead[];
                    product_type_id?: number;
                    qty_per_cycle?: number;
                };
                factory_details?: {
                    schematic_id: number;
                };
                install_time?: string;
                last_cycle_start?: string;
                latitude: number;
                longitude: number;
                pin_id: number;
                schematic_id?: number;
                type_id: number;
            }
            /**
             * This is the response type for the route, [`GET /v3/characters/{character_id}/planets/{planet_id}/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_characters_character_id_planets_planet_id).
             */
            export interface Planet {
                links: esi.character.planetaryinteraction.Link[];
                pins: esi.character.planetaryinteraction.Pin[];
                routes: esi.character.planetaryinteraction.Route[];
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/planets/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_characters_character_id_planets).
             */
            export interface PlanetSummary {
                last_update: string;
                num_pins: number;
                owner_id: number;
                planet_id: number;
                planet_type: esi.character.planetaryinteraction.PlanetType;
                solar_system_id: number;
                upgrade_level: number;
            }
            export const enum PlanetType {
                BARREN = "barren",
                GAS = "gas",
                ICE = "ice",
                LAVA = "lava",
                OCEANIC = "oceanic",
                PLASMA = "plasma",
                STORM = "storm",
                TEMPERATE = "temperate"
            }
            export interface Route {
                content_type_id: number;
                destination_pin_id: number;
                quantity: number;
                route_id: number;
                source_pin_id: number;
                /**
                 * List of pin ID waypoints.
                 */
                waypoints?: number[];
            }
        }
        export namespace wallet {
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/wallet/journal/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet_journal).
             */
            export interface Journal {
                /**
                 * Transaction amount. Positive when value transferred to the first party. Negative otherwise.
                 */
                amount?: number;
                /**
                 * Wallet balance after transaction occurred.
                 */
                balance?: number;
                /**
                 * Date and time of transaction.
                 */
                date: string;
                /**
                 * Extra information for different type of transaction.
                 */
                extra_info?: {
                    alliance_id?: number;
                    character_id?: number;
                    contract_id?: number;
                    corporation_id?: number;
                    destroyed_ship_type_id?: number;
                    job_id?: number;
                    location_id?: number;
                    npc_id?: number;
                    npc_name?: string;
                    planet_id?: number;
                    system_id?: number;
                    transaction_id?: number;
                };
                first_party_id?: number;
                first_party_type?: esi.EntityType;
                reason?: string;
                /**
                 * Unique journal reference ID.
                 */
                ref_id: number;
                ref_type: esi.character.wallet.TransactionType;
                second_party_id?: number;
                second_party_type?: esi.EntityType;
                /**
                 * Tax amount received for tax related transactions.
                 */
                tax?: number;
                /**
                 * The corporation ID receiving any tax paid.
                 */
                tax_reciever_id?: number;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/wallet/transactions/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet_transactions).
             */
            export interface Transaction {
                client_id: number;
                /**
                 * Date and time of transaction.
                 */
                date: string;
                is_buy: boolean;
                is_personal: boolean;
                journal_ref_id: number;
                location_id: number;
                quantity: number;
                /**
                 * Unique transaction ID.
                 */
                transaction_id: number;
                type_id: number;
                /**
                 * Amount paid per unit.
                 */
                unit_price: number;
            }
            /**
             * Transaction type, different type of transaction will populate different fields in `extra_info`.
             */
            export const enum TransactionType {
                ALLIANCE_MAINTENANCE_FEE = "alliance_maintenance_fee",
                BOUNTY_PRIZE_HISTORICAL = "bounty_prize_historical",
                BOUNTY_PRIZES = "bounty_prizes",
                BROKER_FEE = "broker_fee",
                CONTRACT = "contract",
                CORP_ACCOUNT_WITHDRAWAL = "corp_account_withdrawal",
                CORPORATE_REWARD_PAYOUT = "corporate_reward_payout",
                CSPA = "cspa",
                CUSTOMS_OFFICE_EXPORT_DUTY = "customs_office_export_duty",
                CUSTOMS_OFFICE_IMPORT_DUTY = "customs_office_import_duty",
                INDUSTRY_FACILITY_TAX = "industry_facility_tax",
                INSURANCE = "insurance",
                JUMP_CLONE_ACTIVATION_FEE = "jump_clone_activation_fee",
                JUMP_CLONE_INSTALLATION_FEE = "jump_clone_installation_fee",
                LOGO_CHANGE_FEE = "logo_change_fee",
                MANUFACTURING = "manufacturing",
                MARKET_ESCROW = "market_escrow",
                MARKET_TRANSACTION = "market_transaction",
                MEDAL_CREATION_FEE = "medal_creation_fee",
                MEDAL_ISSUING_FEE = "medal_issuing_fee",
                MISSION_REWARD = "mission_reward",
                MISSION_REWARD_BONUS = "mission_reward_bonus",
                OFFICE_RENTAL_FEE = "office_rental_fee",
                PLAYER_DONATION = "player_donation",
                PLAYER_TRADING = "player_trading",
                PROJECT_DISCOVERY_REWARD = "project_discovery_reward",
                REPROCESSING_FEE = "reprocessing_fee",
                SALES_TAX = "sales_tax",
                UNKNOWN = "unknown"
            }
        }
        /**
         * This is the response type for the route, [`POST /v1/characters/affiliation/`](https://esi.tech.ccp.is//#!/Character/post_characters_affiliation).
         */
        export interface Affiliation {
            /**
             * The character's alliance ID, if their corporation is in an alliance.
             */
            alliance_id?: number;
            /**
             * The character's ID.
             */
            character_id: number;
            /**
             * The character's corporation ID.
             */
            corporation_id: number;
            /**
             * The character's faction ID, if their corporation is in a faction.
             */
            faction_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/agents_research/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_agents_research).
         */
        export interface AgentResearch {
            agent_id: number;
            points_per_day: number;
            remainder_points: number;
            skill_type_id: number;
            started_at: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/attributes/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_attributes).
         */
        export interface Attributes {
            /**
             * Neural remapping cooldown after a character uses remap accrued over time.
             */
            accrued_remap_cooldown_date?: string;
            /**
             * Number of available bonus character neural remaps.
             */
            bonus_remaps?: number;
            charisma: number;
            intelligence: number;
            /**
             * Datetime of last neural remap, including usage of bonus remaps.
             */
            last_remap_date?: string;
            memory: number;
            perception: number;
            willpower: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/bookmarks/`](https://esi.tech.ccp.is//#!/Bookmarks/get_characters_character_id_bookmarks).
         */
        export interface Bookmark {
            bookmark_id: number;
            create_date: string;
            creator_id: number;
            folder_id?: number;
            memo: string;
            note: string;
            owner_id: number;
            target: {
                coordinates?: {
                    x: number;
                    y: number;
                    z: number;
                };
                item?: {
                    item_id: number;
                    type_id: number;
                };
                location_id: number;
            };
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/bookmarks/folders/`](https://esi.tech.ccp.is//#!/Bookmarks/get_characters_character_id_bookmarks_folders).
         */
        export interface BookmarksFolder {
            folder_id?: number;
            name?: string;
            owner_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v4/characters/{character_id}/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id).
         */
        export interface Character {
            /**
             * The character's alliance ID.
             */
            alliance_id?: number;
            ancestry_id?: number;
            /**
             * Creation date of the character.
             */
            birthday: string;
            bloodline_id: number;
            /**
             * The character's corporation ID.
             */
            corporation_id: number;
            description?: string;
            gender: "female" | "male";
            name: string;
            race_id: number;
            security_status?: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/characters/{character_id}/clones/`](https://esi.tech.ccp.is//#!/Clones/get_characters_character_id_clones).
         */
        export interface Clones {
            home_location?: {
                location_id?: number;
                location_type?: "station" | "structure";
            };
            jump_clones: esi.character.JumpClone[];
            last_jump_date?: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/get_characters_character_id_contacts).
         */
        export interface Contact {
            contact_id: number;
            contact_type: esi.EntityType;
            /**
             * Whether this contact is in the blocked list. Note a missing value denotes unknown, not true or false.
             */
            is_blocked?: boolean;
            /**
             * Whether this contact is being watched.
             */
            is_watched?: boolean;
            /**
             * Custom label of the contact.
             */
            label_id?: number;
            /**
             * Standing of the contact.
             */
            standing: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/contacts/labels/`](https://esi.tech.ccp.is//#!/Contacts/get_characters_character_id_contacts_labels).
         */
        export interface ContactLabel {
            label_id: number;
            label_name: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/corporationhistory/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_corporationhistory).
         */
        export interface CorporationHistory {
            corporation_id: number;
            /**
             * True if the corporation has been deleted.
             */
            is_deleted?: boolean;
            /**
             * An incrementing ID that can be used to canonically establish order of records in cases where dates may be ambiguous.
             */
            record_id: number;
            start_date: string;
        }
        /**
         * This type is a parameter for the route, [`POST /v3/characters/{character_id}/cspa/`](https://esi.tech.ccp.is//#!/Character/post_characters_character_id_cspa).
         */
        export interface CSPACharacters {
            characters: number[];
        }
        /**
         * This is the response type for the route, [`POST /v3/characters/{character_id}/cspa/`](https://esi.tech.ccp.is//#!/Character/post_characters_character_id_cspa).
         */
        export interface CSPACost {
            cost?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/fatigue/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_fatigue).
         */
        export interface Fatigue {
            /**
             * Character's jump fatigue expiry.
             */
            jump_fatigue_expire_date?: string;
            /**
             * Character's last jump activation.
             */
            last_jump_date?: string;
            /**
             * Character's last jump update.
             */
            last_update_date?: string;
        }
        export interface Graphic {
            color?: number;
            graphic: string;
            layer: number;
            part: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/industry/jobs/`](https://esi.tech.ccp.is//#!/Industry/get_characters_character_id_industry_jobs).
         */
        export interface IndustryJob {
            /**
             * Job activity ID.
             */
            activity_id: number;
            blueprint_id: number;
            /**
             * Location ID of the location from which the blueprint was installed. Normally a station ID, but can also be an asset (e.g. container) or corporation facility.
             */
            blueprint_location_id: number;
            blueprint_type_id: number;
            /**
             * ID of the character which completed this job.
             */
            completed_character_id?: number;
            /**
             * Date and time when this job was completed.
             */
            completed_date?: string;
            /**
             * The sume of job installation fee and industry facility tax.
             */
            cost?: number;
            /**
             * Job duration in seconds.
             */
            duration: number;
            /**
             * Date and time when this job finished.
             */
            end_date: string;
            /**
             * ID of the facility where this job is running.
             */
            facility_id: number;
            /**
             * ID of the character which installed this job.
             */
            installer_id: number;
            /**
             * Unique job ID.
             */
            job_id: number;
            /**
             * Number of runs blueprint is licensed for.
             */
            licensed_runs?: number;
            /**
             * Location ID of the location to which the output of the job will be delivered. Normally a station ID, but can also be a corporation facility.
             */
            output_location_id: number;
            /**
             * Date and time when this job was paused (i.e. time when the facility where this job was installed went offline).
             */
            pause_date?: string;
            /**
             * Chance of success for invention.
             */
            probability?: number;
            /**
             * Type ID of product (manufactured, copied or invented).
             */
            product_type_id?: number;
            /**
             * Number of runs for a manufacturing job, or number of copies to make for a blueprint copy.
             */
            runs: number;
            /**
             * Date and time when this job started.
             */
            start_date: string;
            /**
             * ID of the station where industry facility is located.
             */
            station_id: number;
            status: esi.character.JobStatus;
            /**
             * Number of successful runs for this job. Equal to runs unless this is an invention job.
             */
            successful_runs?: number;
        }
        export const enum JobStatus {
            ACTIVE = "active",
            CANCELLED = "cancelled",
            DELIVERED = "delivered",
            PAUSED = "paused",
            READY = "ready",
            REVERTED = "reverted"
        }
        export interface JumpClone {
            implants?: number[];
            location_id?: number;
            location_type?: "station" | "structure";
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/location/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_location).
         */
        export interface Location {
            solar_system_id: number;
            station_id?: number;
            structure_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/loyalty/points/`](https://esi.tech.ccp.is//#!/Loyalty/get_characters_character_id_loyalty_points).
         */
        export interface LoyaltyPoints {
            corporation_id: number;
            loyalty_points: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/medals/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_medals).
         */
        export interface Medal {
            corporation_id: number;
            date: string;
            description: string;
            graphics: esi.character.Graphic[];
            issuer_id: number;
            medal_id: number;
            reason: string;
            status: "public" | "private";
            title: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/names/`](https://esi.tech.ccp.is//#!/Character/get_characters_names).
         */
        export interface Name {
            character_id: number;
            character_name: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/opportunities/`](https://esi.tech.ccp.is//#!/Opportunities/get_characters_character_id_opportunities).
         */
        export interface Opportunity {
            completed_at: string;
            task_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/orders/`](https://esi.tech.ccp.is//#!/Market/get_characters_character_id_orders).
         */
        export interface Order {
            /**
             * Wallet division for the buyer or seller of this order. Always 1000 for characters. Currently 1000 through 1006 for corporations.
             */
            account_id: number;
            /**
             * Numer of days for which order is valid (starting from the issued date). An order expires at time issued + duration.
             */
            duration: number;
            /**
             * For buy orders, the amount of ISK in escrow.
             */
            escrow: number;
            /**
             * True for a bid (buy) order. False for an offer (sell) order.
             */
            is_buy_order: boolean;
            is_corp: boolean;
            /**
             * Date and time when this order was issued.
             */
            issued: string;
            /**
             * ID of the location where order was placed.
             */
            location_id: number;
            /**
             * For bids (buy orders), the minimum quantity that will be accepted in a matching offer (sell order).
             */
            min_volume: number;
            /**
             * Unique order ID.
             */
            order_id: number;
            /**
             * Cost per unit for this order.
             */
            price: number;
            range: esi.OrderRange;
            /**
             * ID of the region where order was placed.
             */
            region_id: number;
            state: esi.character.OrderState;
            /**
             * The type ID of the item transacted in this order.
             */
            type_id: number;
            /**
             * Quantity of items still required or offered.
             */
            volume_remain: number;
            /**
             * Quantity of items required or offered at time order was placed.
             */
            volume_total: number;
        }
        /**
         * Current order state.
         */
        export const enum OrderState {
            CANCELLED = "cancelled",
            CHARACTER_DELETED = "character_deleted",
            CLOSED = "closed",
            EXPIRED = "expired",
            OPEN = "open",
            PENDING = "pending"
        }
        /**
         * This is the response type for the route, [`GET /v2/characters/{character_id}/portrait/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_portrait).
         */
        export interface Portrait {
            px128x128?: string;
            px256x256?: string;
            px512x512?: string;
            px64x64?: string;
        }
        /**
         * This is the response type for the route, [`GET /v2/characters/{character_id}/search/`](https://esi.tech.ccp.is//#!/Search/get_characters_character_id_search).
         */
        export interface Search {
            agent?: number[];
            alliance?: number[];
            character?: number[];
            constellation?: number[];
            corporation?: number[];
            faction?: number[];
            inventorytype?: number[];
            region?: number[];
            solarsystem?: number[];
            station?: number[];
            structure?: number[];
            wormhole?: number[];
        }
        export const enum SearchCategory {
            AGENT = "agent",
            ALLIANCE = "alliance",
            CHARACTER = "character",
            CONSTELLATION = "constellation",
            CORPORATION = "corporation",
            FACTION = "faction",
            INVENTORYTYPE = "inventorytype",
            REGION = "region",
            SOLARSYSTEM = "solarsystem",
            STATION = "station",
            STRUCTURE = "structure",
            WORMHOLE = "wormhole"
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/ship/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_ship).
         */
        export interface Ship {
            /**
             * Item id's are unique to a ship and persist until it is repackaged. This value can be used to track repeated uses of a ship, or detect when a pilot changes into a different instance of the same ship type.
             */
            ship_item_id: number;
            ship_name: string;
            ship_type_id: number;
        }
        export interface Skill {
            current_skill_level?: number;
            skill_id?: number;
            skillpoints_in_skill?: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/characters/{character_id}/skillqueue/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_skillqueue).
         */
        export interface Skillqueue {
            finish_date?: string;
            finished_level: number;
            level_end_sp?: number;
            /**
             * Amount of SP that was in the skill when it started training it's current level. Used to calculate % of current level complete.
             */
            level_start_sp?: number;
            queue_position: number;
            skill_id: number;
            start_date?: string;
            training_start_sp?: number;
        }
        /**
         * This is the response type for the route, [`GET /v3/characters/{character_id}/skills/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_skills).
         */
        export interface Skills {
            skills?: esi.character.Skill[];
            total_sp?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/standings/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_standings).
         */
        export interface Standing {
            from_id: number;
            from_type: "agent" | "npc_corp" | "faction";
            standing: number;
        }
    }
    export namespace corporation {
        export namespace asset {
            /**
             * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/assets/`](https://esi.tech.ccp.is//#!/Assets/get_corporations_corporation_id_assets).
             */
            export interface Asset {
                is_singleton: boolean;
                item_id: number;
                location_flag: esi.corporation.asset.LocationType;
                location_id: number;
                location_type: "station" | "solar_system" | "other";
                quantity?: number;
                type_id: number;
            }
            /**
             * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/blueprints/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_blueprints).
             */
            export interface Blueprint {
                /**
                 * Unique ID for this item.
                 */
                item_id: number;
                location_flag: esi.corporation.asset.LocationType;
                /**
                 * References a solar system, station or item_id if this blueprint is located within a container.
                 */
                location_id: number;
                /**
                 * Material Efficiency Level of the blueprint.
                 */
                material_efficiency: number;
                /**
                 * A range of numbers with a minimum of -2 and no maximum value where -1 is an original and -2 is a copy. It can be a positive integer if it is a stack of blueprint originals fresh from the market (e.g. no activities performed on them yet).
                 */
                quantity: number;
                /**
                 * Number of runs remaining if the blueprint is a copy, -1 if it is an original.
                 */
                runs: number;
                /**
                 * Time Efficiency Level of the blueprint.
                 */
                time_efficiency: number;
                type_id: number;
            }
            /**
             * Type of the location_id.
             */
            export const enum LocationType {
                ASSET_SAFETY = "AssetSafety",
                AUTO_FIT = "AutoFit",
                BONUS = "Bonus",
                BOOSTER = "Booster",
                BOOSTER_BAY = "BoosterBay",
                CAPSULE = "Capsule",
                CARGO = "Cargo",
                CORP_DELIVERIES = "CorpDeliveries",
                CORP_SAG1 = "CorpSAG1",
                CORP_SAG2 = "CorpSAG2",
                CORP_SAG3 = "CorpSAG3",
                CORP_SAG4 = "CorpSAG4",
                CORP_SAG5 = "CorpSAG5",
                CORP_SAG6 = "CorpSAG6",
                CORP_SAG7 = "CorpSAG7",
                CRATE_LOOT = "CrateLoot",
                DELIVERIES = "Deliveries",
                DRONE_BAY = "DroneBay",
                DUST_BATTLE = "DustBattle",
                DUST_DATABANK = "DustDatabank",
                FIGHTER_BAY = "FighterBay",
                FIGHTER_TUBE_0 = "FighterTube0",
                FIGHTER_TUBE_1 = "FighterTube1",
                FIGHTER_TUBE_2 = "FighterTube2",
                FIGHTER_TUBE_3 = "FighterTube3",
                FIGHTER_TUBE_4 = "FighterTube4",
                FLEET_HANGAR = "FleetHangar",
                HANGAR = "Hangar",
                HANGAR_ALL = "HangarAll",
                HI_SLOT_0 = "HiSlot0",
                HI_SLOT_1 = "HiSlot1",
                HI_SLOT_2 = "HiSlot2",
                HI_SLOT_3 = "HiSlot3",
                HI_SLOT_4 = "HiSlot4",
                HI_SLOT_5 = "HiSlot5",
                HI_SLOT_6 = "HiSlot6",
                HI_SLOT_7 = "HiSlot7",
                HIDDEN_MODIFERS = "HiddenModifers",
                IMPLANT = "Implant",
                IMPOUNDED = "Impounded",
                JUNKYARD_REPROCESSED = "JunkyardReprocessed",
                JUNKYARD_TRASHED = "JunkyardTrashed",
                LO_SLOT_0 = "LoSlot0",
                LO_SLOT_1 = "LoSlot1",
                LO_SLOT_2 = "LoSlot2",
                LO_SLOT_3 = "LoSlot3",
                LO_SLOT_4 = "LoSlot4",
                LO_SLOT_5 = "LoSlot5",
                LO_SLOT_6 = "LoSlot6",
                LO_SLOT_7 = "LoSlot7",
                LOCKED = "Locked",
                MED_SLOT_0 = "MedSlot0",
                MED_SLOT_1 = "MedSlot1",
                MED_SLOT_2 = "MedSlot2",
                MED_SLOT_3 = "MedSlot3",
                MED_SLOT_4 = "MedSlot4",
                MED_SLOT_5 = "MedSlot5",
                MED_SLOT_6 = "MedSlot6",
                MED_SLOT_7 = "MedSlot7",
                OFFICE_FOLDER = "OfficeFolder",
                PILOT = "Pilot",
                PLANET_SURFACE = "PlanetSurface",
                QUAFE_BAY = "QuafeBay",
                REWARD = "Reward",
                RIG_SLOT_0 = "RigSlot0",
                RIG_SLOT_1 = "RigSlot1",
                RIG_SLOT_2 = "RigSlot2",
                RIG_SLOT_3 = "RigSlot3",
                RIG_SLOT_4 = "RigSlot4",
                RIG_SLOT_5 = "RigSlot5",
                RIG_SLOT_6 = "RigSlot6",
                RIG_SLOT_7 = "RigSlot7",
                SECONDARY_STORAGE = "SecondaryStorage",
                SERVICE_SLOT_0 = "ServiceSlot0",
                SERVICE_SLOT_1 = "ServiceSlot1",
                SERVICE_SLOT_2 = "ServiceSlot2",
                SERVICE_SLOT_3 = "ServiceSlot3",
                SERVICE_SLOT_4 = "ServiceSlot4",
                SERVICE_SLOT_5 = "ServiceSlot5",
                SERVICE_SLOT_6 = "ServiceSlot6",
                SERVICE_SLOT_7 = "ServiceSlot7",
                SHIP_HANGAR = "ShipHangar",
                SHIP_OFFLINE = "ShipOffline",
                SKILL = "Skill",
                SKILL_IN_TRAINING = "SkillInTraining",
                SPECIALIZED_AMMO_HOLD = "SpecializedAmmoHold",
                SPECIALIZED_COMMAND_CENTER_HOLD = "SpecializedCommandCenterHold",
                SPECIALIZED_FUEL_BAY = "SpecializedFuelBay",
                SPECIALIZED_GAS_HOLD = "SpecializedGasHold",
                SPECIALIZED_INDUSTRIAL_SHIP_HOLD = "SpecializedIndustrialShipHold",
                SPECIALIZED_LARGE_SHIP_HOLD = "SpecializedLargeShipHold",
                SPECIALIZED_MATERIAL_BAY = "SpecializedMaterialBay",
                SPECIALIZED_MEDIUM_SHIP_HOLD = "SpecializedMediumShipHold",
                SPECIALIZED_MINERAL_HOLD = "SpecializedMineralHold",
                SPECIALIZED_ORE_HOLD = "SpecializedOreHold",
                SPECIALIZED_PLANETARY_COMMODITIES_HOLD = "SpecializedPlanetaryCommoditiesHold",
                SPECIALIZED_SALVAGE_HOLD = "SpecializedSalvageHold",
                SPECIALIZED_SHIP_HOLD = "SpecializedShipHold",
                SPECIALIZED_SMALL_SHIP_HOLD = "SpecializedSmallShipHold",
                STRUCTURE_ACTIVE = "StructureActive",
                STRUCTURE_FUEL = "StructureFuel",
                STRUCTURE_INACTIVE = "StructureInactive",
                STRUCTURE_OFFLINE = "StructureOffline",
                SUB_SYSTEM_SLOT_0 = "SubSystemSlot0",
                SUB_SYSTEM_SLOT_1 = "SubSystemSlot1",
                SUB_SYSTEM_SLOT_2 = "SubSystemSlot2",
                SUB_SYSTEM_SLOT_3 = "SubSystemSlot3",
                SUB_SYSTEM_SLOT_4 = "SubSystemSlot4",
                SUB_SYSTEM_SLOT_5 = "SubSystemSlot5",
                SUB_SYSTEM_SLOT_6 = "SubSystemSlot6",
                SUB_SYSTEM_SLOT_7 = "SubSystemSlot7",
                SUBSYSTEM_BAY = "SubsystemBay",
                UNLOCKED = "Unlocked",
                WALLET = "Wallet",
                WARDROBE = "Wardrobe"
            }
        }
        export namespace structure {
            export interface Service {
                name: string;
                state: "online" | "offline" | "cleanup";
            }
            /**
             * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/structures/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_structures).
             */
            export interface Structure {
                /**
                 * ID of the corporation that owns the structure.
                 */
                corporation_id: number;
                /**
                 * This week's vulnerability windows, Monday is day 0.
                 */
                current_vul: esi.corporation.structure.VulnerabilitySchedule[];
                /**
                 * Date on which the structure will run out of fuel.
                 */
                fuel_expires?: string;
                /**
                 * Next week's vulnerability windows, Monday is day 0.
                 */
                next_vul: esi.corporation.structure.VulnerabilitySchedule[];
                /**
                 * The id of the ACL profile for this citadel.
                 */
                profile_id: number;
                /**
                 * Contains a list of service upgrades, and their state.
                 */
                services?: esi.corporation.structure.Service[];
                /**
                 * Date at which the structure will move to it's next state.
                 */
                state_timer_end?: string;
                /**
                 * Date at which the structure entered it's current state.
                 */
                state_timer_start?: string;
                /**
                 * The Item ID of the structure.
                 */
                structure_id: number;
                /**
                 * The solar system the structure is in.
                 */
                system_id: number;
                /**
                 * The type id of the structure.
                 */
                type_id: number;
                /**
                 * Date at which the structure will unanchor.
                 */
                unanchors_at?: string;
            }
            export interface VulnerabilitySchedule {
                /**
                 * Day of the week, zero-indexed to Monday.
                 */
                day: number;
                /**
                 * Hour of the day evetime, zero-indexed to midnight.
                 */
                hour: number;
            }
        }
        export namespace wallet {
            /**
             * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/wallets/{division}/journal/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets_division_journal).
             */
            export interface Journal {
                /**
                 * Transaction amount. Positive when value transferred to the first party. Negative otherwise.
                 */
                amount?: number;
                /**
                 * Wallet balance after transaction occurred.
                 */
                balance?: number;
                /**
                 * Date and time of transaction.
                 */
                date: string;
                /**
                 * Extra information for different type of transaction.
                 */
                extra_info?: {
                    alliance_id?: number;
                    character_id?: number;
                    contract_id?: number;
                    corporation_id?: number;
                    destroyed_ship_type_id?: number;
                    job_id?: number;
                    location_id?: number;
                    npc_id?: number;
                    npc_name?: string;
                    planet_id?: number;
                    system_id?: number;
                    transaction_id?: number;
                };
                first_party_id?: number;
                first_party_type?: esi.EntityType;
                reason?: string;
                /**
                 * Unique journal reference ID.
                 */
                ref_id: number;
                ref_type: esi.corporation.wallet.TransactionType;
                second_party_id?: number;
                second_party_type?: esi.EntityType;
                /**
                 * Tax amount received for tax related transactions.
                 */
                tax?: number;
                /**
                 * The corporation ID receiving any tax paid.
                 */
                tax_reciever_id?: number;
            }
            /**
             * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/wallets/{division}/transactions/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets_division_transactions).
             */
            export interface Transaction {
                client_id: number;
                /**
                 * Date and time of transaction.
                 */
                date: string;
                is_buy: boolean;
                journal_ref_id: number;
                location_id: number;
                quantity: number;
                /**
                 * Unique transaction ID.
                 */
                transaction_id: number;
                type_id: number;
                /**
                 * Amount paid per unit.
                 */
                unit_price: number;
            }
            /**
             * Transaction type, different type of transaction will populate different fields in `extra_info`.
             */
            export const enum TransactionType {
                ACCELERATION_GATE_FEE = "acceleration_gate_fee",
                ADVERTISEMENT_LISTING_FEE = "advertisement_listing_fee",
                AGENT_DONATION = "agent_donation",
                AGENT_LOCATION_SERVICES = "agent_location_services",
                AGENT_MISCELLANEOUS = "agent_miscellaneous",
                AGENT_MISSION_COLLATERAL_PAID = "agent_mission_collateral_paid",
                AGENT_MISSION_COLLATERAL_REFUNDED = "agent_mission_collateral_refunded",
                AGENT_MISSION_REWARD = "agent_mission_reward",
                AGENT_MISSION_REWARD_CORPORATION_TAX = "agent_mission_reward_corporation_tax",
                AGENT_MISSION_TIME_BONUS_REWARD = "agent_mission_time_bonus_reward",
                AGENT_MISSION_TIME_BONUS_REWARD_CORPORATION_TAX = "agent_mission_time_bonus_reward_corporation_tax",
                AGENT_SECURITY_SERVICES = "agent_security_services",
                AGENT_SERVICES_RENDERED = "agent_services_rendered",
                AGENTS_PREWARD = "agents_preward",
                ALLIANCE_MAINTAINANCE_FEE = "alliance_maintainance_fee",
                ALLIANCE_REGISTRATION_FEE = "alliance_registration_fee",
                ASSET_SAFETY_RECOVERY_TAX = "asset_safety_recovery_tax",
                BOUNTY = "bounty",
                BOUNTY_PRIZE = "bounty_prize",
                BOUNTY_PRIZE_CORPORATION_TAX = "bounty_prize_corporation_tax",
                BOUNTY_PRIZES = "bounty_prizes",
                BOUNTY_REIMBURSEMENT = "bounty_reimbursement",
                BOUNTY_SURCHARGE = "bounty_surcharge",
                BROKERS_FEE = "brokers_fee",
                CLONE_ACTIVATION = "clone_activation",
                CLONE_TRANSFER = "clone_transfer",
                CONTRABAND_FINE = "contraband_fine",
                CONTRACT_AUCTION_BID = "contract_auction_bid",
                CONTRACT_AUCTION_BID_CORP = "contract_auction_bid_corp",
                CONTRACT_AUCTION_BID_REFUND = "contract_auction_bid_refund",
                CONTRACT_AUCTION_SOLD = "contract_auction_sold",
                CONTRACT_BROKERS_FEE = "contract_brokers_fee",
                CONTRACT_BROKERS_FEE_CORP = "contract_brokers_fee_corp",
                CONTRACT_COLLATERAL = "contract_collateral",
                CONTRACT_COLLATERAL_DEPOSITED_CORP = "contract_collateral_deposited_corp",
                CONTRACT_COLLATERAL_PAYOUT = "contract_collateral_payout",
                CONTRACT_COLLATERAL_REFUND = "contract_collateral_refund",
                CONTRACT_DEPOSIT = "contract_deposit",
                CONTRACT_DEPOSIT_CORP = "contract_deposit_corp",
                CONTRACT_DEPOSIT_REFUND = "contract_deposit_refund",
                CONTRACT_DEPOSIT_SALES_TAX = "contract_deposit_sales_tax",
                CONTRACT_PRICE = "contract_price",
                CONTRACT_PRICE_PAYMENT_CORP = "contract_price_payment_corp",
                CONTRACT_REVERSAL = "contract_reversal",
                CONTRACT_REWARD = "contract_reward",
                CONTRACT_REWARD_DEPOSITED = "contract_reward_deposited",
                CONTRACT_REWARD_DEPOSITED_CORP = "contract_reward_deposited_corp",
                CONTRACT_REWARD_REFUND = "contract_reward_refund",
                CONTRACT_SALES_TAX = "contract_sales_tax",
                COPYING = "copying",
                CORPORATE_REWARD_PAYOUT = "corporate_reward_payout",
                CORPORATE_REWARD_TAX = "corporate_reward_tax",
                CORPORATION_ACCOUNT_WITHDRAWAL = "corporation_account_withdrawal",
                CORPORATION_BULK_PAYMENT = "corporation_bulk_payment",
                CORPORATION_DIVIDEND_PAYMENT = "corporation_dividend_payment",
                CORPORATION_LIQUIDATION = "corporation_liquidation",
                CORPORATION_LOGO_CHANGE_COST = "corporation_logo_change_cost",
                CORPORATION_PAYMENT = "corporation_payment",
                CORPORATION_REGISTRATION_FEE = "corporation_registration_fee",
                COURIER_MISSION_ESCROW = "courier_mission_escrow",
                CSPA = "cspa",
                CSPAOFFLINEREFUND = "cspaofflinerefund",
                DATACORE_FEE = "datacore_fee",
                DNA_MODIFICATION_FEE = "dna_modification_fee",
                DOCKING_FEE = "docking_fee",
                FACTORY_SLOT_RENTAL_FEE = "factory_slot_rental_fee",
                GM_CASH_TRANSFER = "gm_cash_transfer",
                INDUSTRY_JOB_TAX = "industry_job_tax",
                INFRASTRUCTURE_HUB_MAINTENANCE = "infrastructure_hub_maintenance",
                INHERITANCE = "inheritance",
                INSURANCE = "insurance",
                JUMP_CLONE_ACTIVATION_FEE = "jump_clone_activation_fee",
                JUMP_CLONE_INSTALLATION_FEE = "jump_clone_installation_fee",
                KILL_RIGHT_FEE = "kill_right_fee",
                LP_STORE = "lp_store",
                MANUFACTURING = "manufacturing",
                MARKET_ESCROW = "market_escrow",
                MARKET_FINE_PAID = "market_fine_paid",
                MARKET_TRANSACTION = "market_transaction",
                MEDAL_CREATION = "medal_creation",
                MEDAL_ISSUED = "medal_issued",
                MISSION_COMPLETION = "mission_completion",
                MISSION_COST = "mission_cost",
                MISSION_EXPIRATION = "mission_expiration",
                MISSION_REWARD = "mission_reward",
                OFFICE_RENTAL_FEE = "office_rental_fee",
                OPERATION_BONUS = "operation_bonus",
                OPPORTUNITY_REWARD = "opportunity_reward",
                PLANETARY_CONSTRUCTION = "planetary_construction",
                PLANETARY_EXPORT_TAX = "planetary_export_tax",
                PLANETARY_IMPORT_TAX = "planetary_import_tax",
                PLAYER_DONATION = "player_donation",
                PLAYER_TRADING = "player_trading",
                PROJECT_DISCOVERY_REWARD = "project_discovery_reward",
                PROJECT_DISCOVERY_TAX = "project_discovery_tax",
                RELEASE_OF_IMPOUNDED_PROPERTY = "release_of_impounded_property",
                REPAIR_BILL = "repair_bill",
                REPROCESSING_TAX = "reprocessing_tax",
                RESEARCHING_MATERIAL_PRODUCTIVITY = "researching_material_productivity",
                RESEARCHING_TECHNOLOGY = "researching_technology",
                RESEARCHING_TIME_PRODUCTIVITY = "researching_time_productivity",
                REVERSE_ENGINEERING = "reverse_engineering",
                SECURITY_PROCESSING_FEE = "security_processing_fee",
                SHARES = "shares",
                SOVEREIGNITY_BILL = "sovereignity_bill",
                STORE_PURCHASE = "store_purchase",
                STORE_PURCHASE_REFUND = "store_purchase_refund",
                TRANSACTION_TAX = "transaction_tax",
                UPKEEP_ADJUSTMENT_FEE = "upkeep_adjustment_fee",
                WAR_ALLY_CONTRACT = "war_ally_contract",
                WAR_FEE = "war_fee",
                WAR_FEE_SURRENDER = "war_fee_surrender"
            }
            /**
             * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/wallets/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets).
             */
            export interface Wallet {
                balance: number;
                division: number;
            }
        }
        /**
         * This is the response type for the route, [`GET /v2/corporations/{corporation_id}/alliancehistory/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_alliancehistory).
         */
        export interface AllianceHistory {
            alliance_id?: number;
            /**
             * True if the alliance has been closed.
             */
            is_deleted?: boolean;
            /**
             * An incrementing ID that can be used to canonically establish order of records in cases where dates may be ambiguous.
             */
            record_id: number;
            start_date: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/get_corporations_corporation_id_contacts).
         */
        export interface Contact {
            contact_id: number;
            contact_type: esi.EntityType;
            /**
             * Whether this contact is being watched.
             */
            is_watched?: boolean;
            /**
             * Custom label of the contact.
             */
            label_id?: number;
            /**
             * Standing of the contact.
             */
            standing: number;
        }
        /**
         * This is the response type for the route, [`GET /v3/corporations/{corporation_id}/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id).
         */
        export interface Corporation {
            /**
             * Id of alliance that corporation is a member of, if any.
             */
            alliance_id?: number;
            ceo_id: number;
            corporation_description: string;
            /**
             * The full name of the corporation.
             */
            corporation_name: string;
            creation_date?: string;
            creator_id: number;
            faction?: esi.corporation.Faction;
            member_count: number;
            tax_rate: number;
            /**
             * The short name of the corporation.
             */
            ticker: string;
            url: string;
        }
        export interface DivisionName {
            division?: number;
            name?: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/divisions/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_divisions).
         */
        export interface Divisions {
            hangar?: esi.corporation.DivisionName[];
            wallet?: esi.corporation.DivisionName[];
        }
        export const enum Faction {
            AMARR = "Amarr",
            CALDARI = "Caldari",
            GALLENTE = "Gallente",
            MINMATAR = "Minmatar"
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/icons/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_icons).
         */
        export interface Icons {
            px128x128?: string;
            px256x256?: string;
            px64x64?: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/loyalty/stores/{corporation_id}/offers/`](https://esi.tech.ccp.is//#!/Loyalty/get_loyalty_stores_corporation_id_offers).
         */
        export interface LoyaltyStoreOffer {
            isk_cost: number;
            lp_cost: number;
            offer_id: number;
            quantity: number;
            required_items: esi.corporation.LoyaltyStoreRequirement[];
            type_id: number;
        }
        export interface LoyaltyStoreRequirement {
            quantity: number;
            type_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/corporations/{corporation_id}/members/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_members).
         */
        export interface Member {
            character_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/membertracking/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_membertracking).
         */
        export interface MemberDetails {
            base_id?: number;
            character_id: number;
            location_id?: number;
            logoff_date?: string;
            logon_date?: string;
            ship_type_id?: number;
            start_date?: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/roles/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_roles).
         */
        export interface MemberRoles {
            character_id: number;
            grantable_roles?: esi.Role[];
            grantable_roles_at_base?: esi.Role[];
            grantable_roles_at_hq?: esi.Role[];
            grantable_roles_at_other?: esi.Role[];
            roles?: esi.Role[];
            roles_at_base?: esi.Role[];
            roles_at_hq?: esi.Role[];
            roles_at_other?: esi.Role[];
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/names/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_names).
         */
        export interface Name {
            corporation_id: number;
            corporation_name: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/titles/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_titles).
         */
        export interface Title {
            grantable_roles?: esi.Role[];
            grantable_roles_at_base?: esi.Role[];
            grantable_roles_at_hq?: esi.Role[];
            grantable_roles_at_other?: esi.Role[];
            name?: string;
            roles?: esi.Role[];
            roles_at_base?: esi.Role[];
            roles_at_hq?: esi.Role[];
            roles_at_other?: esi.Role[];
            title_id?: number;
        }
    }
    export namespace dogma {
        /**
         * This is the response type for the route, [`GET /v1/dogma/attributes/{attribute_id}/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_attributes_attribute_id).
         */
        export interface Attribute {
            attribute_id: number;
            default_value?: number;
            description?: string;
            display_name?: string;
            high_is_good?: boolean;
            icon_id?: number;
            name?: string;
            published?: boolean;
            stackable?: boolean;
            unit_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/dogma/effects/{effect_id}/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_effects_effect_id).
         */
        export interface Effect {
            description?: string;
            disallow_auto_repeat?: boolean;
            discharge_attribute_id?: number;
            display_name?: string;
            duration_attribute_id?: number;
            effect_category?: number;
            effect_id: number;
            electronic_chance?: boolean;
            falloff_attribute_id?: number;
            icon_id?: number;
            is_assistance?: boolean;
            is_offensive?: boolean;
            is_warp_safe?: boolean;
            modifiers?: esi.dogma.Modifier[];
            name?: string;
            post_expression?: number;
            pre_expression?: number;
            published?: boolean;
            range_attribute_id?: number;
            range_chance?: boolean;
            tracking_speed_attribute_id?: number;
        }
        export interface Modifier {
            domain?: string;
            effect_id?: number;
            func: string;
            modified_attribute_id?: number;
            modifying_attribute_id?: number;
            operator?: number;
        }
    }
    export namespace factionwarfare {
        /**
         * This is the response type for the route, [`GET /v1/fw/leaderboards/characters/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards_characters).
         */
        export interface CharacterLeaderboard {
            /**
             * Top 100 rankings of pilots by number of kills from yesterday, last week and in total.
             */
            kills: {
                /**
                 * Top 100 ranking of pilots active in faction warfare by total kills. A pilot is considered "active" if they have participated in faction warfare in the past 14 days. Top 100 ranking of pilots active in faction warfare by total victory points. A pilot is considered "active" if they have participated in faction warfare in the past 14 days.
                 */
                active_total: esi.factionwarfare.CharacterScore[];
                /**
                 * Top 100 ranking of pilots by kills in the past week. Top 100 ranking of pilots by victory points in the past week.
                 */
                last_week: esi.factionwarfare.CharacterScore[];
                /**
                 * Top 100 ranking of pilots by kills in the past day. Top 100 ranking of pilots by victory points in the past day.
                 */
                yesterday: esi.factionwarfare.CharacterScore[];
            };
            /**
             * Top 100 rankings of pilots by victory points from yesterday, last week and in total.
             */
            victory_points: {
                /**
                 * Top 100 ranking of pilots active in faction warfare by total kills. A pilot is considered "active" if they have participated in faction warfare in the past 14 days. Top 100 ranking of pilots active in faction warfare by total victory points. A pilot is considered "active" if they have participated in faction warfare in the past 14 days.
                 */
                active_total: esi.factionwarfare.CharacterScore[];
                /**
                 * Top 100 ranking of pilots by kills in the past week. Top 100 ranking of pilots by victory points in the past week.
                 */
                last_week: esi.factionwarfare.CharacterScore[];
                /**
                 * Top 100 ranking of pilots by kills in the past day. Top 100 ranking of pilots by victory points in the past day.
                 */
                yesterday: esi.factionwarfare.CharacterScore[];
            };
        }
        export interface CharacterScore {
            /**
             * Amount of kills. Amount of victory points.
             */
            amount?: number;
            character_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/fw/leaderboards/corporations/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards_corporations).
         */
        export interface CorporationLeaderboard {
            /**
             * Top 10 rankings of corporations by number of kills from yesterday, last week and in total.
             */
            kills: {
                /**
                 * Top 10 ranking of corporations active in faction warfare by total kills. A corporation is considered "active" if they have participated in faction warfare in the past 14 days. Top 10 ranking of corporations active in faction warfare by total victory points. A corporation is considered "active" if they have participated in faction warfare in the past 14 days.
                 */
                active_total: esi.factionwarfare.CorporationScore[];
                /**
                 * Top 10 ranking of corporations by kills in the past week. Top 10 ranking of corporations by victory points in the past week.
                 */
                last_week: esi.factionwarfare.CorporationScore[];
                /**
                 * Top 10 ranking of corporations by kills in the past day. Top 10 ranking of corporations by victory points in the past day.
                 */
                yesterday: esi.factionwarfare.CorporationScore[];
            };
            /**
             * Top 10 rankings of corporations by victory points from yesterday, last week and in total.
             */
            victory_points: {
                /**
                 * Top 10 ranking of corporations active in faction warfare by total kills. A corporation is considered "active" if they have participated in faction warfare in the past 14 days. Top 10 ranking of corporations active in faction warfare by total victory points. A corporation is considered "active" if they have participated in faction warfare in the past 14 days.
                 */
                active_total: esi.factionwarfare.CorporationScore[];
                /**
                 * Top 10 ranking of corporations by kills in the past week. Top 10 ranking of corporations by victory points in the past week.
                 */
                last_week: esi.factionwarfare.CorporationScore[];
                /**
                 * Top 10 ranking of corporations by kills in the past day. Top 10 ranking of corporations by victory points in the past day.
                 */
                yesterday: esi.factionwarfare.CorporationScore[];
            };
        }
        export interface CorporationScore {
            /**
             * Amount of kills. Amount of victory points.
             */
            amount?: number;
            corporation_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/fw/leaderboards/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards).
         */
        export interface FactionLeaderboard {
            /**
             * Top 4 rankings of factions by number of kills from yesterday, last week and in total.
             */
            kills: {
                /**
                 * Top 4 ranking of factions active in faction warfare by total kills. A faction is considered "active" if they have participated in faction warfare in the past 14 days. Top 4 ranking of factions active in faction warfare by total victory points. A faction is considered "active" if they have participated in faction warfare in the past 14 days.
                 */
                active_total: esi.factionwarfare.FactionScore[];
                /**
                 * Top 4 ranking of factions by kills in the past week. Top 4 ranking of factions by victory points in the past week.
                 */
                last_week: esi.factionwarfare.FactionScore[];
                /**
                 * Top 4 ranking of factions by kills in the past day. Top 4 ranking of factions by victory points in the past day.
                 */
                yesterday: esi.factionwarfare.FactionScore[];
            };
            /**
             * Top 4 rankings of factions by victory points from yesterday, last week and in total.
             */
            victory_points: {
                /**
                 * Top 4 ranking of factions active in faction warfare by total kills. A faction is considered "active" if they have participated in faction warfare in the past 14 days. Top 4 ranking of factions active in faction warfare by total victory points. A faction is considered "active" if they have participated in faction warfare in the past 14 days.
                 */
                active_total: esi.factionwarfare.FactionScore[];
                /**
                 * Top 4 ranking of factions by kills in the past week. Top 4 ranking of factions by victory points in the past week.
                 */
                last_week: esi.factionwarfare.FactionScore[];
                /**
                 * Top 4 ranking of factions by kills in the past day. Top 4 ranking of factions by victory points in the past day.
                 */
                yesterday: esi.factionwarfare.FactionScore[];
            };
        }
        export interface FactionScore {
            /**
             * Amount of kills. Amount of victory points.
             */
            amount?: number;
            faction_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/fw/stats/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_stats).
         */
        export interface FactionStatistics {
            faction_id: number;
            /**
             * Summary of kills against an enemy faction for the given faction.
             */
            kills: {
                /**
                 * Last week's total number of kills against enemy factions.
                 */
                last_week: number;
                /**
                 * Total number of kills against enemy factions since faction warfare began.
                 */
                total: number;
                /**
                 * Yesterday's total number of kills against enemy factions.
                 */
                yesterday: number;
            };
            /**
             * How many pilots fight for the given faction.
             */
            pilots: number;
            /**
             * The number of solar systems controlled by the given faction.
             */
            systems_controlled: number;
            /**
             * Summary of victory points gained for the given faction.
             */
            victory_points: {
                /**
                 * Last week's victory points gained.
                 */
                last_week: number;
                /**
                 * Total victory points gained since faction warfare began.
                 */
                total: number;
                /**
                 * Yesterday's victory points gained.
                 */
                yesterday: number;
            };
        }
        /**
         * This is the response type for the route, [`GET /v1/fw/systems/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_systems).
         */
        export interface System {
            contested: boolean;
            occupier_faction_id: number;
            owner_faction_id: number;
            solar_system_id: number;
            victory_points: number;
            victory_points_threshold: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/fw/wars/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_wars).
         */
        export interface War {
            /**
             * The faction ID of the enemy faction.
             */
            against_id: number;
            faction_id: number;
        }
    }
    export namespace fleet {
        /**
         * This is the response type for the route, [`GET /v1/fleets/{fleet_id}/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id).
         */
        export interface Fleet {
            /**
             * Is free-move enabled.
             */
            is_free_move: boolean;
            /**
             * Does the fleet have an active fleet advertisement.
             */
            is_registered: boolean;
            /**
             * Is EVE Voice enabled.
             */
            is_voice_enabled: boolean;
            /**
             * Fleet MOTD in CCP flavoured HTML.
             */
            motd: string;
        }
        /**
         * This type is a parameter for the route, [`POST /v1/fleets/{fleet_id}/members/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_members).
         */
        export interface Invitation {
            /**
             * The character you want to invite.
             */
            character_id: number;
            /**
             * If a character is invited with the `fleet_commander` role, neither `wing_id` or `squad_id` should be specified. If a character is invited with the `wing_commander` role, only `wing_id` should be specified. If a character is invited with the `squad_commander` role, both `wing_id` and `squad_id` should be specified. If a character is invited with the `squad_member` role, `wing_id` and `squad_id` should either both be specified or not specified at all. If they aren’t specified, the invited character will join any squad with available positions.
             */
            role: esi.fleet.Role;
            squad_id?: number;
            wing_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/fleets/{fleet_id}/members/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id_members).
         */
        export interface Member {
            character_id: number;
            join_time: string;
            /**
             * Member’s role in fleet.
             */
            role: esi.fleet.Role;
            /**
             * Localized role names.
             */
            role_name: string;
            ship_type_id: number;
            /**
             * Solar system the member is located in.
             */
            solar_system_id: number;
            /**
             * ID of the squad the member is in. If not applicable, will be set to -1.
             */
            squad_id: number;
            /**
             * Station in which the member is docked in, if applicable.
             */
            station_id?: number;
            /**
             * Whether the member take fleet warps.
             */
            takes_fleet_warp: boolean;
            /**
             * ID of the wing the member is in. If not applicable, will be set to -1.
             */
            wing_id: number;
        }
        /**
         * This type is a parameter for the route, [`PUT /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id_members_member_id).
         */
        export interface Movement {
            /**
             * If a character is moved to the `fleet_commander` role, neither `wing_id` or `squad_id` should be specified. If a character is moved to the `wing_commander` role, only `wing_id` should be specified. If a character is moved to the `squad_commander` role, both `wing_id` and `squad_id` should be specified. If a character is moved to the `squad_member` role, both `wing_id` and `squad_id` should be specified.
             */
            role: esi.fleet.Role;
            squad_id?: number;
            wing_id?: number;
        }
        export interface Naming {
            name: string;
        }
        /**
         * This type is a parameter for the route, [`PUT /v1/fleets/{fleet_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id).
         */
        export interface NewSettings {
            /**
             * Should free-move be enabled in the fleet.
             */
            is_free_move?: boolean;
            /**
             * New fleet MOTD in CCP flavoured HTML.
             */
            motd?: string;
        }
        export const enum Role {
            FLEET_COMMANDER = "fleet_commander",
            SQUAD_COMMANDER = "squad_commander",
            SQUAD_MEMBER = "squad_member",
            WING_COMMANDER = "wing_commander"
        }
        export interface Squad {
            id: number;
            name: string;
        }
        /**
         * This is the response type for the route, [`POST /v1/fleets/{fleet_id}/wings/{wing_id}/squads/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads).
         */
        export interface SquadID {
            /**
             * The squad_id of the newly created squad.
             */
            squad_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/fleets/{fleet_id}/wings/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id_wings).
         */
        export interface Wing {
            id: number;
            name: string;
            squads: esi.fleet.Squad[];
        }
        /**
         * This is the response type for the route, [`POST /v1/fleets/{fleet_id}/wings/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_wings).
         */
        export interface WingID {
            /**
             * The wing_id of the newly created wing.
             */
            wing_id: number;
        }
    }
    export namespace industry {
        export const enum Activity {
            COPYING = "copying",
            DUPLICATING = "duplicating",
            INVENTION = "invention",
            MANUFACTURING = "manufacturing",
            NONE = "none",
            RESEARCHING_MATERIAL_EFFICIENCY = "researching_material_efficiency",
            RESEARCHING_TECHNOLOGY = "researching_technology",
            RESEARCHING_TIME_EFFICIENCY = "researching_time_efficiency",
            REVERSE_ENGINEERING = "reverse_engineering"
        }
        export interface CostIndex {
            activity: esi.industry.Activity;
            cost_index: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/industry/facilities/`](https://esi.tech.ccp.is//#!/Industry/get_industry_facilities).
         */
        export interface Facility {
            /**
             * ID of the facility.
             */
            facility_id: number;
            /**
             * Owner of the facility.
             */
            owner_id: number;
            /**
             * Region ID where the facility is.
             */
            region_id: number;
            /**
             * Solar system ID where the facility is.
             */
            solar_system_id: number;
            /**
             * Tax imposed by the facility.
             */
            tax?: number;
            /**
             * Type ID of the facility.
             */
            type_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/industry/systems/`](https://esi.tech.ccp.is//#!/Industry/get_industry_systems).
         */
        export interface System {
            cost_indices: esi.industry.CostIndex[];
            solar_system_id: number;
        }
    }
    export namespace killmail {
        export interface Attacker {
            alliance_id?: number;
            character_id?: number;
            corporation_id?: number;
            damage_done: number;
            faction_id?: number;
            /**
             * Was the attacker the one to achieve the final blow.
             */
            final_blow: boolean;
            /**
             * Security status for the attacker.
             */
            security_status: number;
            /**
             * What ship was the attacker flying.
             */
            ship_type_id?: number;
            /**
             * What weapon was used by the attacker for the kill.
             */
            weapon_type_id?: number;
        }
        export interface Charge {
            flag: number;
            item_type_id: number;
            quantity_destroyed?: number;
            quantity_dropped?: number;
            singleton: number;
        }
        export interface Item {
            /**
             * Flag for the location of the item.
             */
            flag: number;
            item_type_id: number;
            items?: esi.killmail.Charge[];
            /**
             * How many of the item were destroyed if any.
             */
            quantity_destroyed?: number;
            /**
             * How many of the item were dropped if any.
             */
            quantity_dropped?: number;
            singleton: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/killmails/{killmail_id}/{killmail_hash}/`](https://esi.tech.ccp.is//#!/Killmails/get_killmails_killmail_id_killmail_hash).
         */
        export interface Killmail {
            attackers: esi.killmail.Attacker[];
            /**
             * ID of the killmail.
             */
            killmail_id: number;
            /**
             * Time that the victim was killed and the killmail generated.
             */
            killmail_time: string;
            /**
             * Moon if the kill took place at one.
             */
            moon_id?: number;
            /**
             * Solar system that the kill took place in.
             */
            solar_system_id: number;
            victim: {
                alliance_id?: number;
                character_id?: number;
                corporation_id?: number;
                /**
                 * How much total damage was taken by the victim.
                 */
                damage_taken: number;
                faction_id?: number;
                items?: esi.killmail.Item[];
                /**
                 * Coordinates of the victim in Cartesian space relative to the Sun.
                 */
                position?: {
                    x: number;
                    y: number;
                    z: number;
                };
                /**
                 * The ship that the victim was piloting and was destroyed.
                 */
                ship_type_id: number;
            };
            /**
             * War if the killmail is generated in relation to an official war.
             */
            war_id?: number;
        }
        export interface KillmailLink {
            /**
             * A hash of this killmail.
             */
            killmail_hash: string;
            /**
             * ID of this killmail.
             */
            killmail_id: number;
        }
    }
    export namespace market {
        /**
         * This is the response type for the route, [`GET /v1/markets/{region_id}/history/`](https://esi.tech.ccp.is//#!/Market/get_markets_region_id_history).
         */
        export interface History {
            average: number;
            /**
             * The date of this historical statistic entry.
             */
            date: string;
            highest: number;
            lowest: number;
            /**
             * Total number of orders happened that day.
             */
            order_count: number;
            volume: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/markets/groups/{market_group_id}/`](https://esi.tech.ccp.is//#!/Market/get_markets_groups_market_group_id).
         */
        export interface MarketGroup {
            description: string;
            market_group_id: number;
            name: string;
            parent_group_id?: number;
            types: number[];
        }
        export interface Order {
            duration: number;
            is_buy_order: boolean;
            issued: string;
            location_id: number;
            min_volume: number;
            order_id: number;
            price: number;
            range: esi.OrderRange;
            type_id: number;
            volume_remain: number;
            volume_total: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/markets/prices/`](https://esi.tech.ccp.is//#!/Market/get_markets_prices).
         */
        export interface Price {
            adjusted_price?: number;
            average_price?: number;
            type_id: number;
        }
    }
    export namespace sovereignty {
        /**
         * This is the response type for the route, [`GET /v1/sovereignty/campaigns/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_campaigns).
         */
        export interface Campaign {
            /**
             * Score for all attacking parties, only present in Defense Events.
             */
            attackers_score?: number;
            /**
             * Unique ID for this campaign.
             */
            campaign_id: number;
            /**
             * The constellation in which the campaign will take place.
             */
            constellation_id: number;
            /**
             * Defending alliance, only present in Defense Events.
             */
            defender_id?: number;
            /**
             * Score for the defending alliance, only present in Defense Events.
             */
            defender_score?: number;
            event_type: esi.sovereignty.EventType;
            /**
             * Alliance participating and their respective scores, only present in Freeport Events.
             */
            participants?: esi.sovereignty.Participant[];
            /**
             * The solar system the structure is located in.
             */
            solar_system_id: number;
            /**
             * Time the event is scheduled to start.
             */
            start_time: string;
            /**
             * The structure item ID that is related to this campaign.
             */
            structure_id: number;
        }
        /**
         * Type of event this campaign is for. tcu_defense, ihub_defense and station_defense are referred to as "Defense Events", station_freeport as "Freeport Events".
         */
        export const enum EventType {
            IHUB_DEFENSE = "ihub_defense",
            STATION_DEFENSE = "station_defense",
            STATION_FREEPORT = "station_freeport",
            TCU_DEFENSE = "tcu_defense"
        }
        /**
         * This is the response type for the route, [`GET /v1/sovereignty/map/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_map).
         */
        export interface Map {
            alliance_id?: number;
            corporation_id?: number;
            faction_id?: number;
            system_id: number;
        }
        export interface Participant {
            alliance_id: number;
            score: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/sovereignty/structures/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_structures).
         */
        export interface Structure {
            /**
             * The alliance that owns the structure.
             */
            alliance_id: number;
            /**
             * Solar system in which the structure is located.
             */
            solar_system_id: number;
            /**
             * Unique item ID for this structure.
             */
            structure_id: number;
            /**
             * A reference to the type of structure this is.
             */
            structure_type_id: number;
            /**
             * The occupancy level for the next or current vulnerability window. This takes into account all development indexes and capital system bonuses. Also known as Activity Defense Multiplier from in the client. It increases the time that attackers must spend using their entosis links on the structure.
             */
            vulnerability_occupancy_level?: number;
            /**
             * The time at which the next or current vulnerability window ends. At the end of a vulnerability window the next window is recalculated and locked in along with the vulnerabilityOccupancyLevel. If the structure is not in 100% entosis control of the defender, it will go in to 'overtime' and stay vulnerable for as long as that situation persists. Only once the defenders have 100% entosis control and has the vulnerableEndTime passed does the vulnerability interval expire and a new one is calculated.
             */
            vulnerable_end_time?: string;
            /**
             * The next time at which the structure will become vulnerable. Or the start time of the current window if current time is between this and vulnerableEndTime.
             */
            vulnerable_start_time?: string;
        }
    }
    export namespace universe {
        /**
         * This is the response type for the route, [`GET /v1/universe/bloodlines/`](https://esi.tech.ccp.is//#!/Universe/get_universe_bloodlines).
         */
        export interface Bloodline {
            bloodline_id: number;
            charisma: number;
            corporation_id: number;
            description: string;
            intelligence: number;
            memory: number;
            name: string;
            perception: number;
            race_id: number;
            ship_type_id: number;
            willpower: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/categories/{category_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_categories_category_id).
         */
        export interface Category {
            category_id: number;
            groups: number[];
            name: string;
            published: boolean;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/constellations/{constellation_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_constellations_constellation_id).
         */
        export interface Constellation {
            constellation_id: number;
            name: string;
            position: {
                x: number;
                y: number;
                z: number;
            };
            /**
             * The region this constellation is in.
             */
            region_id: number;
            systems: number[];
        }
        export interface DogmaAttribute {
            attribute_id: number;
            value: number;
        }
        export interface DogmaEffect {
            effect_id: number;
            is_default: boolean;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/factions/`](https://esi.tech.ccp.is//#!/Universe/get_universe_factions).
         */
        export interface Faction {
            corporation_id: number;
            description: string;
            faction_id: number;
            is_unique: boolean;
            militia_corporation_id?: number;
            name: string;
            size_factor: number;
            solar_system_id: number;
            station_count: number;
            station_system_count: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/graphics/{graphic_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_graphics_graphic_id).
         */
        export interface Graphic {
            collision_file?: string;
            graphic_file?: string;
            graphic_id: number;
            icon_folder?: string;
            sof_dna?: string;
            sof_fation_name?: string;
            sof_hull_name?: string;
            sof_race_name?: string;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/groups/{group_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_groups_group_id).
         */
        export interface Group {
            category_id: number;
            group_id: number;
            name: string;
            published: boolean;
            types: number[];
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/moons/{moon_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_moons_moon_id).
         */
        export interface Moon {
            moon_id: number;
            name: string;
            position: {
                x: number;
                y: number;
                z: number;
            };
            /**
             * The solar system this moon is in.
             */
            system_id: number;
        }
        /**
         * This is the response type for the route, [`POST /v2/universe/names/`](https://esi.tech.ccp.is//#!/Universe/post_universe_names).
         */
        export interface Name {
            category: esi.universe.NameCategory;
            id: number;
            name: string;
        }
        export const enum NameCategory {
            ALLIANCE = "alliance",
            CHARACTER = "character",
            CONSTELLATION = "constellation",
            CORPORATION = "corporation",
            INVENTORY_TYPE = "inventory_type",
            REGION = "region",
            SOLAR_SYSTEM = "solar_system",
            STATION = "station"
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/planets/{planet_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_planets_planet_id).
         */
        export interface Planet {
            name: string;
            planet_id: number;
            position: {
                x: number;
                y: number;
                z: number;
            };
            /**
             * The solar system this planet is in.
             */
            system_id: number;
            type_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/races/`](https://esi.tech.ccp.is//#!/Universe/get_universe_races).
         */
        export interface Race {
            /**
             * The alliance generally associated with this race.
             */
            alliance_id: number;
            description: string;
            name: string;
            race_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/regions/{region_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_regions_region_id).
         */
        export interface Region {
            constellations: number[];
            description?: string;
            name: string;
            region_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/schematics/{schematic_id}/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_universe_schematics_schematic_id).
         */
        export interface Schematic {
            /**
             * Time in seconds to process a run.
             */
            cycle_time: number;
            schematic_name: string;
        }
        export const enum Service {
            ASSASINATION_MISSIONS = "assasination-missions",
            BLACK_MARKET = "black-market",
            BOUNTY_MISSIONS = "bounty-missions",
            CLONING = "cloning",
            COURIER_MISSIONS = "courier-missions",
            DNA_THERAPY = "dna-therapy",
            DOCKING = "docking",
            FACTORY = "factory",
            FITTING = "fitting",
            GAMBLING = "gambling",
            INSURANCE = "insurance",
            INTERBUS = "interbus",
            JUMP_CLONE_FACILITY = "jump-clone-facility",
            LABRATORY = "labratory",
            LOYALTY_POINT_STORE = "loyalty-point-store",
            MARKET = "market",
            NAVY_OFFICES = "navy-offices",
            NEWS = "news",
            OFFICE_RENTAL = "office-rental",
            PAINTSHOP = "paintshop",
            REFINERY = "refinery",
            REPAIR_FACILITIES = "repair-facilities",
            REPROCESSING_PLANT = "reprocessing-plant",
            SECURITY_OFFICES = "security-offices",
            STOCK_EXCHANGE = "stock-exchange",
            STORAGE = "storage",
            SURGERY = "surgery"
        }
        export const enum SpectralClass {
            A0 = "A0",
            A0IV = "A0IV",
            A0IV2 = "A0IV2",
            F0IV = "F0 IV",
            F0V = "F0 V",
            F0VI = "F0 VI",
            F1IV = "F1 IV",
            F1V = "F1 V",
            F1VI = "F1 VI",
            F2IV = "F2 IV",
            F2V = "F2 V",
            F2VI = "F2 VI",
            F3IV = "F3 IV",
            F3V = "F3 V",
            F3VI = "F3 VI",
            F4IV = "F4 IV",
            F4V = "F4 V",
            F4VI = "F4 VI",
            F5IV = "F5 IV",
            F5V = "F5 V",
            F5VI = "F5 VI",
            F6IV = "F6 IV",
            F6V = "F6 V",
            F6VI = "F6 VI",
            F7V = "F7 V",
            F7VI = "F7 VI",
            F8V = "F8 V",
            F8VI = "F8 VI",
            F9IV = "F9 IV",
            F9V = "F9 V",
            F9VI = "F9 VI",
            G0IV = "G0 IV",
            G0V = "G0 V",
            G0VI = "G0 VI",
            G1IV = "G1 IV",
            G1V = "G1 V",
            G1VI = "G1 VI",
            G2IV = "G2 IV",
            G2V = "G2 V",
            G2VI = "G2 VI",
            G3IV = "G3 IV",
            G3V = "G3 V",
            G3VI = "G3 VI",
            G4IV = "G4 IV",
            G4V = "G4 V",
            G4VI = "G4 VI",
            G5IV = "G5 IV",
            G5V = "G5 V",
            G5VI = "G5 VI",
            G6V = "G6 V",
            G6VI = "G6 VI",
            G7IV = "G7 IV",
            G7V = "G7 V",
            G7VI = "G7 VI",
            G8IV = "G8 IV",
            G8V = "G8 V",
            G8VI = "G8 VI",
            G9V = "G9 V",
            G9VI = "G9 VI",
            K0IV = "K0 IV",
            K0V = "K0 V",
            K1IV = "K1 IV",
            K1V = "K1 V",
            K2IV = "K2 IV",
            K2V = "K2 V",
            K3IV = "K3 IV",
            K3V = "K3 V",
            K4IV = "K4 IV",
            K4V = "K4 V",
            K5IV = "K5 IV",
            K5V = "K5 V",
            K6IV = "K6 IV",
            K6V = "K6 V",
            K7IV = "K7 IV",
            K7V = "K7 V",
            K8IV = "K8 IV",
            K8V = "K8 V",
            K9IV = "K9 IV",
            K9V = "K9 V",
            M0V = "M0 V",
            M1V = "M1 V",
            M2V = "M2 V",
            M3V = "M3 V",
            M4V = "M4 V",
            M5V = "M5 V",
            M6V = "M6 V",
            M7V = "M7 V",
            M8V = "M8 V",
            M9V = "M9 V"
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/stars/{star_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stars_star_id).
         */
        export interface Star {
            /**
             * Age of star in years.
             */
            age: number;
            luminosity: number;
            name: string;
            radius: number;
            solar_system_id: number;
            spectral_class: esi.universe.SpectralClass;
            temperature: number;
            type_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/stargates/{stargate_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stargates_stargate_id).
         */
        export interface Stargate {
            destination: {
                /**
                 * The stargate this stargate connects to.
                 */
                stargate_id: number;
                /**
                 * The solar system this stargate connects to.
                 */
                system_id: number;
            };
            name: string;
            position: {
                x: number;
                y: number;
                z: number;
            };
            stargate_id: number;
            /**
             * The solar system this stargate is in.
             */
            system_id: number;
            type_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/universe/stations/{station_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stations_station_id).
         */
        export interface Station {
            max_dockable_ship_volume: number;
            name: string;
            office_rental_cost: number;
            /**
             * ID of the corporation that controls this station.
             */
            owner?: number;
            position: {
                x: number;
                y: number;
                z: number;
            };
            race_id?: number;
            reprocessing_efficiency: number;
            reprocessing_stations_take: number;
            services: esi.universe.Service[];
            station_id: number;
            /**
             * The solar system this station is in.
             */
            system_id: number;
            type_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/structures/{structure_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_structures_structure_id).
         */
        export interface Structure {
            /**
             * The full name of the structure.
             */
            name: string;
            /**
             * Coordinates of the structure in Cartesian space relative to the Sun, in metres.
             */
            position?: {
                x: number;
                y: number;
                z: number;
            };
            solar_system_id: number;
            type_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v3/universe/systems/{system_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_systems_system_id).
         */
        export interface System {
            /**
             * The constellation this solar system is in.
             */
            constellation_id: number;
            name: string;
            planets: esi.universe.SystemPlanet[];
            position: {
                x: number;
                y: number;
                z: number;
            };
            security_class?: string;
            security_status: number;
            star_id: number;
            stargates?: number[];
            stations?: number[];
            system_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/system_jumps/`](https://esi.tech.ccp.is//#!/Universe/get_universe_system_jumps).
         */
        export interface SystemJumps {
            ship_jumps: number;
            system_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/universe/system_kills/`](https://esi.tech.ccp.is//#!/Universe/get_universe_system_kills).
         */
        export interface SystemKills {
            /**
             * Number of NPC ships killed in this system.
             */
            npc_kills: number;
            /**
             * Number of pods killed in this system.
             */
            pod_kills: number;
            /**
             * Number of player ships killed in this system.
             */
            ship_kills: number;
            system_id: number;
        }
        export interface SystemPlanet {
            moons?: number[];
            planet_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/universe/types/{type_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_types_type_id).
         */
        export interface Type {
            capacity?: number;
            description: string;
            dogma_attributes?: esi.universe.DogmaAttribute[];
            dogma_effects?: esi.universe.DogmaEffect[];
            graphic_id?: number;
            group_id: number;
            icon_id?: number;
            mass?: number;
            name: string;
            portion_size?: number;
            published: boolean;
            radius?: number;
            type_id: number;
            volume?: number;
        }
    }
    export interface Ally {
        /**
         * Alliance ID if and only if this ally is an alliance.
         */
        alliance_id?: number;
        /**
         * Corporation ID if and only if this ally is a corporation.
         */
        corporation_id?: number;
    }
    export const enum EntityType {
        ALLIANCE = "alliance",
        CHARACTER = "character",
        CORPORATION = "corporation",
        FACTION = "faction"
    }
    /**
     * This is the response type for the route, [`GET /v1/incursions/`](https://esi.tech.ccp.is//#!/Incursions/get_incursions).
     */
    export interface Incursion {
        /**
         * The constellation id in which this incursion takes place.
         */
        constellation_id: number;
        /**
         * The attacking faction's id.
         */
        faction_id: number;
        /**
         * Whether the final encounter has boss or not.
         */
        has_boss: boolean;
        /**
         * A list of infested solar system ids that are a part of this incursion.
         */
        infested_solar_systems: number[];
        /**
         * Influence of this incursion as a float from 0 to 1.
         */
        influence: number;
        /**
         * Staging solar system for this incursion.
         */
        staging_solar_system_id: number;
        /**
         * The state of this incursion.
         */
        state: "withdrawing" | "mobilizing" | "established";
        /**
         * The type of this incursion.
         */
        type: string;
    }
    export interface InsuranceLevel {
        cost: number;
        /**
         * Localized insurance level.
         */
        name: string;
        payout: number;
    }
    /**
     * This is the response type for the route, [`GET /v1/insurance/prices/`](https://esi.tech.ccp.is//#!/Insurance/get_insurance_prices).
     */
    export interface InsurancePrice {
        /**
         * A list of a available insurance levels for this ship type.
         */
        levels: esi.InsuranceLevel[];
        type_id: number;
    }
    export const enum Language {
        DE = "de",
        EN_US = "en-us",
        FR = "fr",
        JA = "ja",
        RU = "ru",
        ZH = "zh"
    }
    /**
     * This is the response type for the route, [`GET /v1/opportunities/groups/{group_id}/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_groups_group_id).
     */
    export interface OpportunitiesGroup {
        /**
         * The groups that are connected to this group on the opportunities map.
         */
        connected_groups: number[];
        description: string;
        group_id: number;
        name: string;
        notification: string;
        /**
         * Tasks need to complete for this group.
         */
        required_tasks: number[];
    }
    /**
     * This is the response type for the route, [`GET /v1/opportunities/tasks/{task_id}/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_tasks_task_id).
     */
    export interface OpportunitiesTask {
        description: string;
        name: string;
        notification: string;
        task_id: number;
    }
    /**
     * Valid order range, numbers are ranges in jumps.
     */
    export const enum OrderRange {
        REGION = "region",
        SOLARSYSTEM = "solarsystem",
        STATION = "station",
        V_1 = "1",
        V_10 = "10",
        V_2 = "2",
        V_20 = "20",
        V_3 = "3",
        V_30 = "30",
        V_4 = "4",
        V_40 = "40",
        V_5 = "5"
    }
    /**
     * This is the response type for the route, [`GET /v1/characters/{character_id}/roles/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_roles).
     */
    export const enum Role {
        ACCOUNT_TAKE_1 = "Account_Take_1",
        ACCOUNT_TAKE_2 = "Account_Take_2",
        ACCOUNT_TAKE_3 = "Account_Take_3",
        ACCOUNT_TAKE_4 = "Account_Take_4",
        ACCOUNT_TAKE_5 = "Account_Take_5",
        ACCOUNT_TAKE_6 = "Account_Take_6",
        ACCOUNT_TAKE_7 = "Account_Take_7",
        ACCOUNTANT = "Accountant",
        AUDITOR = "Auditor",
        COMMUNICATIONS_OFFICER = "Communications_Officer",
        CONFIG_EQUIPMENT = "Config_Equipment",
        CONFIG_STARBASE_EQUIPMENT = "Config_Starbase_Equipment",
        CONTAINER_TAKE_1 = "Container_Take_1",
        CONTAINER_TAKE_2 = "Container_Take_2",
        CONTAINER_TAKE_3 = "Container_Take_3",
        CONTAINER_TAKE_4 = "Container_Take_4",
        CONTAINER_TAKE_5 = "Container_Take_5",
        CONTAINER_TAKE_6 = "Container_Take_6",
        CONTAINER_TAKE_7 = "Container_Take_7",
        CONTRACT_MANAGER = "Contract_Manager",
        DIPLOMAT = "Diplomat",
        DIRECTOR = "Director",
        FACTORY_MANAGER = "Factory_Manager",
        FITTING_MANAGER = "Fitting_Manager",
        HANGAR_QUERY_1 = "Hangar_Query_1",
        HANGAR_QUERY_2 = "Hangar_Query_2",
        HANGAR_QUERY_3 = "Hangar_Query_3",
        HANGAR_QUERY_4 = "Hangar_Query_4",
        HANGAR_QUERY_5 = "Hangar_Query_5",
        HANGAR_QUERY_6 = "Hangar_Query_6",
        HANGAR_QUERY_7 = "Hangar_Query_7",
        HANGAR_TAKE_1 = "Hangar_Take_1",
        HANGAR_TAKE_2 = "Hangar_Take_2",
        HANGAR_TAKE_3 = "Hangar_Take_3",
        HANGAR_TAKE_4 = "Hangar_Take_4",
        HANGAR_TAKE_5 = "Hangar_Take_5",
        HANGAR_TAKE_6 = "Hangar_Take_6",
        HANGAR_TAKE_7 = "Hangar_Take_7",
        JUNIOR_ACCOUNTANT = "Junior_Accountant",
        PERSONNEL_MANAGER = "Personnel_Manager",
        RENT_FACTORY_FACILITY = "Rent_Factory_Facility",
        RENT_OFFICE = "Rent_Office",
        RENT_RESEARCH_FACILITY = "Rent_Research_Facility",
        SECURITY_OFFICER = "Security_Officer",
        STARBASE_DEFENSE_OPERATOR = "Starbase_Defense_Operator",
        STARBASE_FUEL_TECHNICIAN = "Starbase_Fuel_Technician",
        STATION_MANAGER = "Station_Manager",
        TERRESTRIAL_COMBAT_OFFICER = "Terrestrial_Combat_Officer",
        TERRESTRIAL_LOGISTICS_OFFICER = "Terrestrial_Logistics_Officer",
        TRADER = "Trader"
    }
    /**
     * This is the response type for the route, [`GET /v1/search/`](https://esi.tech.ccp.is//#!/Search/get_search).
     */
    export interface Search {
        agent?: number[];
        alliance?: number[];
        character?: number[];
        constellation?: number[];
        corporation?: number[];
        faction?: number[];
        inventorytype?: number[];
        region?: number[];
        solarsystem?: number[];
        station?: number[];
        wormhole?: number[];
    }
    export const enum SearchCategory {
        AGENT = "agent",
        ALLIANCE = "alliance",
        CHARACTER = "character",
        CONSTELLATION = "constellation",
        CORPORATION = "corporation",
        FACTION = "faction",
        INVENTORYTYPE = "inventorytype",
        REGION = "region",
        SOLARSYSTEM = "solarsystem",
        STATION = "station",
        WORMHOLE = "wormhole"
    }
    /**
     * This is the response type for the route, [`GET /v1/status/`](https://esi.tech.ccp.is//#!/Status/get_status).
     */
    export interface Status {
        /**
         * Current online player count.
         */
        players: number;
        /**
         * Running version as string.
         */
        server_version: string;
        /**
         * Server start timestamp.
         */
        start_time: string;
        /**
         * If the server is in VIP mode.
         */
        vip?: boolean;
    }
    /**
     * This is the response type for the route, [`GET /v1/wars/{war_id}/`](https://esi.tech.ccp.is//#!/Wars/get_wars_war_id).
     */
    export interface War {
        /**
         * The aggressor corporation or alliance that declared this war, only contains either corporation_id or alliance_id.
         */
        aggressor: {
            /**
             * Alliance ID if and only if the aggressor is an alliance.
             */
            alliance_id?: number;
            /**
             * Corporation ID if and only if the aggressor is a corporation.
             */
            corporation_id?: number;
            /**
             * ISK value of ships the aggressor has destroyed.
             */
            isk_destroyed: number;
            /**
             * The number of ships the aggressor has killed.
             */
            ships_killed: number;
        };
        /**
         * Allied corporations or alliances, each object contains either corporation_id or alliance_id.
         */
        allies?: esi.Ally[];
        /**
         * Time that the war was declared.
         */
        declared: string;
        /**
         * The defending corporation or alliance that declared this war, only contains either corporation_id or alliance_id.
         */
        defender: {
            /**
             * Alliance ID if and only if the defender is an alliance.
             */
            alliance_id?: number;
            /**
             * Corporation ID if and only if the defender is a corporation.
             */
            corporation_id?: number;
            /**
             * ISK value of ships the defender has killed.
             */
            isk_destroyed: number;
            /**
             * The number of ships the defender has killed.
             */
            ships_killed: number;
        };
        /**
         * Time the war ended and shooting was no longer allowed.
         */
        finished?: string;
        /**
         * ID of the specified war.
         */
        id: number;
        /**
         * Was the war declared mutual by both parties.
         */
        mutual: boolean;
        /**
         * Is the war currently open for allies or not.
         */
        open_for_allies: boolean;
        /**
         * Time the war was retracted but both sides could still shoot each other.
         */
        retracted?: string;
        /**
         * Time when the war started and both sides could shoot each other.
         */
        started?: string;
    }
}
/**
 * A special-purpose interface that provides keys mapping from route ID to a structure describing the parameters for the route.  This is not intended to be instantiated, but as a tool with TypeScript's `keyof` features to support type checking on generic request functions.
 */
export interface Parameters {
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/alliances/{alliance_id}/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_alliance_id: {
        path: {
            alliance_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/{alliance_id}/corporations/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id_corporations). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_alliance_id_corporations: {
        path: {
            alliance_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/{alliance_id}/icons/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id_icons). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_alliance_id_icons: {
        path: {
            alliance_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/names/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_names: {
        query: {
            alliance_ids: number[];
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/assets/`](https://esi.tech.ccp.is//#!/Assets/get_characters_character_id_assets). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_assets: {
        query: {
            page?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/assets/`](https://esi.tech.ccp.is//#!/Assets/get_corporations_corporation_id_assets). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_assets: {
        query: {
            page?: number;
        };
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/assets/locations/`](https://esi.tech.ccp.is//#!/Assets/post_characters_character_id_assets_locations). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_assets_locations: {
        path: {
            character_id: number;
        };
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/assets/names/`](https://esi.tech.ccp.is//#!/Assets/post_characters_character_id_assets_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_assets_names: {
        path: {
            character_id: number;
        };
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/bookmarks/`](https://esi.tech.ccp.is//#!/Bookmarks/get_characters_character_id_bookmarks). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_bookmarks: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/bookmarks/folders/`](https://esi.tech.ccp.is//#!/Bookmarks/get_characters_character_id_bookmarks_folders). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_bookmarks_folders: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/calendar/`](https://esi.tech.ccp.is//#!/Calendar/get_characters_character_id_calendar). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_calendar: {
        query: {
            from_event?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.tech.ccp.is//#!/Calendar/get_characters_character_id_calendar_event_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_calendar_event_id: {
        path: {
            character_id: number;
            event_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/calendar/{event_id}/attendees/`](https://esi.tech.ccp.is//#!/Calendar/get_characters_character_id_calendar_event_id_attendees). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_calendar_event_id_attendees: {
        path: {
            character_id: number;
            event_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.tech.ccp.is//#!/Calendar/put_characters_character_id_calendar_event_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_characters_character_id_calendar_event_id: {
        path: {
            character_id: number;
            event_id: number;
        };
        body: esi.character.calendar.Response;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v4/characters/{character_id}/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/agents_research/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_agents_research). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_agents_research: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/blueprints/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_blueprints). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_blueprints: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/chat_channels/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_chat_channels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_chat_channels: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/corporationhistory/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_corporationhistory). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_corporationhistory: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/fatigue/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_fatigue). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_fatigue: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/medals/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_medals). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_medals: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/notifications/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_notifications). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_notifications: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/notifications/contacts/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_notifications_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_notifications_contacts: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/portrait/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_portrait). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_portrait: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/roles/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_roles). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_roles: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/standings/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_standings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_standings: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/names/`](https://esi.tech.ccp.is//#!/Character/get_characters_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_names: {
        query: {
            character_ids: number[];
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/affiliation/`](https://esi.tech.ccp.is//#!/Character/post_characters_affiliation). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_affiliation: {
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v3/characters/{character_id}/cspa/`](https://esi.tech.ccp.is//#!/Character/post_characters_character_id_cspa). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_cspa: {
        path: {
            character_id: number;
        };
        body: esi.character.CSPACharacters;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/clones/`](https://esi.tech.ccp.is//#!/Clones/get_characters_character_id_clones). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_clones: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/implants/`](https://esi.tech.ccp.is//#!/Clones/get_characters_character_id_implants). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_implants: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/delete_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_contacts: {
        path: {
            character_id: number;
        };
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/get_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contacts: {
        query: {
            page?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contacts/labels/`](https://esi.tech.ccp.is//#!/Contacts/get_characters_character_id_contacts_labels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contacts_labels: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/get_corporations_corporation_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_contacts: {
        query: {
            page?: number;
        };
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/post_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_contacts: {
        query: {
            label_id?: number;
            standing: number;
            watched?: boolean;
        };
        path: {
            character_id: number;
        };
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/put_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_characters_character_id_contacts: {
        query: {
            label_id?: number;
            standing: number;
            watched?: boolean;
        };
        path: {
            character_id: number;
        };
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contracts/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contracts: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/bids/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts_contract_id_bids). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contracts_contract_id_bids: {
        path: {
            character_id: number;
            contract_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/items/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts_contract_id_items). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contracts_contract_id_items: {
        path: {
            character_id: number;
            contract_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/corporations/{corporation_id}/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/corporations/{corporation_id}/alliancehistory/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_alliancehistory). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_alliancehistory: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/blueprints/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_blueprints). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_blueprints: {
        query: {
            page?: number;
        };
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/divisions/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_divisions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_divisions: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/icons/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_icons). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_icons: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/corporations/{corporation_id}/members/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_members). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_members: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/members/limit/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_members_limit). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_members_limit: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/membertracking/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_membertracking). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_membertracking: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/roles/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_roles). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_roles: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/structures/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_structures). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_structures: {
        query: {
            page?: number;
        };
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/titles/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_titles). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_titles: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/names/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_names: {
        query: {
            corporation_ids: number[];
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/npccorps/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_npccorps). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_npccorps: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/corporations/{corporation_id}/structures/{structure_id}/`](https://esi.tech.ccp.is//#!/Corporation/put_corporations_corporation_id_structures_structure_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_corporations_corporation_id_structures_structure_id: {
        path: {
            corporation_id: number;
            structure_id: number;
        };
        body: esi.corporation.structure.VulnerabilitySchedule[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/dogma/attributes/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_attributes). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_attributes: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/dogma/attributes/{attribute_id}/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_attributes_attribute_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_attributes_attribute_id: {
        path: {
            attribute_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/dogma/effects/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_effects). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_effects: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/dogma/effects/{effect_id}/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_effects_effect_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_effects_effect_id: {
        path: {
            effect_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fw/leaderboards/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fw_leaderboards: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fw/leaderboards/characters/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards_characters). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fw_leaderboards_characters: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fw/leaderboards/corporations/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards_corporations). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fw_leaderboards_corporations: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fw/stats/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_stats). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fw_stats: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fw/systems/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_systems). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fw_systems: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fw/wars/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_wars). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fw_wars: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/fittings/{fitting_id}/`](https://esi.tech.ccp.is//#!/Fittings/delete_characters_character_id_fittings_fitting_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_fittings_fitting_id: {
        path: {
            character_id: number;
            fitting_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/fittings/`](https://esi.tech.ccp.is//#!/Fittings/get_characters_character_id_fittings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_fittings: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/fittings/`](https://esi.tech.ccp.is//#!/Fittings/post_characters_character_id_fittings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_fittings: {
        path: {
            character_id: number;
        };
        body?: esi.character.fitting.NewFitting;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.tech.ccp.is//#!/Fleets/delete_fleets_fleet_id_members_member_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_fleets_fleet_id_members_member_id: {
        path: {
            fleet_id: number;
            member_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.tech.ccp.is//#!/Fleets/delete_fleets_fleet_id_squads_squad_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_fleets_fleet_id_squads_squad_id: {
        path: {
            fleet_id: number;
            squad_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.tech.ccp.is//#!/Fleets/delete_fleets_fleet_id_wings_wing_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_fleets_fleet_id_wings_wing_id: {
        path: {
            fleet_id: number;
            wing_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fleets/{fleet_id}/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fleets_fleet_id: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fleets/{fleet_id}/members/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id_members). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fleets_fleet_id_members: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fleets/{fleet_id}/wings/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id_wings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fleets_fleet_id_wings: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/fleets/{fleet_id}/members/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_members). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_fleets_fleet_id_members: {
        path: {
            fleet_id: number;
        };
        body: esi.fleet.Invitation;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/fleets/{fleet_id}/wings/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_wings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_fleets_fleet_id_wings: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/fleets/{fleet_id}/wings/{wing_id}/squads/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_fleets_fleet_id_wings_wing_id_squads: {
        path: {
            fleet_id: number;
            wing_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id: {
        path: {
            fleet_id: number;
        };
        body: esi.fleet.NewSettings;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id_members_member_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id_members_member_id: {
        path: {
            fleet_id: number;
            member_id: number;
        };
        body: esi.fleet.Movement;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id_squads_squad_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id_squads_squad_id: {
        path: {
            fleet_id: number;
            squad_id: number;
        };
        body: esi.fleet.Naming;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id_wings_wing_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id_wings_wing_id: {
        path: {
            fleet_id: number;
            wing_id: number;
        };
        body: esi.fleet.Naming;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/incursions/`](https://esi.tech.ccp.is//#!/Incursions/get_incursions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_incursions: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/industry/jobs/`](https://esi.tech.ccp.is//#!/Industry/get_characters_character_id_industry_jobs). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_industry_jobs: {
        query: {
            include_completed?: boolean;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/industry/facilities/`](https://esi.tech.ccp.is//#!/Industry/get_industry_facilities). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_industry_facilities: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/industry/systems/`](https://esi.tech.ccp.is//#!/Industry/get_industry_systems). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_industry_systems: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/insurance/prices/`](https://esi.tech.ccp.is//#!/Insurance/get_insurance_prices). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_insurance_prices: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/killmails/recent/`](https://esi.tech.ccp.is//#!/Killmails/get_characters_character_id_killmails_recent). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_killmails_recent: {
        query: {
            max_count?: number;
            max_kill_id?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/killmails/recent/`](https://esi.tech.ccp.is//#!/Killmails/get_corporations_corporation_id_killmails_recent). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_killmails_recent: {
        query: {
            max_kill_id?: number;
        };
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/killmails/{killmail_id}/{killmail_hash}/`](https://esi.tech.ccp.is//#!/Killmails/get_killmails_killmail_id_killmail_hash). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_killmails_killmail_id_killmail_hash: {
        path: {
            killmail_hash: string;
            killmail_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/location/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_location). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_location: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/online/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_online). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_online: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/ship/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_ship). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_ship: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/loyalty/points/`](https://esi.tech.ccp.is//#!/Loyalty/get_characters_character_id_loyalty_points). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_loyalty_points: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/loyalty/stores/{corporation_id}/offers/`](https://esi.tech.ccp.is//#!/Loyalty/get_loyalty_stores_corporation_id_offers). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_loyalty_stores_corporation_id_offers: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/mail/labels/{label_id}/`](https://esi.tech.ccp.is//#!/Mail/delete_characters_character_id_mail_labels_label_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_mail_labels_label_id: {
        path: {
            character_id: number;
            label_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/delete_characters_character_id_mail_mail_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_mail_mail_id: {
        path: {
            character_id: number;
            mail_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/mail/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_mail: {
        query: {
            labels?: number[];
            last_mail_id?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/characters/{character_id}/mail/labels/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_labels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_mail_labels: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/mail/lists/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_lists). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_mail_lists: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_mail_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_mail_mail_id: {
        path: {
            character_id: number;
            mail_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/mail/`](https://esi.tech.ccp.is//#!/Mail/post_characters_character_id_mail). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_mail: {
        path: {
            character_id: number;
        };
        body: esi.character.mail.NewMail;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v2/characters/{character_id}/mail/labels/`](https://esi.tech.ccp.is//#!/Mail/post_characters_character_id_mail_labels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_mail_labels: {
        path: {
            character_id: number;
        };
        body?: esi.character.mail.NewLabel;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/put_characters_character_id_mail_mail_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_characters_character_id_mail_mail_id: {
        path: {
            character_id: number;
            mail_id: number;
        };
        body: esi.character.mail.MailUpdate;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/orders/`](https://esi.tech.ccp.is//#!/Market/get_characters_character_id_orders). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_orders: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/groups/`](https://esi.tech.ccp.is//#!/Market/get_markets_groups). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_groups: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/groups/{market_group_id}/`](https://esi.tech.ccp.is//#!/Market/get_markets_groups_market_group_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_groups_market_group_id: {
        path: {
            market_group_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/prices/`](https://esi.tech.ccp.is//#!/Market/get_markets_prices). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_prices: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/{region_id}/history/`](https://esi.tech.ccp.is//#!/Market/get_markets_region_id_history). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_region_id_history: {
        query: {
            type_id: number;
        };
        path: {
            region_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/{region_id}/orders/`](https://esi.tech.ccp.is//#!/Market/get_markets_region_id_orders). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_region_id_orders: {
        query: {
            order_type: "buy" | "sell" | "all";
            page?: number;
            type_id?: number;
        };
        path: {
            region_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/{region_id}/types/`](https://esi.tech.ccp.is//#!/Market/get_markets_region_id_types). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_region_id_types: {
        query: {
            page?: number;
        };
        path: {
            region_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/structures/{structure_id}/`](https://esi.tech.ccp.is//#!/Market/get_markets_structures_structure_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_structures_structure_id: {
        query: {
            page?: number;
        };
        path: {
            structure_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/opportunities/`](https://esi.tech.ccp.is//#!/Opportunities/get_characters_character_id_opportunities). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_opportunities: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/groups/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_groups). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_groups: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/groups/{group_id}/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_groups_group_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_groups_group_id: {
        path: {
            group_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/tasks/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_tasks). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_tasks: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/tasks/{task_id}/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_tasks_task_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_tasks_task_id: {
        path: {
            task_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/planets/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_characters_character_id_planets). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_planets: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/characters/{character_id}/planets/{planet_id}/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_characters_character_id_planets_planet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_planets_planet_id: {
        path: {
            character_id: number;
            planet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/schematics/{schematic_id}/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_universe_schematics_schematic_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_schematics_schematic_id: {
        path: {
            schematic_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/route/{origin}/{destination}/`](https://esi.tech.ccp.is//#!/Routes/get_route_origin_destination). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_route_origin_destination: {
        query: {
            avoid?: number[];
            connections?: number[][];
            flag?: "shortest" | "secure" | "insecure";
        };
        path: {
            destination: number;
            origin: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/search/`](https://esi.tech.ccp.is//#!/Search/get_characters_character_id_search). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_search: {
        query: {
            categories: esi.character.SearchCategory[];
            search: string;
            strict?: boolean;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/search/`](https://esi.tech.ccp.is//#!/Search/get_search). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_search: {
        query: {
            categories: esi.SearchCategory[];
            search: string;
            strict?: boolean;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/attributes/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_attributes). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_attributes: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/skillqueue/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_skillqueue). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_skillqueue: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/characters/{character_id}/skills/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_skills). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_skills: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/sovereignty/campaigns/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_campaigns). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_sovereignty_campaigns: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/sovereignty/map/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_map). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_sovereignty_map: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/sovereignty/structures/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_structures). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_sovereignty_structures: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/status/`](https://esi.tech.ccp.is//#!/Status/get_status). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_status: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/bloodlines/`](https://esi.tech.ccp.is//#!/Universe/get_universe_bloodlines). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_bloodlines: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/categories/`](https://esi.tech.ccp.is//#!/Universe/get_universe_categories). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_categories: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/categories/{category_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_categories_category_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_categories_category_id: {
        path: {
            category_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/constellations/`](https://esi.tech.ccp.is//#!/Universe/get_universe_constellations). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_constellations: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/constellations/{constellation_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_constellations_constellation_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_constellations_constellation_id: {
        path: {
            constellation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/factions/`](https://esi.tech.ccp.is//#!/Universe/get_universe_factions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_factions: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/graphics/`](https://esi.tech.ccp.is//#!/Universe/get_universe_graphics). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_graphics: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/graphics/{graphic_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_graphics_graphic_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_graphics_graphic_id: {
        path: {
            graphic_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/groups/`](https://esi.tech.ccp.is//#!/Universe/get_universe_groups). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_groups: {
        query: {
            page?: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/groups/{group_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_groups_group_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_groups_group_id: {
        path: {
            group_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/moons/{moon_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_moons_moon_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_moons_moon_id: {
        path: {
            moon_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/planets/{planet_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_planets_planet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_planets_planet_id: {
        path: {
            planet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/races/`](https://esi.tech.ccp.is//#!/Universe/get_universe_races). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_races: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/regions/`](https://esi.tech.ccp.is//#!/Universe/get_universe_regions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_regions: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/regions/{region_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_regions_region_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_regions_region_id: {
        path: {
            region_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/stargates/{stargate_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stargates_stargate_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_stargates_stargate_id: {
        path: {
            stargate_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/stars/{star_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stars_star_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_stars_star_id: {
        path: {
            star_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/universe/stations/{station_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stations_station_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_stations_station_id: {
        path: {
            station_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/structures/`](https://esi.tech.ccp.is//#!/Universe/get_universe_structures). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_structures: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/structures/{structure_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_structures_structure_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_structures_structure_id: {
        path: {
            structure_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/system_jumps/`](https://esi.tech.ccp.is//#!/Universe/get_universe_system_jumps). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_system_jumps: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/universe/system_kills/`](https://esi.tech.ccp.is//#!/Universe/get_universe_system_kills). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_system_kills: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/systems/`](https://esi.tech.ccp.is//#!/Universe/get_universe_systems). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_systems: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/universe/systems/{system_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_systems_system_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_systems_system_id: {
        path: {
            system_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/types/`](https://esi.tech.ccp.is//#!/Universe/get_universe_types). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_types: {
        query: {
            page?: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/universe/types/{type_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_types_type_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_types_type_id: {
        path: {
            type_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v2/universe/names/`](https://esi.tech.ccp.is//#!/Universe/post_universe_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_universe_names: {
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v2/ui/autopilot/waypoint/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_autopilot_waypoint). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_autopilot_waypoint: {
        query: {
            add_to_beginning: boolean;
            clear_other_waypoints: boolean;
            destination_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/contract/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_contract). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_contract: {
        query: {
            contract_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/information/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_information). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_information: {
        query: {
            target_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/marketdetails/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_marketdetails). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_marketdetails: {
        query: {
            type_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/newmail/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_newmail). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_newmail: {
        body: esi.character.mail.NewMailWindow;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/wallet/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_wallet: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/wallet/journal/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet_journal). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_wallet_journal: {
        query: {
            from_id?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/wallet/transactions/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet_transactions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_wallet_transactions: {
        query: {
            from_id?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/wallets/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_wallets: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/wallets/{division}/journal/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets_division_journal). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_wallets_division_journal: {
        query: {
            from_id?: number;
        };
        path: {
            corporation_id: number;
            division: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/wallets/{division}/transactions/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets_division_transactions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_wallets_division_transactions: {
        query: {
            from_id?: number;
        };
        path: {
            corporation_id: number;
            division: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/wars/`](https://esi.tech.ccp.is//#!/Wars/get_wars). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_wars: {
        query: {
            max_war_id?: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/wars/{war_id}/`](https://esi.tech.ccp.is//#!/Wars/get_wars_war_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_wars_war_id: {
        path: {
            war_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/wars/{war_id}/killmails/`](https://esi.tech.ccp.is//#!/Wars/get_wars_war_id_killmails). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_wars_war_id_killmails: {
        query: {
            page?: number;
        };
        path: {
            war_id: number;
        };
    };
}
/**
 * A special-purpose interface that provides keys mapping from route ID to the response type for each route.  This is not intended to be instantiated, but as a tool with TypeScript's `keyof` features to support type checking on generic response functions.
 */
export interface Responses {
    /**
     * The type of this member is the response type of for the route: [`GET /v1/alliances/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances).
     */
    get_alliances: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/alliances/{alliance_id}/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id).
     */
    get_alliances_alliance_id: esi.alliance.Alliance;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/alliances/{alliance_id}/corporations/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id_corporations).
     */
    get_alliances_alliance_id_corporations: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/alliances/{alliance_id}/icons/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_alliance_id_icons).
     */
    get_alliances_alliance_id_icons: esi.alliance.Icons;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/alliances/names/`](https://esi.tech.ccp.is//#!/Alliance/get_alliances_names).
     */
    get_alliances_names: esi.alliance.Name[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/assets/`](https://esi.tech.ccp.is//#!/Assets/get_characters_character_id_assets).
     */
    get_characters_character_id_assets: esi.character.asset.Asset[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/assets/`](https://esi.tech.ccp.is//#!/Assets/get_corporations_corporation_id_assets).
     */
    get_corporations_corporation_id_assets: esi.corporation.asset.Asset[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/assets/locations/`](https://esi.tech.ccp.is//#!/Assets/post_characters_character_id_assets_locations).
     */
    post_characters_character_id_assets_locations: esi.character.asset.Location[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/assets/names/`](https://esi.tech.ccp.is//#!/Assets/post_characters_character_id_assets_names).
     */
    post_characters_character_id_assets_names: esi.character.asset.Name[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/bookmarks/`](https://esi.tech.ccp.is//#!/Bookmarks/get_characters_character_id_bookmarks).
     */
    get_characters_character_id_bookmarks: esi.character.Bookmark[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/bookmarks/folders/`](https://esi.tech.ccp.is//#!/Bookmarks/get_characters_character_id_bookmarks_folders).
     */
    get_characters_character_id_bookmarks_folders: esi.character.BookmarksFolder[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/calendar/`](https://esi.tech.ccp.is//#!/Calendar/get_characters_character_id_calendar).
     */
    get_characters_character_id_calendar: esi.character.calendar.Calendar[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.tech.ccp.is//#!/Calendar/get_characters_character_id_calendar_event_id).
     */
    get_characters_character_id_calendar_event_id: esi.character.calendar.Event;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/calendar/{event_id}/attendees/`](https://esi.tech.ccp.is//#!/Calendar/get_characters_character_id_calendar_event_id_attendees).
     */
    get_characters_character_id_calendar_event_id_attendees: esi.character.calendar.Attendee[];
    /**
     * The type of this member is the response type of for the route: [`PUT /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.tech.ccp.is//#!/Calendar/put_characters_character_id_calendar_event_id).
     */
    put_characters_character_id_calendar_event_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v4/characters/{character_id}/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id).
     */
    get_characters_character_id: esi.character.Character;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/agents_research/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_agents_research).
     */
    get_characters_character_id_agents_research: esi.character.AgentResearch[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/blueprints/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_blueprints).
     */
    get_characters_character_id_blueprints: esi.character.asset.Blueprint[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/chat_channels/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_chat_channels).
     */
    get_characters_character_id_chat_channels: esi.character.channel.ChatChannel[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/corporationhistory/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_corporationhistory).
     */
    get_characters_character_id_corporationhistory: esi.character.CorporationHistory[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/fatigue/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_fatigue).
     */
    get_characters_character_id_fatigue: esi.character.Fatigue;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/medals/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_medals).
     */
    get_characters_character_id_medals: esi.character.Medal[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/notifications/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_notifications).
     */
    get_characters_character_id_notifications: esi.character.notification.Notification[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/notifications/contacts/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_notifications_contacts).
     */
    get_characters_character_id_notifications_contacts: esi.character.notification.ContactNotification[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/portrait/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_portrait).
     */
    get_characters_character_id_portrait: esi.character.Portrait;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/roles/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_roles).
     */
    get_characters_character_id_roles: esi.Role[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/standings/`](https://esi.tech.ccp.is//#!/Character/get_characters_character_id_standings).
     */
    get_characters_character_id_standings: esi.character.Standing[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/names/`](https://esi.tech.ccp.is//#!/Character/get_characters_names).
     */
    get_characters_names: esi.character.Name[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/affiliation/`](https://esi.tech.ccp.is//#!/Character/post_characters_affiliation).
     */
    post_characters_affiliation: esi.character.Affiliation[];
    /**
     * The type of this member is the response type of for the route: [`POST /v3/characters/{character_id}/cspa/`](https://esi.tech.ccp.is//#!/Character/post_characters_character_id_cspa).
     */
    post_characters_character_id_cspa: esi.character.CSPACost;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/clones/`](https://esi.tech.ccp.is//#!/Clones/get_characters_character_id_clones).
     */
    get_characters_character_id_clones: esi.character.Clones;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/implants/`](https://esi.tech.ccp.is//#!/Clones/get_characters_character_id_implants).
     */
    get_characters_character_id_implants: number[];
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/delete_characters_character_id_contacts).
     */
    delete_characters_character_id_contacts: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/get_characters_character_id_contacts).
     */
    get_characters_character_id_contacts: esi.character.Contact[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contacts/labels/`](https://esi.tech.ccp.is//#!/Contacts/get_characters_character_id_contacts_labels).
     */
    get_characters_character_id_contacts_labels: esi.character.ContactLabel[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/get_corporations_corporation_id_contacts).
     */
    get_corporations_corporation_id_contacts: esi.corporation.Contact[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/post_characters_character_id_contacts).
     */
    post_characters_character_id_contacts: number[];
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/characters/{character_id}/contacts/`](https://esi.tech.ccp.is//#!/Contacts/put_characters_character_id_contacts).
     */
    put_characters_character_id_contacts: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contracts/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts).
     */
    get_characters_character_id_contracts: esi.character.contract.Contract[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/bids/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts_contract_id_bids).
     */
    get_characters_character_id_contracts_contract_id_bids: esi.character.contract.Bid[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/items/`](https://esi.tech.ccp.is//#!/Contracts/get_characters_character_id_contracts_contract_id_items).
     */
    get_characters_character_id_contracts_contract_id_items: esi.character.contract.Item[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/corporations/{corporation_id}/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id).
     */
    get_corporations_corporation_id: esi.corporation.Corporation;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/corporations/{corporation_id}/alliancehistory/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_alliancehistory).
     */
    get_corporations_corporation_id_alliancehistory: esi.corporation.AllianceHistory[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/blueprints/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_blueprints).
     */
    get_corporations_corporation_id_blueprints: esi.corporation.asset.Blueprint[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/divisions/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_divisions).
     */
    get_corporations_corporation_id_divisions: esi.corporation.Divisions;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/icons/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_icons).
     */
    get_corporations_corporation_id_icons: esi.corporation.Icons;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/corporations/{corporation_id}/members/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_members).
     */
    get_corporations_corporation_id_members: esi.corporation.Member[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/members/limit/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_members_limit).
     */
    get_corporations_corporation_id_members_limit: number;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/membertracking/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_membertracking).
     */
    get_corporations_corporation_id_membertracking: esi.corporation.MemberDetails[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/roles/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_roles).
     */
    get_corporations_corporation_id_roles: esi.corporation.MemberRoles[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/structures/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_structures).
     */
    get_corporations_corporation_id_structures: esi.corporation.structure.Structure[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/titles/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_corporation_id_titles).
     */
    get_corporations_corporation_id_titles: esi.corporation.Title[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/names/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_names).
     */
    get_corporations_names: esi.corporation.Name[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/npccorps/`](https://esi.tech.ccp.is//#!/Corporation/get_corporations_npccorps).
     */
    get_corporations_npccorps: number[];
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/corporations/{corporation_id}/structures/{structure_id}/`](https://esi.tech.ccp.is//#!/Corporation/put_corporations_corporation_id_structures_structure_id).
     */
    put_corporations_corporation_id_structures_structure_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/dogma/attributes/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_attributes).
     */
    get_dogma_attributes: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/dogma/attributes/{attribute_id}/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_attributes_attribute_id).
     */
    get_dogma_attributes_attribute_id: esi.dogma.Attribute;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/dogma/effects/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_effects).
     */
    get_dogma_effects: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/dogma/effects/{effect_id}/`](https://esi.tech.ccp.is//#!/Dogma/get_dogma_effects_effect_id).
     */
    get_dogma_effects_effect_id: esi.dogma.Effect;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fw/leaderboards/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards).
     */
    get_fw_leaderboards: esi.factionwarfare.FactionLeaderboard;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fw/leaderboards/characters/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards_characters).
     */
    get_fw_leaderboards_characters: esi.factionwarfare.CharacterLeaderboard;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fw/leaderboards/corporations/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_leaderboards_corporations).
     */
    get_fw_leaderboards_corporations: esi.factionwarfare.CorporationLeaderboard;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fw/stats/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_stats).
     */
    get_fw_stats: esi.factionwarfare.FactionStatistics[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fw/systems/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_systems).
     */
    get_fw_systems: esi.factionwarfare.System[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fw/wars/`](https://esi.tech.ccp.is//#!/Faction Warfare/get_fw_wars).
     */
    get_fw_wars: esi.factionwarfare.War[];
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/fittings/{fitting_id}/`](https://esi.tech.ccp.is//#!/Fittings/delete_characters_character_id_fittings_fitting_id).
     */
    delete_characters_character_id_fittings_fitting_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/fittings/`](https://esi.tech.ccp.is//#!/Fittings/get_characters_character_id_fittings).
     */
    get_characters_character_id_fittings: esi.character.fitting.Fitting[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/fittings/`](https://esi.tech.ccp.is//#!/Fittings/post_characters_character_id_fittings).
     */
    post_characters_character_id_fittings: esi.character.fitting.FittingID;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.tech.ccp.is//#!/Fleets/delete_fleets_fleet_id_members_member_id).
     */
    delete_fleets_fleet_id_members_member_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.tech.ccp.is//#!/Fleets/delete_fleets_fleet_id_squads_squad_id).
     */
    delete_fleets_fleet_id_squads_squad_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.tech.ccp.is//#!/Fleets/delete_fleets_fleet_id_wings_wing_id).
     */
    delete_fleets_fleet_id_wings_wing_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fleets/{fleet_id}/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id).
     */
    get_fleets_fleet_id: esi.fleet.Fleet;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fleets/{fleet_id}/members/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id_members).
     */
    get_fleets_fleet_id_members: esi.fleet.Member[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fleets/{fleet_id}/wings/`](https://esi.tech.ccp.is//#!/Fleets/get_fleets_fleet_id_wings).
     */
    get_fleets_fleet_id_wings: esi.fleet.Wing[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/fleets/{fleet_id}/members/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_members).
     */
    post_fleets_fleet_id_members: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/fleets/{fleet_id}/wings/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_wings).
     */
    post_fleets_fleet_id_wings: esi.fleet.WingID;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/fleets/{fleet_id}/wings/{wing_id}/squads/`](https://esi.tech.ccp.is//#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads).
     */
    post_fleets_fleet_id_wings_wing_id_squads: esi.fleet.SquadID;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id).
     */
    put_fleets_fleet_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id_members_member_id).
     */
    put_fleets_fleet_id_members_member_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id_squads_squad_id).
     */
    put_fleets_fleet_id_squads_squad_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.tech.ccp.is//#!/Fleets/put_fleets_fleet_id_wings_wing_id).
     */
    put_fleets_fleet_id_wings_wing_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/incursions/`](https://esi.tech.ccp.is//#!/Incursions/get_incursions).
     */
    get_incursions: esi.Incursion[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/industry/jobs/`](https://esi.tech.ccp.is//#!/Industry/get_characters_character_id_industry_jobs).
     */
    get_characters_character_id_industry_jobs: esi.character.IndustryJob[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/industry/facilities/`](https://esi.tech.ccp.is//#!/Industry/get_industry_facilities).
     */
    get_industry_facilities: esi.industry.Facility[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/industry/systems/`](https://esi.tech.ccp.is//#!/Industry/get_industry_systems).
     */
    get_industry_systems: esi.industry.System[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/insurance/prices/`](https://esi.tech.ccp.is//#!/Insurance/get_insurance_prices).
     */
    get_insurance_prices: esi.InsurancePrice[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/killmails/recent/`](https://esi.tech.ccp.is//#!/Killmails/get_characters_character_id_killmails_recent).
     */
    get_characters_character_id_killmails_recent: esi.killmail.KillmailLink[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/killmails/recent/`](https://esi.tech.ccp.is//#!/Killmails/get_corporations_corporation_id_killmails_recent).
     */
    get_corporations_corporation_id_killmails_recent: esi.killmail.KillmailLink[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/killmails/{killmail_id}/{killmail_hash}/`](https://esi.tech.ccp.is//#!/Killmails/get_killmails_killmail_id_killmail_hash).
     */
    get_killmails_killmail_id_killmail_hash: esi.killmail.Killmail;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/location/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_location).
     */
    get_characters_character_id_location: esi.character.Location;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/online/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_online).
     */
    get_characters_character_id_online: boolean;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/ship/`](https://esi.tech.ccp.is//#!/Location/get_characters_character_id_ship).
     */
    get_characters_character_id_ship: esi.character.Ship;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/loyalty/points/`](https://esi.tech.ccp.is//#!/Loyalty/get_characters_character_id_loyalty_points).
     */
    get_characters_character_id_loyalty_points: esi.character.LoyaltyPoints[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/loyalty/stores/{corporation_id}/offers/`](https://esi.tech.ccp.is//#!/Loyalty/get_loyalty_stores_corporation_id_offers).
     */
    get_loyalty_stores_corporation_id_offers: esi.corporation.LoyaltyStoreOffer[];
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/mail/labels/{label_id}/`](https://esi.tech.ccp.is//#!/Mail/delete_characters_character_id_mail_labels_label_id).
     */
    delete_characters_character_id_mail_labels_label_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/delete_characters_character_id_mail_mail_id).
     */
    delete_characters_character_id_mail_mail_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/mail/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail).
     */
    get_characters_character_id_mail: esi.character.mail.MailHeader[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/characters/{character_id}/mail/labels/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_labels).
     */
    get_characters_character_id_mail_labels: esi.character.mail.Labels;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/mail/lists/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_lists).
     */
    get_characters_character_id_mail_lists: esi.character.mail.List[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/get_characters_character_id_mail_mail_id).
     */
    get_characters_character_id_mail_mail_id: esi.character.mail.Mail;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/mail/`](https://esi.tech.ccp.is//#!/Mail/post_characters_character_id_mail).
     */
    post_characters_character_id_mail: number;
    /**
     * The type of this member is the response type of for the route: [`POST /v2/characters/{character_id}/mail/labels/`](https://esi.tech.ccp.is//#!/Mail/post_characters_character_id_mail_labels).
     */
    post_characters_character_id_mail_labels: number;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.tech.ccp.is//#!/Mail/put_characters_character_id_mail_mail_id).
     */
    put_characters_character_id_mail_mail_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/orders/`](https://esi.tech.ccp.is//#!/Market/get_characters_character_id_orders).
     */
    get_characters_character_id_orders: esi.character.Order[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/groups/`](https://esi.tech.ccp.is//#!/Market/get_markets_groups).
     */
    get_markets_groups: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/groups/{market_group_id}/`](https://esi.tech.ccp.is//#!/Market/get_markets_groups_market_group_id).
     */
    get_markets_groups_market_group_id: esi.market.MarketGroup;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/prices/`](https://esi.tech.ccp.is//#!/Market/get_markets_prices).
     */
    get_markets_prices: esi.market.Price[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/{region_id}/history/`](https://esi.tech.ccp.is//#!/Market/get_markets_region_id_history).
     */
    get_markets_region_id_history: esi.market.History[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/{region_id}/orders/`](https://esi.tech.ccp.is//#!/Market/get_markets_region_id_orders).
     */
    get_markets_region_id_orders: esi.market.Order[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/{region_id}/types/`](https://esi.tech.ccp.is//#!/Market/get_markets_region_id_types).
     */
    get_markets_region_id_types: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/structures/{structure_id}/`](https://esi.tech.ccp.is//#!/Market/get_markets_structures_structure_id).
     */
    get_markets_structures_structure_id: esi.market.Order[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/opportunities/`](https://esi.tech.ccp.is//#!/Opportunities/get_characters_character_id_opportunities).
     */
    get_characters_character_id_opportunities: esi.character.Opportunity[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/groups/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_groups).
     */
    get_opportunities_groups: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/groups/{group_id}/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_groups_group_id).
     */
    get_opportunities_groups_group_id: esi.OpportunitiesGroup;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/tasks/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_tasks).
     */
    get_opportunities_tasks: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/tasks/{task_id}/`](https://esi.tech.ccp.is//#!/Opportunities/get_opportunities_tasks_task_id).
     */
    get_opportunities_tasks_task_id: esi.OpportunitiesTask;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/planets/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_characters_character_id_planets).
     */
    get_characters_character_id_planets: esi.character.planetaryinteraction.PlanetSummary[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/characters/{character_id}/planets/{planet_id}/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_characters_character_id_planets_planet_id).
     */
    get_characters_character_id_planets_planet_id: esi.character.planetaryinteraction.Planet;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/schematics/{schematic_id}/`](https://esi.tech.ccp.is//#!/Planetary Interaction/get_universe_schematics_schematic_id).
     */
    get_universe_schematics_schematic_id: esi.universe.Schematic;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/route/{origin}/{destination}/`](https://esi.tech.ccp.is//#!/Routes/get_route_origin_destination).
     */
    get_route_origin_destination: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/search/`](https://esi.tech.ccp.is//#!/Search/get_characters_character_id_search).
     */
    get_characters_character_id_search: esi.character.Search;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/search/`](https://esi.tech.ccp.is//#!/Search/get_search).
     */
    get_search: esi.Search;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/attributes/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_attributes).
     */
    get_characters_character_id_attributes: esi.character.Attributes;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/skillqueue/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_skillqueue).
     */
    get_characters_character_id_skillqueue: esi.character.Skillqueue[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/characters/{character_id}/skills/`](https://esi.tech.ccp.is//#!/Skills/get_characters_character_id_skills).
     */
    get_characters_character_id_skills: esi.character.Skills;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/sovereignty/campaigns/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_campaigns).
     */
    get_sovereignty_campaigns: esi.sovereignty.Campaign[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/sovereignty/map/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_map).
     */
    get_sovereignty_map: esi.sovereignty.Map[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/sovereignty/structures/`](https://esi.tech.ccp.is//#!/Sovereignty/get_sovereignty_structures).
     */
    get_sovereignty_structures: esi.sovereignty.Structure[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/status/`](https://esi.tech.ccp.is//#!/Status/get_status).
     */
    get_status: esi.Status;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/bloodlines/`](https://esi.tech.ccp.is//#!/Universe/get_universe_bloodlines).
     */
    get_universe_bloodlines: esi.universe.Bloodline[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/categories/`](https://esi.tech.ccp.is//#!/Universe/get_universe_categories).
     */
    get_universe_categories: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/categories/{category_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_categories_category_id).
     */
    get_universe_categories_category_id: esi.universe.Category;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/constellations/`](https://esi.tech.ccp.is//#!/Universe/get_universe_constellations).
     */
    get_universe_constellations: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/constellations/{constellation_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_constellations_constellation_id).
     */
    get_universe_constellations_constellation_id: esi.universe.Constellation;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/factions/`](https://esi.tech.ccp.is//#!/Universe/get_universe_factions).
     */
    get_universe_factions: esi.universe.Faction[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/graphics/`](https://esi.tech.ccp.is//#!/Universe/get_universe_graphics).
     */
    get_universe_graphics: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/graphics/{graphic_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_graphics_graphic_id).
     */
    get_universe_graphics_graphic_id: esi.universe.Graphic;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/groups/`](https://esi.tech.ccp.is//#!/Universe/get_universe_groups).
     */
    get_universe_groups: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/groups/{group_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_groups_group_id).
     */
    get_universe_groups_group_id: esi.universe.Group;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/moons/{moon_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_moons_moon_id).
     */
    get_universe_moons_moon_id: esi.universe.Moon;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/planets/{planet_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_planets_planet_id).
     */
    get_universe_planets_planet_id: esi.universe.Planet;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/races/`](https://esi.tech.ccp.is//#!/Universe/get_universe_races).
     */
    get_universe_races: esi.universe.Race[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/regions/`](https://esi.tech.ccp.is//#!/Universe/get_universe_regions).
     */
    get_universe_regions: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/regions/{region_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_regions_region_id).
     */
    get_universe_regions_region_id: esi.universe.Region;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/stargates/{stargate_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stargates_stargate_id).
     */
    get_universe_stargates_stargate_id: esi.universe.Stargate;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/stars/{star_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stars_star_id).
     */
    get_universe_stars_star_id: esi.universe.Star;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/universe/stations/{station_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_stations_station_id).
     */
    get_universe_stations_station_id: esi.universe.Station;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/structures/`](https://esi.tech.ccp.is//#!/Universe/get_universe_structures).
     */
    get_universe_structures: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/structures/{structure_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_structures_structure_id).
     */
    get_universe_structures_structure_id: esi.universe.Structure;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/system_jumps/`](https://esi.tech.ccp.is//#!/Universe/get_universe_system_jumps).
     */
    get_universe_system_jumps: esi.universe.SystemJumps[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/universe/system_kills/`](https://esi.tech.ccp.is//#!/Universe/get_universe_system_kills).
     */
    get_universe_system_kills: esi.universe.SystemKills[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/systems/`](https://esi.tech.ccp.is//#!/Universe/get_universe_systems).
     */
    get_universe_systems: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/universe/systems/{system_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_systems_system_id).
     */
    get_universe_systems_system_id: esi.universe.System;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/types/`](https://esi.tech.ccp.is//#!/Universe/get_universe_types).
     */
    get_universe_types: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/universe/types/{type_id}/`](https://esi.tech.ccp.is//#!/Universe/get_universe_types_type_id).
     */
    get_universe_types_type_id: esi.universe.Type;
    /**
     * The type of this member is the response type of for the route: [`POST /v2/universe/names/`](https://esi.tech.ccp.is//#!/Universe/post_universe_names).
     */
    post_universe_names: esi.universe.Name[];
    /**
     * The type of this member is the response type of for the route: [`POST /v2/ui/autopilot/waypoint/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_autopilot_waypoint).
     */
    post_ui_autopilot_waypoint: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/contract/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_contract).
     */
    post_ui_openwindow_contract: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/information/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_information).
     */
    post_ui_openwindow_information: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/marketdetails/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_marketdetails).
     */
    post_ui_openwindow_marketdetails: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/newmail/`](https://esi.tech.ccp.is//#!/User Interface/post_ui_openwindow_newmail).
     */
    post_ui_openwindow_newmail: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/wallet/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet).
     */
    get_characters_character_id_wallet: number;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/wallet/journal/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet_journal).
     */
    get_characters_character_id_wallet_journal: esi.character.wallet.Journal[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/wallet/transactions/`](https://esi.tech.ccp.is//#!/Wallet/get_characters_character_id_wallet_transactions).
     */
    get_characters_character_id_wallet_transactions: esi.character.wallet.Transaction[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/wallets/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets).
     */
    get_corporations_corporation_id_wallets: esi.corporation.wallet.Wallet[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/wallets/{division}/journal/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets_division_journal).
     */
    get_corporations_corporation_id_wallets_division_journal: esi.corporation.wallet.Journal[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/wallets/{division}/transactions/`](https://esi.tech.ccp.is//#!/Wallet/get_corporations_corporation_id_wallets_division_transactions).
     */
    get_corporations_corporation_id_wallets_division_transactions: esi.corporation.wallet.Transaction[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/wars/`](https://esi.tech.ccp.is//#!/Wars/get_wars).
     */
    get_wars: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/wars/{war_id}/`](https://esi.tech.ccp.is//#!/Wars/get_wars_war_id).
     */
    get_wars_war_id: esi.War;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/wars/{war_id}/killmails/`](https://esi.tech.ccp.is//#!/Wars/get_wars_war_id_killmails).
     */
    get_wars_war_id_killmails: esi.killmail.KillmailLink[];
}
export const ROUTE_MAP: RouteMap = {
    get_alliances: { url: "/v1/alliances/", method: "GET" },
    get_alliances_alliance_id: { url: "/v2/alliances/{alliance_id}/", method: "GET" },
    get_alliances_alliance_id_corporations: { url: "/v1/alliances/{alliance_id}/corporations/", method: "GET" },
    get_alliances_alliance_id_icons: { url: "/v1/alliances/{alliance_id}/icons/", method: "GET" },
    get_alliances_names: { url: "/v1/alliances/names/", method: "GET" },
    get_characters_character_id_assets: { url: "/v1/characters/{character_id}/assets/", method: "GET" },
    get_corporations_corporation_id_assets: { url: "/v1/corporations/{corporation_id}/assets/", method: "GET" },
    post_characters_character_id_assets_locations: { url: "/v1/characters/{character_id}/assets/locations/", method: "POST" },
    post_characters_character_id_assets_names: { url: "/v1/characters/{character_id}/assets/names/", method: "POST" },
    get_characters_character_id_bookmarks: { url: "/v1/characters/{character_id}/bookmarks/", method: "GET" },
    get_characters_character_id_bookmarks_folders: { url: "/v1/characters/{character_id}/bookmarks/folders/", method: "GET" },
    get_characters_character_id_calendar: { url: "/v1/characters/{character_id}/calendar/", method: "GET" },
    get_characters_character_id_calendar_event_id: { url: "/v3/characters/{character_id}/calendar/{event_id}/", method: "GET" },
    get_characters_character_id_calendar_event_id_attendees: { url: "/v1/characters/{character_id}/calendar/{event_id}/attendees/", method: "GET" },
    put_characters_character_id_calendar_event_id: { url: "/v3/characters/{character_id}/calendar/{event_id}/", method: "PUT" },
    get_characters_character_id: { url: "/v4/characters/{character_id}/", method: "GET" },
    get_characters_character_id_agents_research: { url: "/v1/characters/{character_id}/agents_research/", method: "GET" },
    get_characters_character_id_blueprints: { url: "/v1/characters/{character_id}/blueprints/", method: "GET" },
    get_characters_character_id_chat_channels: { url: "/v1/characters/{character_id}/chat_channels/", method: "GET" },
    get_characters_character_id_corporationhistory: { url: "/v1/characters/{character_id}/corporationhistory/", method: "GET" },
    get_characters_character_id_fatigue: { url: "/v1/characters/{character_id}/fatigue/", method: "GET" },
    get_characters_character_id_medals: { url: "/v1/characters/{character_id}/medals/", method: "GET" },
    get_characters_character_id_notifications: { url: "/v1/characters/{character_id}/notifications/", method: "GET" },
    get_characters_character_id_notifications_contacts: { url: "/v1/characters/{character_id}/notifications/contacts/", method: "GET" },
    get_characters_character_id_portrait: { url: "/v2/characters/{character_id}/portrait/", method: "GET" },
    get_characters_character_id_roles: { url: "/v1/characters/{character_id}/roles/", method: "GET" },
    get_characters_character_id_standings: { url: "/v1/characters/{character_id}/standings/", method: "GET" },
    get_characters_names: { url: "/v1/characters/names/", method: "GET" },
    post_characters_affiliation: { url: "/v1/characters/affiliation/", method: "POST" },
    post_characters_character_id_cspa: { url: "/v3/characters/{character_id}/cspa/", method: "POST" },
    get_characters_character_id_clones: { url: "/v2/characters/{character_id}/clones/", method: "GET" },
    get_characters_character_id_implants: { url: "/v1/characters/{character_id}/implants/", method: "GET" },
    delete_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "DELETE" },
    get_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "GET" },
    get_characters_character_id_contacts_labels: { url: "/v1/characters/{character_id}/contacts/labels/", method: "GET" },
    get_corporations_corporation_id_contacts: { url: "/v1/corporations/{corporation_id}/contacts/", method: "GET" },
    post_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "POST" },
    put_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "PUT" },
    get_characters_character_id_contracts: { url: "/v1/characters/{character_id}/contracts/", method: "GET" },
    get_characters_character_id_contracts_contract_id_bids: { url: "/v1/characters/{character_id}/contracts/{contract_id}/bids/", method: "GET" },
    get_characters_character_id_contracts_contract_id_items: { url: "/v1/characters/{character_id}/contracts/{contract_id}/items/", method: "GET" },
    get_corporations_corporation_id: { url: "/v3/corporations/{corporation_id}/", method: "GET" },
    get_corporations_corporation_id_alliancehistory: { url: "/v2/corporations/{corporation_id}/alliancehistory/", method: "GET" },
    get_corporations_corporation_id_blueprints: { url: "/v1/corporations/{corporation_id}/blueprints/", method: "GET" },
    get_corporations_corporation_id_divisions: { url: "/v1/corporations/{corporation_id}/divisions/", method: "GET" },
    get_corporations_corporation_id_icons: { url: "/v1/corporations/{corporation_id}/icons/", method: "GET" },
    get_corporations_corporation_id_members: { url: "/v2/corporations/{corporation_id}/members/", method: "GET" },
    get_corporations_corporation_id_members_limit: { url: "/v1/corporations/{corporation_id}/members/limit/", method: "GET" },
    get_corporations_corporation_id_membertracking: { url: "/v1/corporations/{corporation_id}/membertracking/", method: "GET" },
    get_corporations_corporation_id_roles: { url: "/v1/corporations/{corporation_id}/roles/", method: "GET" },
    get_corporations_corporation_id_structures: { url: "/v1/corporations/{corporation_id}/structures/", method: "GET" },
    get_corporations_corporation_id_titles: { url: "/v1/corporations/{corporation_id}/titles/", method: "GET" },
    get_corporations_names: { url: "/v1/corporations/names/", method: "GET" },
    get_corporations_npccorps: { url: "/v1/corporations/npccorps/", method: "GET" },
    put_corporations_corporation_id_structures_structure_id: { url: "/v1/corporations/{corporation_id}/structures/{structure_id}/", method: "PUT" },
    get_dogma_attributes: { url: "/v1/dogma/attributes/", method: "GET" },
    get_dogma_attributes_attribute_id: { url: "/v1/dogma/attributes/{attribute_id}/", method: "GET" },
    get_dogma_effects: { url: "/v1/dogma/effects/", method: "GET" },
    get_dogma_effects_effect_id: { url: "/v2/dogma/effects/{effect_id}/", method: "GET" },
    get_fw_leaderboards: { url: "/v1/fw/leaderboards/", method: "GET" },
    get_fw_leaderboards_characters: { url: "/v1/fw/leaderboards/characters/", method: "GET" },
    get_fw_leaderboards_corporations: { url: "/v1/fw/leaderboards/corporations/", method: "GET" },
    get_fw_stats: { url: "/v1/fw/stats/", method: "GET" },
    get_fw_systems: { url: "/v1/fw/systems/", method: "GET" },
    get_fw_wars: { url: "/v1/fw/wars/", method: "GET" },
    delete_characters_character_id_fittings_fitting_id: { url: "/v1/characters/{character_id}/fittings/{fitting_id}/", method: "DELETE" },
    get_characters_character_id_fittings: { url: "/v1/characters/{character_id}/fittings/", method: "GET" },
    post_characters_character_id_fittings: { url: "/v1/characters/{character_id}/fittings/", method: "POST" },
    delete_fleets_fleet_id_members_member_id: { url: "/v1/fleets/{fleet_id}/members/{member_id}/", method: "DELETE" },
    delete_fleets_fleet_id_squads_squad_id: { url: "/v1/fleets/{fleet_id}/squads/{squad_id}/", method: "DELETE" },
    delete_fleets_fleet_id_wings_wing_id: { url: "/v1/fleets/{fleet_id}/wings/{wing_id}/", method: "DELETE" },
    get_fleets_fleet_id: { url: "/v1/fleets/{fleet_id}/", method: "GET" },
    get_fleets_fleet_id_members: { url: "/v1/fleets/{fleet_id}/members/", method: "GET" },
    get_fleets_fleet_id_wings: { url: "/v1/fleets/{fleet_id}/wings/", method: "GET" },
    post_fleets_fleet_id_members: { url: "/v1/fleets/{fleet_id}/members/", method: "POST" },
    post_fleets_fleet_id_wings: { url: "/v1/fleets/{fleet_id}/wings/", method: "POST" },
    post_fleets_fleet_id_wings_wing_id_squads: { url: "/v1/fleets/{fleet_id}/wings/{wing_id}/squads/", method: "POST" },
    put_fleets_fleet_id: { url: "/v1/fleets/{fleet_id}/", method: "PUT" },
    put_fleets_fleet_id_members_member_id: { url: "/v1/fleets/{fleet_id}/members/{member_id}/", method: "PUT" },
    put_fleets_fleet_id_squads_squad_id: { url: "/v1/fleets/{fleet_id}/squads/{squad_id}/", method: "PUT" },
    put_fleets_fleet_id_wings_wing_id: { url: "/v1/fleets/{fleet_id}/wings/{wing_id}/", method: "PUT" },
    get_incursions: { url: "/v1/incursions/", method: "GET" },
    get_characters_character_id_industry_jobs: { url: "/v1/characters/{character_id}/industry/jobs/", method: "GET" },
    get_industry_facilities: { url: "/v1/industry/facilities/", method: "GET" },
    get_industry_systems: { url: "/v1/industry/systems/", method: "GET" },
    get_insurance_prices: { url: "/v1/insurance/prices/", method: "GET" },
    get_characters_character_id_killmails_recent: { url: "/v1/characters/{character_id}/killmails/recent/", method: "GET" },
    get_corporations_corporation_id_killmails_recent: { url: "/v1/corporations/{corporation_id}/killmails/recent/", method: "GET" },
    get_killmails_killmail_id_killmail_hash: { url: "/v1/killmails/{killmail_id}/{killmail_hash}/", method: "GET" },
    get_characters_character_id_location: { url: "/v1/characters/{character_id}/location/", method: "GET" },
    get_characters_character_id_online: { url: "/v1/characters/{character_id}/online/", method: "GET" },
    get_characters_character_id_ship: { url: "/v1/characters/{character_id}/ship/", method: "GET" },
    get_characters_character_id_loyalty_points: { url: "/v1/characters/{character_id}/loyalty/points/", method: "GET" },
    get_loyalty_stores_corporation_id_offers: { url: "/v1/loyalty/stores/{corporation_id}/offers/", method: "GET" },
    delete_characters_character_id_mail_labels_label_id: { url: "/v1/characters/{character_id}/mail/labels/{label_id}/", method: "DELETE" },
    delete_characters_character_id_mail_mail_id: { url: "/v1/characters/{character_id}/mail/{mail_id}/", method: "DELETE" },
    get_characters_character_id_mail: { url: "/v1/characters/{character_id}/mail/", method: "GET" },
    get_characters_character_id_mail_labels: { url: "/v3/characters/{character_id}/mail/labels/", method: "GET" },
    get_characters_character_id_mail_lists: { url: "/v1/characters/{character_id}/mail/lists/", method: "GET" },
    get_characters_character_id_mail_mail_id: { url: "/v1/characters/{character_id}/mail/{mail_id}/", method: "GET" },
    post_characters_character_id_mail: { url: "/v1/characters/{character_id}/mail/", method: "POST" },
    post_characters_character_id_mail_labels: { url: "/v2/characters/{character_id}/mail/labels/", method: "POST" },
    put_characters_character_id_mail_mail_id: { url: "/v1/characters/{character_id}/mail/{mail_id}/", method: "PUT" },
    get_characters_character_id_orders: { url: "/v1/characters/{character_id}/orders/", method: "GET" },
    get_markets_groups: { url: "/v1/markets/groups/", method: "GET" },
    get_markets_groups_market_group_id: { url: "/v1/markets/groups/{market_group_id}/", method: "GET" },
    get_markets_prices: { url: "/v1/markets/prices/", method: "GET" },
    get_markets_region_id_history: { url: "/v1/markets/{region_id}/history/", method: "GET" },
    get_markets_region_id_orders: { url: "/v1/markets/{region_id}/orders/", method: "GET" },
    get_markets_region_id_types: { url: "/v1/markets/{region_id}/types/", method: "GET" },
    get_markets_structures_structure_id: { url: "/v1/markets/structures/{structure_id}/", method: "GET" },
    get_characters_character_id_opportunities: { url: "/v1/characters/{character_id}/opportunities/", method: "GET" },
    get_opportunities_groups: { url: "/v1/opportunities/groups/", method: "GET" },
    get_opportunities_groups_group_id: { url: "/v1/opportunities/groups/{group_id}/", method: "GET" },
    get_opportunities_tasks: { url: "/v1/opportunities/tasks/", method: "GET" },
    get_opportunities_tasks_task_id: { url: "/v1/opportunities/tasks/{task_id}/", method: "GET" },
    get_characters_character_id_planets: { url: "/v1/characters/{character_id}/planets/", method: "GET" },
    get_characters_character_id_planets_planet_id: { url: "/v3/characters/{character_id}/planets/{planet_id}/", method: "GET" },
    get_universe_schematics_schematic_id: { url: "/v1/universe/schematics/{schematic_id}/", method: "GET" },
    get_route_origin_destination: { url: "/v1/route/{origin}/{destination}/", method: "GET" },
    get_characters_character_id_search: { url: "/v2/characters/{character_id}/search/", method: "GET" },
    get_search: { url: "/v1/search/", method: "GET" },
    get_characters_character_id_attributes: { url: "/v1/characters/{character_id}/attributes/", method: "GET" },
    get_characters_character_id_skillqueue: { url: "/v2/characters/{character_id}/skillqueue/", method: "GET" },
    get_characters_character_id_skills: { url: "/v3/characters/{character_id}/skills/", method: "GET" },
    get_sovereignty_campaigns: { url: "/v1/sovereignty/campaigns/", method: "GET" },
    get_sovereignty_map: { url: "/v1/sovereignty/map/", method: "GET" },
    get_sovereignty_structures: { url: "/v1/sovereignty/structures/", method: "GET" },
    get_status: { url: "/v1/status/", method: "GET" },
    get_universe_bloodlines: { url: "/v1/universe/bloodlines/", method: "GET" },
    get_universe_categories: { url: "/v1/universe/categories/", method: "GET" },
    get_universe_categories_category_id: { url: "/v1/universe/categories/{category_id}/", method: "GET" },
    get_universe_constellations: { url: "/v1/universe/constellations/", method: "GET" },
    get_universe_constellations_constellation_id: { url: "/v1/universe/constellations/{constellation_id}/", method: "GET" },
    get_universe_factions: { url: "/v1/universe/factions/", method: "GET" },
    get_universe_graphics: { url: "/v1/universe/graphics/", method: "GET" },
    get_universe_graphics_graphic_id: { url: "/v1/universe/graphics/{graphic_id}/", method: "GET" },
    get_universe_groups: { url: "/v1/universe/groups/", method: "GET" },
    get_universe_groups_group_id: { url: "/v1/universe/groups/{group_id}/", method: "GET" },
    get_universe_moons_moon_id: { url: "/v1/universe/moons/{moon_id}/", method: "GET" },
    get_universe_planets_planet_id: { url: "/v1/universe/planets/{planet_id}/", method: "GET" },
    get_universe_races: { url: "/v1/universe/races/", method: "GET" },
    get_universe_regions: { url: "/v1/universe/regions/", method: "GET" },
    get_universe_regions_region_id: { url: "/v1/universe/regions/{region_id}/", method: "GET" },
    get_universe_stargates_stargate_id: { url: "/v1/universe/stargates/{stargate_id}/", method: "GET" },
    get_universe_stars_star_id: { url: "/v1/universe/stars/{star_id}/", method: "GET" },
    get_universe_stations_station_id: { url: "/v2/universe/stations/{station_id}/", method: "GET" },
    get_universe_structures: { url: "/v1/universe/structures/", method: "GET" },
    get_universe_structures_structure_id: { url: "/v1/universe/structures/{structure_id}/", method: "GET" },
    get_universe_system_jumps: { url: "/v1/universe/system_jumps/", method: "GET" },
    get_universe_system_kills: { url: "/v2/universe/system_kills/", method: "GET" },
    get_universe_systems: { url: "/v1/universe/systems/", method: "GET" },
    get_universe_systems_system_id: { url: "/v3/universe/systems/{system_id}/", method: "GET" },
    get_universe_types: { url: "/v1/universe/types/", method: "GET" },
    get_universe_types_type_id: { url: "/v2/universe/types/{type_id}/", method: "GET" },
    post_universe_names: { url: "/v2/universe/names/", method: "POST" },
    post_ui_autopilot_waypoint: { url: "/v2/ui/autopilot/waypoint/", method: "POST" },
    post_ui_openwindow_contract: { url: "/v1/ui/openwindow/contract/", method: "POST" },
    post_ui_openwindow_information: { url: "/v1/ui/openwindow/information/", method: "POST" },
    post_ui_openwindow_marketdetails: { url: "/v1/ui/openwindow/marketdetails/", method: "POST" },
    post_ui_openwindow_newmail: { url: "/v1/ui/openwindow/newmail/", method: "POST" },
    get_characters_character_id_wallet: { url: "/v1/characters/{character_id}/wallet/", method: "GET" },
    get_characters_character_id_wallet_journal: { url: "/v1/characters/{character_id}/wallet/journal/", method: "GET" },
    get_characters_character_id_wallet_transactions: { url: "/v1/characters/{character_id}/wallet/transactions/", method: "GET" },
    get_corporations_corporation_id_wallets: { url: "/v1/corporations/{corporation_id}/wallets/", method: "GET" },
    get_corporations_corporation_id_wallets_division_journal: { url: "/v1/corporations/{corporation_id}/wallets/{division}/journal/", method: "GET" },
    get_corporations_corporation_id_wallets_division_transactions: { url: "/v1/corporations/{corporation_id}/wallets/{division}/transactions/", method: "GET" },
    get_wars: { url: "/v1/wars/", method: "GET" },
    get_wars_war_id: { url: "/v1/wars/{war_id}/", method: "GET" },
    get_wars_war_id_killmails: { url: "/v1/wars/{war_id}/killmails/", method: "GET" }
};
export interface RouteMap {
    get_alliances: URLInfo;
    get_alliances_alliance_id: URLInfo;
    get_alliances_alliance_id_corporations: URLInfo;
    get_alliances_alliance_id_icons: URLInfo;
    get_alliances_names: URLInfo;
    get_characters_character_id_assets: URLInfo;
    get_corporations_corporation_id_assets: URLInfo;
    post_characters_character_id_assets_locations: URLInfo;
    post_characters_character_id_assets_names: URLInfo;
    get_characters_character_id_bookmarks: URLInfo;
    get_characters_character_id_bookmarks_folders: URLInfo;
    get_characters_character_id_calendar: URLInfo;
    get_characters_character_id_calendar_event_id: URLInfo;
    get_characters_character_id_calendar_event_id_attendees: URLInfo;
    put_characters_character_id_calendar_event_id: URLInfo;
    get_characters_character_id: URLInfo;
    get_characters_character_id_agents_research: URLInfo;
    get_characters_character_id_blueprints: URLInfo;
    get_characters_character_id_chat_channels: URLInfo;
    get_characters_character_id_corporationhistory: URLInfo;
    get_characters_character_id_fatigue: URLInfo;
    get_characters_character_id_medals: URLInfo;
    get_characters_character_id_notifications: URLInfo;
    get_characters_character_id_notifications_contacts: URLInfo;
    get_characters_character_id_portrait: URLInfo;
    get_characters_character_id_roles: URLInfo;
    get_characters_character_id_standings: URLInfo;
    get_characters_names: URLInfo;
    post_characters_affiliation: URLInfo;
    post_characters_character_id_cspa: URLInfo;
    get_characters_character_id_clones: URLInfo;
    get_characters_character_id_implants: URLInfo;
    delete_characters_character_id_contacts: URLInfo;
    get_characters_character_id_contacts: URLInfo;
    get_characters_character_id_contacts_labels: URLInfo;
    get_corporations_corporation_id_contacts: URLInfo;
    post_characters_character_id_contacts: URLInfo;
    put_characters_character_id_contacts: URLInfo;
    get_characters_character_id_contracts: URLInfo;
    get_characters_character_id_contracts_contract_id_bids: URLInfo;
    get_characters_character_id_contracts_contract_id_items: URLInfo;
    get_corporations_corporation_id: URLInfo;
    get_corporations_corporation_id_alliancehistory: URLInfo;
    get_corporations_corporation_id_blueprints: URLInfo;
    get_corporations_corporation_id_divisions: URLInfo;
    get_corporations_corporation_id_icons: URLInfo;
    get_corporations_corporation_id_members: URLInfo;
    get_corporations_corporation_id_members_limit: URLInfo;
    get_corporations_corporation_id_membertracking: URLInfo;
    get_corporations_corporation_id_roles: URLInfo;
    get_corporations_corporation_id_structures: URLInfo;
    get_corporations_corporation_id_titles: URLInfo;
    get_corporations_names: URLInfo;
    get_corporations_npccorps: URLInfo;
    put_corporations_corporation_id_structures_structure_id: URLInfo;
    get_dogma_attributes: URLInfo;
    get_dogma_attributes_attribute_id: URLInfo;
    get_dogma_effects: URLInfo;
    get_dogma_effects_effect_id: URLInfo;
    get_fw_leaderboards: URLInfo;
    get_fw_leaderboards_characters: URLInfo;
    get_fw_leaderboards_corporations: URLInfo;
    get_fw_stats: URLInfo;
    get_fw_systems: URLInfo;
    get_fw_wars: URLInfo;
    delete_characters_character_id_fittings_fitting_id: URLInfo;
    get_characters_character_id_fittings: URLInfo;
    post_characters_character_id_fittings: URLInfo;
    delete_fleets_fleet_id_members_member_id: URLInfo;
    delete_fleets_fleet_id_squads_squad_id: URLInfo;
    delete_fleets_fleet_id_wings_wing_id: URLInfo;
    get_fleets_fleet_id: URLInfo;
    get_fleets_fleet_id_members: URLInfo;
    get_fleets_fleet_id_wings: URLInfo;
    post_fleets_fleet_id_members: URLInfo;
    post_fleets_fleet_id_wings: URLInfo;
    post_fleets_fleet_id_wings_wing_id_squads: URLInfo;
    put_fleets_fleet_id: URLInfo;
    put_fleets_fleet_id_members_member_id: URLInfo;
    put_fleets_fleet_id_squads_squad_id: URLInfo;
    put_fleets_fleet_id_wings_wing_id: URLInfo;
    get_incursions: URLInfo;
    get_characters_character_id_industry_jobs: URLInfo;
    get_industry_facilities: URLInfo;
    get_industry_systems: URLInfo;
    get_insurance_prices: URLInfo;
    get_characters_character_id_killmails_recent: URLInfo;
    get_corporations_corporation_id_killmails_recent: URLInfo;
    get_killmails_killmail_id_killmail_hash: URLInfo;
    get_characters_character_id_location: URLInfo;
    get_characters_character_id_online: URLInfo;
    get_characters_character_id_ship: URLInfo;
    get_characters_character_id_loyalty_points: URLInfo;
    get_loyalty_stores_corporation_id_offers: URLInfo;
    delete_characters_character_id_mail_labels_label_id: URLInfo;
    delete_characters_character_id_mail_mail_id: URLInfo;
    get_characters_character_id_mail: URLInfo;
    get_characters_character_id_mail_labels: URLInfo;
    get_characters_character_id_mail_lists: URLInfo;
    get_characters_character_id_mail_mail_id: URLInfo;
    post_characters_character_id_mail: URLInfo;
    post_characters_character_id_mail_labels: URLInfo;
    put_characters_character_id_mail_mail_id: URLInfo;
    get_characters_character_id_orders: URLInfo;
    get_markets_groups: URLInfo;
    get_markets_groups_market_group_id: URLInfo;
    get_markets_prices: URLInfo;
    get_markets_region_id_history: URLInfo;
    get_markets_region_id_orders: URLInfo;
    get_markets_region_id_types: URLInfo;
    get_markets_structures_structure_id: URLInfo;
    get_characters_character_id_opportunities: URLInfo;
    get_opportunities_groups: URLInfo;
    get_opportunities_groups_group_id: URLInfo;
    get_opportunities_tasks: URLInfo;
    get_opportunities_tasks_task_id: URLInfo;
    get_characters_character_id_planets: URLInfo;
    get_characters_character_id_planets_planet_id: URLInfo;
    get_universe_schematics_schematic_id: URLInfo;
    get_route_origin_destination: URLInfo;
    get_characters_character_id_search: URLInfo;
    get_search: URLInfo;
    get_characters_character_id_attributes: URLInfo;
    get_characters_character_id_skillqueue: URLInfo;
    get_characters_character_id_skills: URLInfo;
    get_sovereignty_campaigns: URLInfo;
    get_sovereignty_map: URLInfo;
    get_sovereignty_structures: URLInfo;
    get_status: URLInfo;
    get_universe_bloodlines: URLInfo;
    get_universe_categories: URLInfo;
    get_universe_categories_category_id: URLInfo;
    get_universe_constellations: URLInfo;
    get_universe_constellations_constellation_id: URLInfo;
    get_universe_factions: URLInfo;
    get_universe_graphics: URLInfo;
    get_universe_graphics_graphic_id: URLInfo;
    get_universe_groups: URLInfo;
    get_universe_groups_group_id: URLInfo;
    get_universe_moons_moon_id: URLInfo;
    get_universe_planets_planet_id: URLInfo;
    get_universe_races: URLInfo;
    get_universe_regions: URLInfo;
    get_universe_regions_region_id: URLInfo;
    get_universe_stargates_stargate_id: URLInfo;
    get_universe_stars_star_id: URLInfo;
    get_universe_stations_station_id: URLInfo;
    get_universe_structures: URLInfo;
    get_universe_structures_structure_id: URLInfo;
    get_universe_system_jumps: URLInfo;
    get_universe_system_kills: URLInfo;
    get_universe_systems: URLInfo;
    get_universe_systems_system_id: URLInfo;
    get_universe_types: URLInfo;
    get_universe_types_type_id: URLInfo;
    post_universe_names: URLInfo;
    post_ui_autopilot_waypoint: URLInfo;
    post_ui_openwindow_contract: URLInfo;
    post_ui_openwindow_information: URLInfo;
    post_ui_openwindow_marketdetails: URLInfo;
    post_ui_openwindow_newmail: URLInfo;
    get_characters_character_id_wallet: URLInfo;
    get_characters_character_id_wallet_journal: URLInfo;
    get_characters_character_id_wallet_transactions: URLInfo;
    get_corporations_corporation_id_wallets: URLInfo;
    get_corporations_corporation_id_wallets_division_journal: URLInfo;
    get_corporations_corporation_id_wallets_division_transactions: URLInfo;
    get_wars: URLInfo;
    get_wars_war_id: URLInfo;
    get_wars_war_id_killmails: URLInfo;
}
export interface URLInfo {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
}
