export declare namespace esi {
    namespace alliance {
        /**
         * This is the response type for the route, [`GET /v2/alliances/{alliance_id}/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id).
         */
        interface Alliance {
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
         * This is the response type for the route, [`GET /v1/alliances/{alliance_id}/icons/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id_icons).
         */
        interface Icons {
            px128x128?: string;
            px64x64?: string;
        }
        interface Name {
            alliance_id: number;
            alliance_name: string;
        }
    }
    namespace character {
        namespace calendar {
            interface Calendar {
                event_date?: string;
                event_id?: number;
                event_response?: esi.character.calendar.EventResponse;
                importance?: number;
                title?: string;
            }
            interface Event {
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
            const enum EventResponse {
                DECLINED = "declined",
                NOT_RESPONDED = "not_responded",
                ACCEPTED = "accepted",
                TENTATIVE = "tentative",
            }
            const enum OwnerType {
                EVE_SERVER = "eve_server",
                CORPORATION = "corporation",
                FACTION = "faction",
                CHARACTER = "character",
                ALLIANCE = "alliance",
            }
            /**
             * This type is a parameter for the route, [`PUT /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.evetech.net//#!/Calendar/put_characters_character_id_calendar_event_id).
             */
            interface Response {
                response: "accepted" | "declined" | "tentative";
            }
        }
        namespace channel {
            interface AllowedAccessor {
                /**
                 * ID of an allowed channel member. ID of a channel operator.
                 */
                accessor_id: number;
                accessor_type: "character" | "corporation" | "alliance";
            }
            interface ChatChannel {
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
                 * Whether this is a password protected channel.
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
            interface RestrictedAccessor {
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
        namespace contract {
            /**
             * To whom the contract is available.
             */
            const enum Availability {
                PUBLIC = "public",
                PERSONAL = "personal",
                CORPORATION = "corporation",
                ALLIANCE = "alliance",
            }
            interface Bid {
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
            interface Contract {
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
            interface Item {
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
            const enum Status {
                OUTSTANDING = "outstanding",
                IN_PROGRESS = "in_progress",
                FINISHED_ISSUER = "finished_issuer",
                FINISHED_CONTRACTOR = "finished_contractor",
                FINISHED = "finished",
                CANCELLED = "cancelled",
                REJECTED = "rejected",
                FAILED = "failed",
                DELETED = "deleted",
                REVERSED = "reversed",
            }
            /**
             * Type of the contract.
             */
            const enum Type {
                UNKNOWN = "unknown",
                ITEM_EXCHANGE = "item_exchange",
                AUCTION = "auction",
                COURIER = "courier",
                LOAN = "loan",
            }
        }
        namespace fitting {
            interface Fitting {
                description: string;
                fitting_id: number;
                items: esi.character.fitting.Item[];
                name: string;
                ship_type_id: number;
            }
            /**
             * This is the response type for the route, [`POST /v1/characters/{character_id}/fittings/`](https://esi.evetech.net//#!/Fittings/post_characters_character_id_fittings).
             */
            interface FittingID {
                fitting_id: number;
            }
            interface Item {
                flag: number;
                quantity: number;
                type_id: number;
            }
            /**
             * This type is a parameter for the route, [`POST /v1/characters/{character_id}/fittings/`](https://esi.evetech.net//#!/Fittings/post_characters_character_id_fittings).
             */
            interface NewFitting {
                description: string;
                items: esi.character.fitting.Item[];
                name: string;
                ship_type_id: number;
            }
        }
        namespace mail {
            /**
             * Hexadecimal string representing label color, in RGB format.
             */
            const enum Color {
                C_FFFFFF = "#ffffff",
                C_FFFF01 = "#ffff01",
                C_FF6600 = "#ff6600",
                C_FE0000 = "#fe0000",
                C_9A0000 = "#9a0000",
                C_660066 = "#660066",
                C_0000FE = "#0000fe",
                C_0099FF = "#0099ff",
                C_01FFFF = "#01ffff",
                C_00FF33 = "#00ff33",
                C_349800 = "#349800",
                C_006634 = "#006634",
                C_666666 = "#666666",
                C_999999 = "#999999",
                C_E6E6E6 = "#e6e6e6",
                C_FFFFCD = "#ffffcd",
                C_99FFFF = "#99ffff",
                C_CCFF9A = "#ccff9a",
            }
            interface Label {
                color?: esi.character.mail.Color;
                label_id?: number;
                name?: string;
                unread_count?: number;
            }
            /**
             * This is the response type for the route, [`GET /v3/characters/{character_id}/mail/labels/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_labels).
             */
            interface Labels {
                labels?: esi.character.mail.Label[];
                total_unread_count?: number;
            }
            interface List {
                /**
                 * Mailing list ID.
                 */
                mailing_list_id: number;
                name: string;
            }
            /**
             * This is the response type for the route, [`GET /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_mail_id).
             */
            interface Mail {
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
            interface MailHeader {
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
             * This type is a parameter for the route, [`PUT /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/put_characters_character_id_mail_mail_id).
             */
            interface MailUpdate {
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
             * This type is a parameter for the route, [`POST /v2/characters/{character_id}/mail/labels/`](https://esi.evetech.net//#!/Mail/post_characters_character_id_mail_labels).
             */
            interface NewLabel {
                color?: esi.character.mail.Color;
                name: string;
            }
            /**
             * This type is a parameter for the route, [`POST /v1/characters/{character_id}/mail/`](https://esi.evetech.net//#!/Mail/post_characters_character_id_mail).
             */
            interface NewMail {
                approved_cost?: number;
                body: string;
                recipients: esi.character.mail.Recipient[];
                subject: string;
            }
            /**
             * This type is a parameter for the route, [`POST /v1/ui/openwindow/newmail/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_newmail).
             */
            interface NewMailWindow {
                body: string;
                recipients: number[];
                subject: string;
                to_corp_or_alliance_id?: number;
                /**
                 * Corporations, alliances and mailing lists are all types of mailing groups. You may only send to one mailing group, at a time, so you may fill out either this field or the to_corp_or_alliance_ids field.
                 */
                to_mailing_list_id?: number;
            }
            interface Recipient {
                recipient_id: number;
                recipient_type: esi.character.mail.RecipientType;
            }
            const enum RecipientType {
                ALLIANCE = "alliance",
                CHARACTER = "character",
                CORPORATION = "corporation",
                MAILING_LIST = "mailing_list",
            }
        }
        namespace planetaryinteraction {
            interface ExtractorHead {
                head_id: number;
                latitude: number;
                longitude: number;
            }
            interface Link {
                destination_pin_id: number;
                link_level: number;
                source_pin_id: number;
            }
            interface Pin {
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
             * This is the response type for the route, [`GET /v2/characters/{character_id}/planets/{planet_id}/`](https://esi.evetech.net//#!/Planetary Interaction/get_characters_character_id_planets_planet_id).
             */
            interface Planet {
                links: esi.character.planetaryinteraction.Link[];
                pins: esi.character.planetaryinteraction.Pin[];
                routes: esi.character.planetaryinteraction.Route[];
            }
            interface PlanetSummary {
                last_update: string;
                num_pins: number;
                owner_id: number;
                planet_id: number;
                planet_type: esi.character.planetaryinteraction.PlanetType;
                solar_system_id: number;
                upgrade_level: number;
            }
            const enum PlanetType {
                TEMPERATE = "temperate",
                BARREN = "barren",
                OCEANIC = "oceanic",
                ICE = "ice",
                GAS = "gas",
                LAVA = "lava",
                STORM = "storm",
                PLASMA = "plasma",
            }
            interface Route {
                content_type_id: number;
                destination_pin_id: number;
                quantity: number;
                route_id: number;
                source_pin_id: number;
                waypoints?: esi.character.planetaryinteraction.Waypoint[];
            }
            interface Waypoint {
                order: number;
                pin_id: number;
            }
        }
        interface Affiliation {
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
        interface AgentResearch {
            agent_id: number;
            points_per_day: number;
            remainder_points: number;
            skill_type_id: number;
            started_at: string;
        }
        interface Asset {
            is_singleton: boolean;
            item_id: number;
            location_flag: esi.character.AssetLocation;
            location_id: number;
            location_type: "station" | "solar_system" | "other";
            quantity?: number;
            type_id: number;
        }
        const enum AssetLocation {
            AUTO_FIT = "AutoFit",
            CARGO = "Cargo",
            CORPSE_BAY = "CorpseBay",
            DRONE_BAY = "DroneBay",
            FLEET_HANGAR = "FleetHangar",
            DELIVERIES = "Deliveries",
            HIDDEN_MODIFIERS = "HiddenModifiers",
            HANGAR = "Hangar",
            HANGAR_ALL = "HangarAll",
            LO_SLOT_0 = "LoSlot0",
            LO_SLOT_1 = "LoSlot1",
            LO_SLOT_2 = "LoSlot2",
            LO_SLOT_3 = "LoSlot3",
            LO_SLOT_4 = "LoSlot4",
            LO_SLOT_5 = "LoSlot5",
            LO_SLOT_6 = "LoSlot6",
            LO_SLOT_7 = "LoSlot7",
            MED_SLOT_0 = "MedSlot0",
            MED_SLOT_1 = "MedSlot1",
            MED_SLOT_2 = "MedSlot2",
            MED_SLOT_3 = "MedSlot3",
            MED_SLOT_4 = "MedSlot4",
            MED_SLOT_5 = "MedSlot5",
            MED_SLOT_6 = "MedSlot6",
            MED_SLOT_7 = "MedSlot7",
            HI_SLOT_0 = "HiSlot0",
            HI_SLOT_1 = "HiSlot1",
            HI_SLOT_2 = "HiSlot2",
            HI_SLOT_3 = "HiSlot3",
            HI_SLOT_4 = "HiSlot4",
            HI_SLOT_5 = "HiSlot5",
            HI_SLOT_6 = "HiSlot6",
            HI_SLOT_7 = "HiSlot7",
            ASSET_SAFETY = "AssetSafety",
            LOCKED = "Locked",
            UNLOCKED = "Unlocked",
            IMPLANT = "Implant",
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
            SPECIALIZED_FUEL_BAY = "SpecializedFuelBay",
            SPECIALIZED_ORE_HOLD = "SpecializedOreHold",
            SPECIALIZED_GAS_HOLD = "SpecializedGasHold",
            SPECIALIZED_MINERAL_HOLD = "SpecializedMineralHold",
            SPECIALIZED_SALVAGE_HOLD = "SpecializedSalvageHold",
            SPECIALIZED_SHIP_HOLD = "SpecializedShipHold",
            SPECIALIZED_SMALL_SHIP_HOLD = "SpecializedSmallShipHold",
            SPECIALIZED_MEDIUM_SHIP_HOLD = "SpecializedMediumShipHold",
            SPECIALIZED_LARGE_SHIP_HOLD = "SpecializedLargeShipHold",
            SPECIALIZED_INDUSTRIAL_SHIP_HOLD = "SpecializedIndustrialShipHold",
            SPECIALIZED_AMMO_HOLD = "SpecializedAmmoHold",
            SPECIALIZED_COMMAND_CENTER_HOLD = "SpecializedCommandCenterHold",
            SPECIALIZED_PLANETARY_COMMODITIES_HOLD = "SpecializedPlanetaryCommoditiesHold",
            SPECIALIZED_MATERIAL_BAY = "SpecializedMaterialBay",
            SUB_SYSTEM_SLOT_0 = "SubSystemSlot0",
            SUB_SYSTEM_SLOT_1 = "SubSystemSlot1",
            SUB_SYSTEM_SLOT_2 = "SubSystemSlot2",
            SUB_SYSTEM_SLOT_3 = "SubSystemSlot3",
            SUB_SYSTEM_SLOT_4 = "SubSystemSlot4",
            SUB_SYSTEM_SLOT_5 = "SubSystemSlot5",
            SUB_SYSTEM_SLOT_6 = "SubSystemSlot6",
            SUB_SYSTEM_SLOT_7 = "SubSystemSlot7",
            FIGHTER_BAY = "FighterBay",
            FIGHTER_TUBE_0 = "FighterTube0",
            FIGHTER_TUBE_1 = "FighterTube1",
            FIGHTER_TUBE_2 = "FighterTube2",
            FIGHTER_TUBE_3 = "FighterTube3",
            FIGHTER_TUBE_4 = "FighterTube4",
            MODULE = "Module",
            WARDROBE = "Wardrobe",
        }
        interface Blueprint {
            /**
             * Unique ID for this item. The ID of an item is stable if that item is not repackaged, stacked, detached from a stack, assembled, or otherwise altered. If an item is changed in one of these ways, then the ID will also change (see notes below).
             */
            item_id: number;
            location_flag: esi.character.BlueprintLocation;
            /**
             * References a solar system, station or itemID if this blueprint is located within a container. If an itemID the Character
             *
             * - AssetList API must be queried to find the container using the itemID, from which the correct location of the Blueprint can be derived.
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
         * Indicates something about this item's storage location. The flag is used to differentiate between hangar divisions, drone bay, fitting location, and similar.
         */
        const enum BlueprintLocation {
            AUTO_FIT = "AutoFit",
            CARGO = "Cargo",
            CORPSE_BAY = "CorpseBay",
            DRONE_BAY = "DroneBay",
            FLEET_HANGAR = "FleetHangar",
            DELIVERIES = "Deliveries",
            HIDDEN_MODIFIERS = "HiddenModifiers",
            HANGAR = "Hangar",
            HANGAR_ALL = "HangarAll",
            LO_SLOT_0 = "LoSlot0",
            LO_SLOT_1 = "LoSlot1",
            LO_SLOT_2 = "LoSlot2",
            LO_SLOT_3 = "LoSlot3",
            LO_SLOT_4 = "LoSlot4",
            LO_SLOT_5 = "LoSlot5",
            LO_SLOT_6 = "LoSlot6",
            LO_SLOT_7 = "LoSlot7",
            MED_SLOT_0 = "MedSlot0",
            MED_SLOT_1 = "MedSlot1",
            MED_SLOT_2 = "MedSlot2",
            MED_SLOT_3 = "MedSlot3",
            MED_SLOT_4 = "MedSlot4",
            MED_SLOT_5 = "MedSlot5",
            MED_SLOT_6 = "MedSlot6",
            MED_SLOT_7 = "MedSlot7",
            HI_SLOT_0 = "HiSlot0",
            HI_SLOT_1 = "HiSlot1",
            HI_SLOT_2 = "HiSlot2",
            HI_SLOT_3 = "HiSlot3",
            HI_SLOT_4 = "HiSlot4",
            HI_SLOT_5 = "HiSlot5",
            HI_SLOT_6 = "HiSlot6",
            HI_SLOT_7 = "HiSlot7",
            ASSET_SAFETY = "AssetSafety",
            LOCKED = "Locked",
            UNLOCKED = "Unlocked",
            IMPLANT = "Implant",
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
            SPECIALIZED_FUEL_BAY = "SpecializedFuelBay",
            SPECIALIZED_ORE_HOLD = "SpecializedOreHold",
            SPECIALIZED_GAS_HOLD = "SpecializedGasHold",
            SPECIALIZED_MINERAL_HOLD = "SpecializedMineralHold",
            SPECIALIZED_SALVAGE_HOLD = "SpecializedSalvageHold",
            SPECIALIZED_SHIP_HOLD = "SpecializedShipHold",
            SPECIALIZED_SMALL_SHIP_HOLD = "SpecializedSmallShipHold",
            SPECIALIZED_MEDIUM_SHIP_HOLD = "SpecializedMediumShipHold",
            SPECIALIZED_LARGE_SHIP_HOLD = "SpecializedLargeShipHold",
            SPECIALIZED_INDUSTRIAL_SHIP_HOLD = "SpecializedIndustrialShipHold",
            SPECIALIZED_AMMO_HOLD = "SpecializedAmmoHold",
            SPECIALIZED_COMMAND_CENTER_HOLD = "SpecializedCommandCenterHold",
            SPECIALIZED_PLANETARY_COMMODITIES_HOLD = "SpecializedPlanetaryCommoditiesHold",
            SPECIALIZED_MATERIAL_BAY = "SpecializedMaterialBay",
            SUB_SYSTEM_SLOT_0 = "SubSystemSlot0",
            SUB_SYSTEM_SLOT_1 = "SubSystemSlot1",
            SUB_SYSTEM_SLOT_2 = "SubSystemSlot2",
            SUB_SYSTEM_SLOT_3 = "SubSystemSlot3",
            SUB_SYSTEM_SLOT_4 = "SubSystemSlot4",
            SUB_SYSTEM_SLOT_5 = "SubSystemSlot5",
            SUB_SYSTEM_SLOT_6 = "SubSystemSlot6",
            SUB_SYSTEM_SLOT_7 = "SubSystemSlot7",
            FIGHTER_BAY = "FighterBay",
            FIGHTER_TUBE_0 = "FighterTube0",
            FIGHTER_TUBE_1 = "FighterTube1",
            FIGHTER_TUBE_2 = "FighterTube2",
            FIGHTER_TUBE_3 = "FighterTube3",
            FIGHTER_TUBE_4 = "FighterTube4",
            MODULE = "Module",
        }
        interface Bookmark {
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
        interface BookmarksFolder {
            folder_id?: number;
            name?: string;
            owner_id?: number;
        }
        /**
         * This is the response type for the route, [`GET /v4/characters/{character_id}/`](https://esi.evetech.net//#!/Character/get_characters_character_id).
         */
        interface Character {
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
         * This is the response type for the route, [`GET /v2/characters/{character_id}/clones/`](https://esi.evetech.net//#!/Clones/get_characters_character_id_clones).
         */
        interface Clones {
            home_location?: {
                location_id?: number;
                location_type?: "station" | "structure";
            };
            jump_clones: esi.character.JumpClone[];
            last_jump_date?: string;
        }
        interface Contact {
            contact_id: number;
            contact_type: esi.character.ContactType;
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
        interface ContactLabel {
            label_id: number;
            label_name: string;
        }
        const enum ContactType {
            CHARACTER = "character",
            CORPORATION = "corporation",
            ALLIANCE = "alliance",
            FACTION = "faction",
        }
        interface CorporationHistory {
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
         * This type is a parameter for the route, [`POST /v3/characters/{character_id}/cspa/`](https://esi.evetech.net//#!/Character/post_characters_character_id_cspa).
         */
        interface CSPACharacters {
            characters: number[];
        }
        /**
         * This is the response type for the route, [`POST /v3/characters/{character_id}/cspa/`](https://esi.evetech.net//#!/Character/post_characters_character_id_cspa).
         */
        interface CSPACost {
            cost?: number;
        }
        interface Graphic {
            color?: number;
            graphic: string;
            layer: number;
            part: number;
        }
        interface IndustryJob {
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
        const enum JobStatus {
            ACTIVE = "active",
            PAUSED = "paused",
            READY = "ready",
            DELIVERED = "delivered",
            CANCELLED = "cancelled",
            REVERTED = "reverted",
        }
        interface JumpClone {
            implants?: number[];
            location_id?: number;
            location_type?: "station" | "structure";
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/location/`](https://esi.evetech.net//#!/Location/get_characters_character_id_location).
         */
        interface Location {
            solar_system_id: number;
            station_id?: number;
            structure_id?: number;
        }
        interface LoyaltyPoints {
            corporation_id: number;
            loyalty_points: number;
        }
        interface Medal {
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
        interface Name {
            character_id: number;
            character_name: string;
        }
        interface Opportunity {
            completed_at: string;
            task_id: number;
        }
        interface Order {
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
        const enum OrderState {
            OPEN = "open",
            CLOSED = "closed",
            EXPIRED = "expired",
            CANCELLED = "cancelled",
            PENDING = "pending",
            CHARACTER_DELETED = "character_deleted",
        }
        /**
         * This is the response type for the route, [`GET /v2/characters/{character_id}/portrait/`](https://esi.evetech.net//#!/Character/get_characters_character_id_portrait).
         */
        interface Portrait {
            px128x128?: string;
            px256x256?: string;
            px512x512?: string;
            px64x64?: string;
        }
        /**
         * This is the response type for the route, [`GET /v2/characters/{character_id}/search/`](https://esi.evetech.net//#!/Search/get_characters_character_id_search).
         */
        interface Search {
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
        const enum SearchCategory {
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
            WORMHOLE = "wormhole",
        }
        /**
         * This is the response type for the route, [`GET /v1/characters/{character_id}/ship/`](https://esi.evetech.net//#!/Location/get_characters_character_id_ship).
         */
        interface Ship {
            /**
             * Item id's are unique to a ship and persist until it is repackaged. This value can be used to track repeated uses of a ship, or detect when a pilot changes into a different instance of the same ship type.
             */
            ship_item_id: number;
            ship_name: string;
            ship_type_id: number;
        }
        interface Skill {
            current_skill_level?: number;
            skill_id?: number;
            skillpoints_in_skill?: number;
        }
        interface Skillqueue {
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
         * This is the response type for the route, [`GET /v3/characters/{character_id}/skills/`](https://esi.evetech.net//#!/Skills/get_characters_character_id_skills).
         */
        interface Skills {
            skills?: esi.character.Skill[];
            total_sp?: number;
        }
        interface Standing {
            from_id: number;
            from_type: "agent" | "npc_corp" | "faction";
            standing: number;
        }
        interface Wallet {
            /**
             * Wallet's balance in ISK hundredths.
             */
            balance?: number;
            wallet_id?: number;
        }
        interface WalletJournal {
            /**
             * Transaction amount. Positive when value transferred to the first party. Negative otherwise.
             */
            amount?: number;
            argument_name?: string;
            argument_value?: number;
            /**
             * Wallet balance after transaction occurred.
             */
            balance?: number;
            /**
             * Date and time of transaction.
             */
            date: string;
            first_party_id?: number;
            first_party_type?: esi.character.ContactType;
            reason?: string;
            /**
             * Unique journal reference ID.
             */
            ref_id: number;
            ref_type_id: number;
            second_party_id?: number;
            second_party_type?: esi.character.ContactType;
            /**
             * Tax amount received for tax related transactions.
             */
            tax_amount?: number;
            /**
             * For tax related transactions, gives the corporation ID of the entity receiving the tax.
             */
            tax_reciever_id?: number;
        }
    }
    namespace corporation {
        interface AllianceHistory {
            alliance?: {
                alliance_id: number;
                /**
                 * True if the alliance has been deleted.
                 */
                is_deleted: boolean;
            };
            /**
             * An incrementing ID that can be used to canonically establish order of records in cases where dates may be ambiguous.
             */
            record_id: number;
            start_date: string;
        }
        /**
         * This is the response type for the route, [`GET /v3/corporations/{corporation_id}/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id).
         */
        interface Corporation {
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
        const enum Faction {
            MINMATAR = "Minmatar",
            GALLENTE = "Gallente",
            CALDARI = "Caldari",
            AMARR = "Amarr",
        }
        /**
         * This is the response type for the route, [`GET /v1/corporations/{corporation_id}/icons/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_icons).
         */
        interface Icons {
            px128x128?: string;
            px256x256?: string;
            px64x64?: string;
        }
        interface LoyaltyStoreOffer {
            isk_cost: number;
            lp_cost: number;
            offer_id: number;
            quantity: number;
            required_items: esi.corporation.LoyaltyStoreRequirement[];
            type_id: number;
        }
        interface LoyaltyStoreRequirement {
            quantity: number;
            type_id: number;
        }
        interface Member {
            character_id: number;
        }
        interface MemberRoles {
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
        interface Name {
            corporation_id: number;
            corporation_name: string;
        }
        interface Service {
            name: string;
            state: "online" | "offline" | "cleanup";
        }
        interface Structure {
            /**
             * ID of the corporation that owns the structure.
             */
            corporation_id: number;
            /**
             * This week's vulnerability windows, Monday is day 0.
             */
            current_vul: esi.corporation.VulnerabilitySchedule[];
            /**
             * Date on which the structure will run out of fuel.
             */
            fuel_expires?: string;
            /**
             * Next week's vulnerability windows, Monday is day 0.
             */
            next_vul: esi.corporation.VulnerabilitySchedule[];
            /**
             * The id of the ACL profile for this citadel.
             */
            profile_id: number;
            /**
             * Contains a list of service upgrades, and their state.
             */
            services?: esi.corporation.Service[];
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
        interface VulnerabilitySchedule {
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
    namespace dogma {
        /**
         * This is the response type for the route, [`GET /v1/dogma/attributes/{attribute_id}/`](https://esi.evetech.net//#!/Dogma/get_dogma_attributes_attribute_id).
         */
        interface Attribute {
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
         * This is the response type for the route, [`GET /v1/dogma/effects/{effect_id}/`](https://esi.evetech.net//#!/Dogma/get_dogma_effects_effect_id).
         */
        interface Effect {
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
        interface Modifier {
            domain: string;
            func: string;
            modified_attribute_id: number;
            modifying_attribute_id: number;
            operator: number;
        }
    }
    namespace fleet {
        /**
         * This is the response type for the route, [`GET /v1/fleets/{fleet_id}/`](https://esi.evetech.net//#!/Fleets/get_fleets_fleet_id).
         */
        interface Fleet {
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
         * This type is a parameter for the route, [`POST /v1/fleets/{fleet_id}/members/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_members).
         */
        interface Invitation {
            /**
             * The character you want to invite.
             */
            character_id: number;
            /**
             * - If a character is invited with the `fleet_commander` role, neither `wing_id` or `squad_id` should be specified.
             * - If a character is invited with the `wing_commander` role, only `wing_id` should be specified.
             * - If a character is invited with the `squad_commander` role, both `wing_id` and `squad_id` should be specified.
             * - If a character is invited with the `squad_member` role, `wing_id` and `squad_id` should either both be specified or not specified at all. If they aren’t specified, the invited character will join any squad with available positions.
             */
            role: esi.fleet.Role;
            squad_id?: number;
            wing_id?: number;
        }
        interface Member {
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
         * This type is a parameter for the route, [`PUT /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id_members_member_id).
         */
        interface Movement {
            /**
             * - If a character is moved to the `fleet_commander` role, neither `wing_id` or `squad_id` should be specified.
             * - If a character is moved to the `wing_commander` role, only `wing_id` should be specified.
             * - If a character is moved to the `squad_commander` role, both `wing_id` and `squad_id` should be specified.
             * - If a character is moved to the `squad_member` role, both `wing_id` and `squad_id` should be specified.
             */
            role: esi.fleet.Role;
            squad_id?: number;
            wing_id?: number;
        }
        interface Naming {
            name: string;
        }
        /**
         * This type is a parameter for the route, [`PUT /v1/fleets/{fleet_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id).
         */
        interface NewSettings {
            /**
             * Should free-move be enabled in the fleet.
             */
            is_free_move?: boolean;
            /**
             * New fleet MOTD in CCP flavoured HTML.
             */
            motd?: string;
        }
        const enum Role {
            FLEET_COMMANDER = "fleet_commander",
            WING_COMMANDER = "wing_commander",
            SQUAD_COMMANDER = "squad_commander",
            SQUAD_MEMBER = "squad_member",
        }
        interface Squad {
            id: number;
            name: string;
        }
        /**
         * This is the response type for the route, [`POST /v1/fleets/{fleet_id}/wings/{wing_id}/squads/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads).
         */
        interface SquadID {
            /**
             * The squad_id of the newly created squad.
             */
            squad_id: number;
        }
        interface Wing {
            id: number;
            name: string;
            squads: esi.fleet.Squad[];
        }
        /**
         * This is the response type for the route, [`POST /v1/fleets/{fleet_id}/wings/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_wings).
         */
        interface WingID {
            /**
             * The wing_id of the newly created wing.
             */
            wing_id: number;
        }
    }
    namespace industry {
        const enum Activity {
            NONE = "none",
            MANUFACTURING = "manufacturing",
            RESEARCHING_TECHNOLOGY = "researching_technology",
            RESEARCHING_TIME_EFFICIENCY = "researching_time_efficiency",
            RESEARCHING_MATERIAL_EFFICIENCY = "researching_material_efficiency",
            COPYING = "copying",
            DUPLICATING = "duplicating",
            INVENTION = "invention",
            REVERSE_ENGINEERING = "reverse_engineering",
        }
        interface CostIndex {
            activity: esi.industry.Activity;
            cost_index: number;
        }
        interface Facility {
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
        interface System {
            cost_indices: esi.industry.CostIndex[];
            solar_system_id: number;
        }
    }
    namespace killmail {
        interface Attacker {
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
        interface Charge {
            flag: number;
            item_type_id: number;
            quantity_destroyed?: number;
            quantity_dropped?: number;
            singleton: number;
        }
        interface Item {
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
         * This is the response type for the route, [`GET /v1/killmails/{killmail_id}/{killmail_hash}/`](https://esi.evetech.net//#!/Killmails/get_killmails_killmail_id_killmail_hash).
         */
        interface Killmail {
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
        interface KillmailLink {
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
    namespace market {
        interface History {
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
         * This is the response type for the route, [`GET /v1/markets/groups/{market_group_id}/`](https://esi.evetech.net//#!/Market/get_markets_groups_market_group_id).
         */
        interface MarketGroup {
            description: string;
            market_group_id: number;
            name: string;
            parent_group_id?: number;
            types: number[];
        }
        interface Order {
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
        interface Price {
            adjusted_price?: number;
            average_price?: number;
            type_id: number;
        }
    }
    namespace sovereignty {
        interface Campaign {
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
        const enum EventType {
            TCU_DEFENSE = "tcu_defense",
            IHUB_DEFENSE = "ihub_defense",
            STATION_DEFENSE = "station_defense",
            STATION_FREEPORT = "station_freeport",
        }
        interface Map {
            alliance_id?: number;
            corporation_id?: number;
            faction_id?: number;
            system_id: number;
        }
        interface Participant {
            alliance_id: number;
            score: number;
        }
        interface Structure {
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
    namespace universe {
        interface Bloodline {
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
         * This is the response type for the route, [`GET /v1/universe/categories/{category_id}/`](https://esi.evetech.net//#!/Universe/get_universe_categories_category_id).
         */
        interface Category {
            category_id: number;
            groups: number[];
            name: string;
            published: boolean;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/constellations/{constellation_id}/`](https://esi.evetech.net//#!/Universe/get_universe_constellations_constellation_id).
         */
        interface Constellation {
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
        interface DogmaAttribute {
            attribute_id: number;
            value: number;
        }
        interface DogmaEffect {
            effect_id: number;
            is_default: boolean;
        }
        interface Faction {
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
         * This is the response type for the route, [`GET /v1/universe/graphics/{graphic_id}/`](https://esi.evetech.net//#!/Universe/get_universe_graphics_graphic_id).
         */
        interface Graphic {
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
         * This is the response type for the route, [`GET /v1/universe/groups/{group_id}/`](https://esi.evetech.net//#!/Universe/get_universe_groups_group_id).
         */
        interface Group {
            category_id: number;
            group_id: number;
            name: string;
            published: boolean;
            types: number[];
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/moons/{moon_id}/`](https://esi.evetech.net//#!/Universe/get_universe_moons_moon_id).
         */
        interface Moon {
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
        interface Name {
            category: esi.universe.NameCategory;
            id: number;
            name: string;
        }
        const enum NameCategory {
            ALLIANCE = "alliance",
            CHARACTER = "character",
            CONSTELLATION = "constellation",
            CORPORATION = "corporation",
            INVENTORY_TYPE = "inventory_type",
            REGION = "region",
            SOLAR_SYSTEM = "solar_system",
            STATION = "station",
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/planets/{planet_id}/`](https://esi.evetech.net//#!/Universe/get_universe_planets_planet_id).
         */
        interface Planet {
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
        interface Race {
            /**
             * The alliance generally associated with this race.
             */
            alliance_id: number;
            description: string;
            name: string;
            race_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/regions/{region_id}/`](https://esi.evetech.net//#!/Universe/get_universe_regions_region_id).
         */
        interface Region {
            constellations: number[];
            description?: string;
            name: string;
            region_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/schematics/{schematic_id}/`](https://esi.evetech.net//#!/Planetary Interaction/get_universe_schematics_schematic_id).
         */
        interface Schematic {
            /**
             * Time in seconds to process a run.
             */
            cycle_time: number;
            schematic_name: string;
        }
        const enum Service {
            BOUNTY_MISSIONS = "bounty-missions",
            ASSASINATION_MISSIONS = "assasination-missions",
            COURIER_MISSIONS = "courier-missions",
            INTERBUS = "interbus",
            REPROCESSING_PLANT = "reprocessing-plant",
            REFINERY = "refinery",
            MARKET = "market",
            BLACK_MARKET = "black-market",
            STOCK_EXCHANGE = "stock-exchange",
            CLONING = "cloning",
            SURGERY = "surgery",
            DNA_THERAPY = "dna-therapy",
            REPAIR_FACILITIES = "repair-facilities",
            FACTORY = "factory",
            LABRATORY = "labratory",
            GAMBLING = "gambling",
            FITTING = "fitting",
            PAINTSHOP = "paintshop",
            NEWS = "news",
            STORAGE = "storage",
            INSURANCE = "insurance",
            DOCKING = "docking",
            OFFICE_RENTAL = "office-rental",
            JUMP_CLONE_FACILITY = "jump-clone-facility",
            LOYALTY_POINT_STORE = "loyalty-point-store",
            NAVY_OFFICES = "navy-offices",
            SECURITY_OFFICES = "security-offices",
        }
        /**
         * This is the response type for the route, [`GET /v1/universe/stargates/{stargate_id}/`](https://esi.evetech.net//#!/Universe/get_universe_stargates_stargate_id).
         */
        interface Stargate {
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
         * This is the response type for the route, [`GET /v2/universe/stations/{station_id}/`](https://esi.evetech.net//#!/Universe/get_universe_stations_station_id).
         */
        interface Station {
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
         * This is the response type for the route, [`GET /v1/universe/structures/{structure_id}/`](https://esi.evetech.net//#!/Universe/get_universe_structures_structure_id).
         */
        interface Structure {
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
         * This is the response type for the route, [`GET /v2/universe/systems/{system_id}/`](https://esi.evetech.net//#!/Universe/get_universe_systems_system_id).
         */
        interface System {
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
            stargates: number[];
            system_id: number;
        }
        interface SystemJumps {
            ship_jumps: number;
            system_id: number;
        }
        interface SystemKills {
            /**
             * Number of NPC ships killed in this system.
             */
            npc_kills: number;
            /**
             * Number of pods killed in this system.
             */
            pod_kills: number;
            /**
             * Number of player and NPC ships killed in this system.
             */
            ship_kills: number;
            system_id: number;
        }
        interface SystemPlanet {
            moons?: number[];
            planet_id: number;
        }
        /**
         * This is the response type for the route, [`GET /v2/universe/types/{type_id}/`](https://esi.evetech.net//#!/Universe/get_universe_types_type_id).
         */
        interface Type {
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
    interface Ally {
        /**
         * Alliance ID if and only if this ally is an alliance.
         */
        alliance_id?: number;
        /**
         * Corporation ID if and only if this ally is a corporation.
         */
        corporation_id?: number;
    }
    interface Incursion {
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
    interface InsuranceLevel {
        cost: number;
        /**
         * Localized insurance level.
         */
        name: string;
        payout: number;
    }
    interface InsurancePrice {
        /**
         * A list of a available insurance levels for this ship type.
         */
        levels: esi.InsuranceLevel[];
        type_id: number;
    }
    const enum Language {
        DE = "de",
        EN_US = "en-us",
        FR = "fr",
        JA = "ja",
        RU = "ru",
        ZH = "zh",
    }
    /**
     * This is the response type for the route, [`GET /v1/opportunities/groups/{group_id}/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_groups_group_id).
     */
    interface OpportunitiesGroup {
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
     * This is the response type for the route, [`GET /v1/opportunities/tasks/{task_id}/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_tasks_task_id).
     */
    interface OpportunitiesTask {
        description: string;
        name: string;
        notification: string;
        task_id: number;
    }
    /**
     * Valid order range, numbers are ranges in jumps.
     */
    const enum OrderRange {
        STATION = "station",
        REGION = "region",
        SOLARSYSTEM = "solarsystem",
        V_1 = "1",
        V_2 = "2",
        V_3 = "3",
        V_4 = "4",
        V_5 = "5",
        V_10 = "10",
        V_20 = "20",
        V_30 = "30",
        V_40 = "40",
    }
    const enum Role {
        DIRECTOR = "Director",
        PERSONNEL_MANAGER = "Personnel_Manager",
        ACCOUNTANT = "Accountant",
        SECURITY_OFFICER = "Security_Officer",
        FACTORY_MANAGER = "Factory_Manager",
        STATION_MANAGER = "Station_Manager",
        AUDITOR = "Auditor",
        HANGAR_TAKE_1 = "Hangar_Take_1",
        HANGAR_TAKE_2 = "Hangar_Take_2",
        HANGAR_TAKE_3 = "Hangar_Take_3",
        HANGAR_TAKE_4 = "Hangar_Take_4",
        HANGAR_TAKE_5 = "Hangar_Take_5",
        HANGAR_TAKE_6 = "Hangar_Take_6",
        HANGAR_TAKE_7 = "Hangar_Take_7",
        HANGAR_QUERY_1 = "Hangar_Query_1",
        HANGAR_QUERY_2 = "Hangar_Query_2",
        HANGAR_QUERY_3 = "Hangar_Query_3",
        HANGAR_QUERY_4 = "Hangar_Query_4",
        HANGAR_QUERY_5 = "Hangar_Query_5",
        HANGAR_QUERY_6 = "Hangar_Query_6",
        HANGAR_QUERY_7 = "Hangar_Query_7",
        ACCOUNT_TAKE_1 = "Account_Take_1",
        ACCOUNT_TAKE_2 = "Account_Take_2",
        ACCOUNT_TAKE_3 = "Account_Take_3",
        ACCOUNT_TAKE_4 = "Account_Take_4",
        ACCOUNT_TAKE_5 = "Account_Take_5",
        ACCOUNT_TAKE_6 = "Account_Take_6",
        ACCOUNT_TAKE_7 = "Account_Take_7",
        DIPLOMAT = "Diplomat",
        CONFIG_EQUIPMENT = "Config_Equipment",
        CONTAINER_TAKE_1 = "Container_Take_1",
        CONTAINER_TAKE_2 = "Container_Take_2",
        CONTAINER_TAKE_3 = "Container_Take_3",
        CONTAINER_TAKE_4 = "Container_Take_4",
        CONTAINER_TAKE_5 = "Container_Take_5",
        CONTAINER_TAKE_6 = "Container_Take_6",
        CONTAINER_TAKE_7 = "Container_Take_7",
        RENT_OFFICE = "Rent_Office",
        RENT_FACTORY_FACILITY = "Rent_Factory_Facility",
        RENT_RESEARCH_FACILITY = "Rent_Research_Facility",
        JUNIOR_ACCOUNTANT = "Junior_Accountant",
        CONFIG_STARBASE_EQUIPMENT = "Config_Starbase_Equipment",
        TRADER = "Trader",
        COMMUNICATIONS_OFFICER = "Communications_Officer",
        CONTRACT_MANAGER = "Contract_Manager",
        STARBASE_DEFENSE_OPERATOR = "Starbase_Defense_Operator",
        STARBASE_FUEL_TECHNICIAN = "Starbase_Fuel_Technician",
        FITTING_MANAGER = "Fitting_Manager",
        TERRESTRIAL_COMBAT_OFFICER = "Terrestrial_Combat_Officer",
        TERRESTRIAL_LOGISTICS_OFFICER = "Terrestrial_Logistics_Officer",
    }
    /**
     * This is the response type for the route, [`GET /v1/search/`](https://esi.evetech.net//#!/Search/get_search).
     */
    interface Search {
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
    const enum SearchCategory {
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
        WORMHOLE = "wormhole",
    }
    /**
     * This is the response type for the route, [`GET /v1/status/`](https://esi.evetech.net//#!/Status/get_status).
     */
    interface Status {
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
     * This is the response type for the route, [`GET /v1/wars/{war_id}/`](https://esi.evetech.net//#!/Wars/get_wars_war_id).
     */
    interface War {
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/`](https://esi.evetech.net//#!/Alliance/get_alliances). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/alliances/{alliance_id}/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_alliance_id: {
        path: {
            alliance_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/{alliance_id}/corporations/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id_corporations). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_alliance_id_corporations: {
        path: {
            alliance_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/{alliance_id}/icons/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id_icons). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_alliance_id_icons: {
        path: {
            alliance_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/alliances/names/`](https://esi.evetech.net//#!/Alliance/get_alliances_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_alliances_names: {
        query: {
            alliance_ids: number[];
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/assets/`](https://esi.evetech.net//#!/Assets/get_characters_character_id_assets). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_assets: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/bookmarks/`](https://esi.evetech.net//#!/Bookmarks/get_characters_character_id_bookmarks). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_bookmarks: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/bookmarks/folders/`](https://esi.evetech.net//#!/Bookmarks/get_characters_character_id_bookmarks_folders). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_bookmarks_folders: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/calendar/`](https://esi.evetech.net//#!/Calendar/get_characters_character_id_calendar). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.evetech.net//#!/Calendar/get_characters_character_id_calendar_event_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_calendar_event_id: {
        path: {
            event_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.evetech.net//#!/Calendar/put_characters_character_id_calendar_event_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_characters_character_id_calendar_event_id: {
        path: {
            event_id: number;
            character_id: number;
        };
        body: esi.character.calendar.Response;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v4/characters/{character_id}/`](https://esi.evetech.net//#!/Character/get_characters_character_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/agents_research/`](https://esi.evetech.net//#!/Character/get_characters_character_id_agents_research). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_agents_research: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/blueprints/`](https://esi.evetech.net//#!/Character/get_characters_character_id_blueprints). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_blueprints: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/chat_channels/`](https://esi.evetech.net//#!/Character/get_characters_character_id_chat_channels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_chat_channels: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/corporationhistory/`](https://esi.evetech.net//#!/Character/get_characters_character_id_corporationhistory). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_corporationhistory: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/medals/`](https://esi.evetech.net//#!/Character/get_characters_character_id_medals). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_medals: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/portrait/`](https://esi.evetech.net//#!/Character/get_characters_character_id_portrait). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_portrait: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/roles/`](https://esi.evetech.net//#!/Character/get_characters_character_id_roles). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_roles: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/standings/`](https://esi.evetech.net//#!/Character/get_characters_character_id_standings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_standings: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/names/`](https://esi.evetech.net//#!/Character/get_characters_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_names: {
        query: {
            character_ids: number[];
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/affiliation/`](https://esi.evetech.net//#!/Character/post_characters_affiliation). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_affiliation: {
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v3/characters/{character_id}/cspa/`](https://esi.evetech.net//#!/Character/post_characters_character_id_cspa). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_cspa: {
        path: {
            character_id: number;
        };
        body: esi.character.CSPACharacters;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/clones/`](https://esi.evetech.net//#!/Clones/get_characters_character_id_clones). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_clones: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/delete_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_contacts: {
        path: {
            character_id: number;
        };
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/get_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contacts/labels/`](https://esi.evetech.net//#!/Contacts/get_characters_character_id_contacts_labels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contacts_labels: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/post_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/put_characters_character_id_contacts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contracts/`](https://esi.evetech.net//#!/Contracts/get_characters_character_id_contracts). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contracts: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/bids/`](https://esi.evetech.net//#!/Contracts/get_characters_character_id_contracts_contract_id_bids). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contracts_contract_id_bids: {
        path: {
            contract_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/items/`](https://esi.evetech.net//#!/Contracts/get_characters_character_id_contracts_contract_id_items). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_contracts_contract_id_items: {
        path: {
            contract_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/corporations/{corporation_id}/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/alliancehistory/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_alliancehistory). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_alliancehistory: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/icons/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_icons). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_icons: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/corporations/{corporation_id}/members/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_members). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_members: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/roles/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_roles). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_corporation_id_roles: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/{corporation_id}/structures/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_structures). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/names/`](https://esi.evetech.net//#!/Corporation/get_corporations_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_names: {
        query: {
            corporation_ids: number[];
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/corporations/npccorps/`](https://esi.evetech.net//#!/Corporation/get_corporations_npccorps). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_corporations_npccorps: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/corporations/{corporation_id}/structures/{structure_id}/`](https://esi.evetech.net//#!/Corporation/put_corporations_corporation_id_structures_structure_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_corporations_corporation_id_structures_structure_id: {
        path: {
            structure_id: number;
            corporation_id: number;
        };
        body: esi.corporation.VulnerabilitySchedule[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/dogma/attributes/`](https://esi.evetech.net//#!/Dogma/get_dogma_attributes). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_attributes: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/dogma/attributes/{attribute_id}/`](https://esi.evetech.net//#!/Dogma/get_dogma_attributes_attribute_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_attributes_attribute_id: {
        path: {
            attribute_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/dogma/effects/`](https://esi.evetech.net//#!/Dogma/get_dogma_effects). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_effects: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/dogma/effects/{effect_id}/`](https://esi.evetech.net//#!/Dogma/get_dogma_effects_effect_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_dogma_effects_effect_id: {
        path: {
            effect_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/fittings/{fitting_id}/`](https://esi.evetech.net//#!/Fittings/delete_characters_character_id_fittings_fitting_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_fittings_fitting_id: {
        path: {
            fitting_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/fittings/`](https://esi.evetech.net//#!/Fittings/get_characters_character_id_fittings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_fittings: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/fittings/`](https://esi.evetech.net//#!/Fittings/post_characters_character_id_fittings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_fittings: {
        path: {
            character_id: number;
        };
        body?: esi.character.fitting.NewFitting;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.evetech.net//#!/Fleets/delete_fleets_fleet_id_members_member_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_fleets_fleet_id_members_member_id: {
        path: {
            fleet_id: number;
            member_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.evetech.net//#!/Fleets/delete_fleets_fleet_id_squads_squad_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_fleets_fleet_id_squads_squad_id: {
        path: {
            fleet_id: number;
            squad_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.evetech.net//#!/Fleets/delete_fleets_fleet_id_wings_wing_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_fleets_fleet_id_wings_wing_id: {
        path: {
            fleet_id: number;
            wing_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fleets/{fleet_id}/`](https://esi.evetech.net//#!/Fleets/get_fleets_fleet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fleets_fleet_id: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fleets/{fleet_id}/members/`](https://esi.evetech.net//#!/Fleets/get_fleets_fleet_id_members). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fleets_fleet_id_members: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/fleets/{fleet_id}/wings/`](https://esi.evetech.net//#!/Fleets/get_fleets_fleet_id_wings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_fleets_fleet_id_wings: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/fleets/{fleet_id}/members/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_members). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_fleets_fleet_id_members: {
        path: {
            fleet_id: number;
        };
        body: esi.fleet.Invitation;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/fleets/{fleet_id}/wings/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_wings). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_fleets_fleet_id_wings: {
        path: {
            fleet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/fleets/{fleet_id}/wings/{wing_id}/squads/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_fleets_fleet_id_wings_wing_id_squads: {
        path: {
            fleet_id: number;
            wing_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id: {
        path: {
            fleet_id: number;
        };
        body: esi.fleet.NewSettings;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id_members_member_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id_members_member_id: {
        path: {
            fleet_id: number;
            member_id: number;
        };
        body: esi.fleet.Movement;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id_squads_squad_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id_squads_squad_id: {
        path: {
            fleet_id: number;
            squad_id: number;
        };
        body: esi.fleet.Naming;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id_wings_wing_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_fleets_fleet_id_wings_wing_id: {
        path: {
            fleet_id: number;
            wing_id: number;
        };
        body: esi.fleet.Naming;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/incursions/`](https://esi.evetech.net//#!/Incursions/get_incursions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_incursions: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/industry/jobs/`](https://esi.evetech.net//#!/Industry/get_characters_character_id_industry_jobs). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/industry/facilities/`](https://esi.evetech.net//#!/Industry/get_industry_facilities). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_industry_facilities: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/industry/systems/`](https://esi.evetech.net//#!/Industry/get_industry_systems). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_industry_systems: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/insurance/prices/`](https://esi.evetech.net//#!/Insurance/get_insurance_prices). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_insurance_prices: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/killmails/recent/`](https://esi.evetech.net//#!/Killmails/get_characters_character_id_killmails_recent). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/killmails/{killmail_id}/{killmail_hash}/`](https://esi.evetech.net//#!/Killmails/get_killmails_killmail_id_killmail_hash). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_killmails_killmail_id_killmail_hash: {
        path: {
            killmail_hash: string;
            killmail_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/location/`](https://esi.evetech.net//#!/Location/get_characters_character_id_location). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_location: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/online/`](https://esi.evetech.net//#!/Location/get_characters_character_id_online). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_online: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/ship/`](https://esi.evetech.net//#!/Location/get_characters_character_id_ship). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_ship: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/loyalty/points/`](https://esi.evetech.net//#!/Loyalty/get_characters_character_id_loyalty_points). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_loyalty_points: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/loyalty/stores/{corporation_id}/offers/`](https://esi.evetech.net//#!/Loyalty/get_loyalty_stores_corporation_id_offers). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_loyalty_stores_corporation_id_offers: {
        path: {
            corporation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/mail/labels/{label_id}/`](https://esi.evetech.net//#!/Mail/delete_characters_character_id_mail_labels_label_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_mail_labels_label_id: {
        path: {
            label_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`DELETE /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/delete_characters_character_id_mail_mail_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    delete_characters_character_id_mail_mail_id: {
        path: {
            mail_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/mail/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/characters/{character_id}/mail/labels/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_labels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_mail_labels: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/mail/lists/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_lists). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_mail_lists: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_mail_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_mail_mail_id: {
        path: {
            mail_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/characters/{character_id}/mail/`](https://esi.evetech.net//#!/Mail/post_characters_character_id_mail). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_mail: {
        path: {
            character_id: number;
        };
        body: esi.character.mail.NewMail;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v2/characters/{character_id}/mail/labels/`](https://esi.evetech.net//#!/Mail/post_characters_character_id_mail_labels). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_characters_character_id_mail_labels: {
        path: {
            character_id: number;
        };
        body?: esi.character.mail.NewLabel;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`PUT /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/put_characters_character_id_mail_mail_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    put_characters_character_id_mail_mail_id: {
        path: {
            mail_id: number;
            character_id: number;
        };
        body: esi.character.mail.MailUpdate;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/orders/`](https://esi.evetech.net//#!/Market/get_characters_character_id_orders). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_orders: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/groups/`](https://esi.evetech.net//#!/Market/get_markets_groups). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_groups: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/groups/{market_group_id}/`](https://esi.evetech.net//#!/Market/get_markets_groups_market_group_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_groups_market_group_id: {
        path: {
            market_group_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/prices/`](https://esi.evetech.net//#!/Market/get_markets_prices). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_prices: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/{region_id}/history/`](https://esi.evetech.net//#!/Market/get_markets_region_id_history). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/{region_id}/orders/`](https://esi.evetech.net//#!/Market/get_markets_region_id_orders). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_markets_region_id_orders: {
        query: {
            order_type: "buy" | "sell" | "all";
            type_id?: number;
            page?: number;
        };
        path: {
            region_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/markets/structures/{structure_id}/`](https://esi.evetech.net//#!/Market/get_markets_structures_structure_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/opportunities/`](https://esi.evetech.net//#!/Opportunities/get_characters_character_id_opportunities). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_opportunities: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/groups/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_groups). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_groups: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/groups/{group_id}/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_groups_group_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_groups_group_id: {
        path: {
            group_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/tasks/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_tasks). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_tasks: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/opportunities/tasks/{task_id}/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_tasks_task_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_opportunities_tasks_task_id: {
        path: {
            task_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/planets/`](https://esi.evetech.net//#!/Planetary Interaction/get_characters_character_id_planets). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_planets: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/planets/{planet_id}/`](https://esi.evetech.net//#!/Planetary Interaction/get_characters_character_id_planets_planet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_planets_planet_id: {
        path: {
            planet_id: number;
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/schematics/{schematic_id}/`](https://esi.evetech.net//#!/Planetary Interaction/get_universe_schematics_schematic_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_schematics_schematic_id: {
        path: {
            schematic_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/route/{origin}/{destination}/`](https://esi.evetech.net//#!/Routes/get_route_origin_destination). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/search/`](https://esi.evetech.net//#!/Search/get_characters_character_id_search). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/search/`](https://esi.evetech.net//#!/Search/get_search). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_search: {
        query: {
            categories: esi.SearchCategory[];
            search: string;
            strict?: boolean;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/characters/{character_id}/skillqueue/`](https://esi.evetech.net//#!/Skills/get_characters_character_id_skillqueue). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_skillqueue: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v3/characters/{character_id}/skills/`](https://esi.evetech.net//#!/Skills/get_characters_character_id_skills). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_skills: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/sovereignty/campaigns/`](https://esi.evetech.net//#!/Sovereignty/get_sovereignty_campaigns). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_sovereignty_campaigns: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/sovereignty/map/`](https://esi.evetech.net//#!/Sovereignty/get_sovereignty_map). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_sovereignty_map: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/sovereignty/structures/`](https://esi.evetech.net//#!/Sovereignty/get_sovereignty_structures). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_sovereignty_structures: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/status/`](https://esi.evetech.net//#!/Status/get_status). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_status: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/bloodlines/`](https://esi.evetech.net//#!/Universe/get_universe_bloodlines). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_bloodlines: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/categories/`](https://esi.evetech.net//#!/Universe/get_universe_categories). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_categories: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/categories/{category_id}/`](https://esi.evetech.net//#!/Universe/get_universe_categories_category_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_categories_category_id: {
        path: {
            category_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/constellations/`](https://esi.evetech.net//#!/Universe/get_universe_constellations). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_constellations: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/constellations/{constellation_id}/`](https://esi.evetech.net//#!/Universe/get_universe_constellations_constellation_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_constellations_constellation_id: {
        path: {
            constellation_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/factions/`](https://esi.evetech.net//#!/Universe/get_universe_factions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_factions: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/graphics/`](https://esi.evetech.net//#!/Universe/get_universe_graphics). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_graphics: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/graphics/{graphic_id}/`](https://esi.evetech.net//#!/Universe/get_universe_graphics_graphic_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_graphics_graphic_id: {
        path: {
            graphic_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/groups/`](https://esi.evetech.net//#!/Universe/get_universe_groups). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_groups: {
        query: {
            page?: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/groups/{group_id}/`](https://esi.evetech.net//#!/Universe/get_universe_groups_group_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_groups_group_id: {
        path: {
            group_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/moons/{moon_id}/`](https://esi.evetech.net//#!/Universe/get_universe_moons_moon_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_moons_moon_id: {
        path: {
            moon_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/planets/{planet_id}/`](https://esi.evetech.net//#!/Universe/get_universe_planets_planet_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_planets_planet_id: {
        path: {
            planet_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/races/`](https://esi.evetech.net//#!/Universe/get_universe_races). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_races: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/regions/`](https://esi.evetech.net//#!/Universe/get_universe_regions). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_regions: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/regions/{region_id}/`](https://esi.evetech.net//#!/Universe/get_universe_regions_region_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_regions_region_id: {
        path: {
            region_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/stargates/{stargate_id}/`](https://esi.evetech.net//#!/Universe/get_universe_stargates_stargate_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_stargates_stargate_id: {
        path: {
            stargate_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/universe/stations/{station_id}/`](https://esi.evetech.net//#!/Universe/get_universe_stations_station_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_stations_station_id: {
        path: {
            station_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/structures/`](https://esi.evetech.net//#!/Universe/get_universe_structures). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_structures: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/structures/{structure_id}/`](https://esi.evetech.net//#!/Universe/get_universe_structures_structure_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_structures_structure_id: {
        path: {
            structure_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/system_jumps/`](https://esi.evetech.net//#!/Universe/get_universe_system_jumps). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_system_jumps: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/system_kills/`](https://esi.evetech.net//#!/Universe/get_universe_system_kills). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_system_kills: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/systems/`](https://esi.evetech.net//#!/Universe/get_universe_systems). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_systems: undefined;
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/universe/systems/{system_id}/`](https://esi.evetech.net//#!/Universe/get_universe_systems_system_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_systems_system_id: {
        path: {
            system_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/universe/types/`](https://esi.evetech.net//#!/Universe/get_universe_types). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_types: {
        query: {
            page?: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v2/universe/types/{type_id}/`](https://esi.evetech.net//#!/Universe/get_universe_types_type_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_universe_types_type_id: {
        path: {
            type_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v2/universe/names/`](https://esi.evetech.net//#!/Universe/post_universe_names). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_universe_names: {
        body: number[];
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v2/ui/autopilot/waypoint/`](https://esi.evetech.net//#!/User Interface/post_ui_autopilot_waypoint). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_autopilot_waypoint: {
        query: {
            add_to_beginning: boolean;
            clear_other_waypoints: boolean;
            destination_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/contract/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_contract). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_contract: {
        query: {
            contract_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/information/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_information). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_information: {
        query: {
            target_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/marketdetails/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_marketdetails). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_marketdetails: {
        query: {
            type_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`POST /v1/ui/openwindow/newmail/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_newmail). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    post_ui_openwindow_newmail: {
        body: esi.character.mail.NewMailWindow;
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/wallets/`](https://esi.evetech.net//#!/Wallet/get_characters_character_id_wallets). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_wallets: {
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/characters/{character_id}/wallets/journal/`](https://esi.evetech.net//#!/Wallet/get_characters_character_id_wallets_journal). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_characters_character_id_wallets_journal: {
        query: {
            from_id?: number;
        };
        path: {
            character_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/wars/`](https://esi.evetech.net//#!/Wars/get_wars). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_wars: {
        query: {
            max_war_id?: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/wars/{war_id}/`](https://esi.evetech.net//#!/Wars/get_wars_war_id). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
     */
    get_wars_war_id: {
        path: {
            war_id: number;
        };
    };
    /**
     * The type of this member specifies the path, query, and body parameters for the route: [`GET /v1/wars/{war_id}/killmails/`](https://esi.evetech.net//#!/Wars/get_wars_war_id_killmails). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.
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
     * The type of this member is the response type of for the route: [`GET /v1/alliances/`](https://esi.evetech.net//#!/Alliance/get_alliances).
     */
    get_alliances: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/alliances/{alliance_id}/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id).
     */
    get_alliances_alliance_id: esi.alliance.Alliance;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/alliances/{alliance_id}/corporations/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id_corporations).
     */
    get_alliances_alliance_id_corporations: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/alliances/{alliance_id}/icons/`](https://esi.evetech.net//#!/Alliance/get_alliances_alliance_id_icons).
     */
    get_alliances_alliance_id_icons: esi.alliance.Icons;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/alliances/names/`](https://esi.evetech.net//#!/Alliance/get_alliances_names).
     */
    get_alliances_names: esi.alliance.Name[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/assets/`](https://esi.evetech.net//#!/Assets/get_characters_character_id_assets).
     */
    get_characters_character_id_assets: esi.character.Asset[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/bookmarks/`](https://esi.evetech.net//#!/Bookmarks/get_characters_character_id_bookmarks).
     */
    get_characters_character_id_bookmarks: esi.character.Bookmark[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/bookmarks/folders/`](https://esi.evetech.net//#!/Bookmarks/get_characters_character_id_bookmarks_folders).
     */
    get_characters_character_id_bookmarks_folders: esi.character.BookmarksFolder[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/calendar/`](https://esi.evetech.net//#!/Calendar/get_characters_character_id_calendar).
     */
    get_characters_character_id_calendar: esi.character.calendar.Calendar[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.evetech.net//#!/Calendar/get_characters_character_id_calendar_event_id).
     */
    get_characters_character_id_calendar_event_id: esi.character.calendar.Event;
    /**
     * The type of this member is the response type of for the route: [`PUT /v3/characters/{character_id}/calendar/{event_id}/`](https://esi.evetech.net//#!/Calendar/put_characters_character_id_calendar_event_id).
     */
    put_characters_character_id_calendar_event_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v4/characters/{character_id}/`](https://esi.evetech.net//#!/Character/get_characters_character_id).
     */
    get_characters_character_id: esi.character.Character;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/agents_research/`](https://esi.evetech.net//#!/Character/get_characters_character_id_agents_research).
     */
    get_characters_character_id_agents_research: esi.character.AgentResearch[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/blueprints/`](https://esi.evetech.net//#!/Character/get_characters_character_id_blueprints).
     */
    get_characters_character_id_blueprints: esi.character.Blueprint[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/chat_channels/`](https://esi.evetech.net//#!/Character/get_characters_character_id_chat_channels).
     */
    get_characters_character_id_chat_channels: esi.character.channel.ChatChannel[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/corporationhistory/`](https://esi.evetech.net//#!/Character/get_characters_character_id_corporationhistory).
     */
    get_characters_character_id_corporationhistory: esi.character.CorporationHistory[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/medals/`](https://esi.evetech.net//#!/Character/get_characters_character_id_medals).
     */
    get_characters_character_id_medals: esi.character.Medal[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/portrait/`](https://esi.evetech.net//#!/Character/get_characters_character_id_portrait).
     */
    get_characters_character_id_portrait: esi.character.Portrait;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/roles/`](https://esi.evetech.net//#!/Character/get_characters_character_id_roles).
     */
    get_characters_character_id_roles: esi.Role[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/standings/`](https://esi.evetech.net//#!/Character/get_characters_character_id_standings).
     */
    get_characters_character_id_standings: esi.character.Standing[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/names/`](https://esi.evetech.net//#!/Character/get_characters_names).
     */
    get_characters_names: esi.character.Name[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/affiliation/`](https://esi.evetech.net//#!/Character/post_characters_affiliation).
     */
    post_characters_affiliation: esi.character.Affiliation[];
    /**
     * The type of this member is the response type of for the route: [`POST /v3/characters/{character_id}/cspa/`](https://esi.evetech.net//#!/Character/post_characters_character_id_cspa).
     */
    post_characters_character_id_cspa: esi.character.CSPACost;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/clones/`](https://esi.evetech.net//#!/Clones/get_characters_character_id_clones).
     */
    get_characters_character_id_clones: esi.character.Clones;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/delete_characters_character_id_contacts).
     */
    delete_characters_character_id_contacts: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/get_characters_character_id_contacts).
     */
    get_characters_character_id_contacts: esi.character.Contact[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contacts/labels/`](https://esi.evetech.net//#!/Contacts/get_characters_character_id_contacts_labels).
     */
    get_characters_character_id_contacts_labels: esi.character.ContactLabel[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/post_characters_character_id_contacts).
     */
    post_characters_character_id_contacts: number[];
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/characters/{character_id}/contacts/`](https://esi.evetech.net//#!/Contacts/put_characters_character_id_contacts).
     */
    put_characters_character_id_contacts: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contracts/`](https://esi.evetech.net//#!/Contracts/get_characters_character_id_contracts).
     */
    get_characters_character_id_contracts: esi.character.contract.Contract[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/bids/`](https://esi.evetech.net//#!/Contracts/get_characters_character_id_contracts_contract_id_bids).
     */
    get_characters_character_id_contracts_contract_id_bids: esi.character.contract.Bid[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/contracts/{contract_id}/items/`](https://esi.evetech.net//#!/Contracts/get_characters_character_id_contracts_contract_id_items).
     */
    get_characters_character_id_contracts_contract_id_items: esi.character.contract.Item[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/corporations/{corporation_id}/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id).
     */
    get_corporations_corporation_id: esi.corporation.Corporation;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/alliancehistory/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_alliancehistory).
     */
    get_corporations_corporation_id_alliancehistory: esi.corporation.AllianceHistory[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/icons/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_icons).
     */
    get_corporations_corporation_id_icons: esi.corporation.Icons;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/corporations/{corporation_id}/members/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_members).
     */
    get_corporations_corporation_id_members: esi.corporation.Member[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/roles/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_roles).
     */
    get_corporations_corporation_id_roles: esi.corporation.MemberRoles[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/{corporation_id}/structures/`](https://esi.evetech.net//#!/Corporation/get_corporations_corporation_id_structures).
     */
    get_corporations_corporation_id_structures: esi.corporation.Structure[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/names/`](https://esi.evetech.net//#!/Corporation/get_corporations_names).
     */
    get_corporations_names: esi.corporation.Name[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/corporations/npccorps/`](https://esi.evetech.net//#!/Corporation/get_corporations_npccorps).
     */
    get_corporations_npccorps: number[];
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/corporations/{corporation_id}/structures/{structure_id}/`](https://esi.evetech.net//#!/Corporation/put_corporations_corporation_id_structures_structure_id).
     */
    put_corporations_corporation_id_structures_structure_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/dogma/attributes/`](https://esi.evetech.net//#!/Dogma/get_dogma_attributes).
     */
    get_dogma_attributes: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/dogma/attributes/{attribute_id}/`](https://esi.evetech.net//#!/Dogma/get_dogma_attributes_attribute_id).
     */
    get_dogma_attributes_attribute_id: esi.dogma.Attribute;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/dogma/effects/`](https://esi.evetech.net//#!/Dogma/get_dogma_effects).
     */
    get_dogma_effects: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/dogma/effects/{effect_id}/`](https://esi.evetech.net//#!/Dogma/get_dogma_effects_effect_id).
     */
    get_dogma_effects_effect_id: esi.dogma.Effect;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/fittings/{fitting_id}/`](https://esi.evetech.net//#!/Fittings/delete_characters_character_id_fittings_fitting_id).
     */
    delete_characters_character_id_fittings_fitting_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/fittings/`](https://esi.evetech.net//#!/Fittings/get_characters_character_id_fittings).
     */
    get_characters_character_id_fittings: esi.character.fitting.Fitting[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/fittings/`](https://esi.evetech.net//#!/Fittings/post_characters_character_id_fittings).
     */
    post_characters_character_id_fittings: esi.character.fitting.FittingID;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.evetech.net//#!/Fleets/delete_fleets_fleet_id_members_member_id).
     */
    delete_fleets_fleet_id_members_member_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.evetech.net//#!/Fleets/delete_fleets_fleet_id_squads_squad_id).
     */
    delete_fleets_fleet_id_squads_squad_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.evetech.net//#!/Fleets/delete_fleets_fleet_id_wings_wing_id).
     */
    delete_fleets_fleet_id_wings_wing_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fleets/{fleet_id}/`](https://esi.evetech.net//#!/Fleets/get_fleets_fleet_id).
     */
    get_fleets_fleet_id: esi.fleet.Fleet;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fleets/{fleet_id}/members/`](https://esi.evetech.net//#!/Fleets/get_fleets_fleet_id_members).
     */
    get_fleets_fleet_id_members: esi.fleet.Member[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/fleets/{fleet_id}/wings/`](https://esi.evetech.net//#!/Fleets/get_fleets_fleet_id_wings).
     */
    get_fleets_fleet_id_wings: esi.fleet.Wing[];
    /**
     * The type of this member is the response type of for the route: [`POST /v1/fleets/{fleet_id}/members/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_members).
     */
    post_fleets_fleet_id_members: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/fleets/{fleet_id}/wings/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_wings).
     */
    post_fleets_fleet_id_wings: esi.fleet.WingID;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/fleets/{fleet_id}/wings/{wing_id}/squads/`](https://esi.evetech.net//#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads).
     */
    post_fleets_fleet_id_wings_wing_id_squads: esi.fleet.SquadID;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id).
     */
    put_fleets_fleet_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/members/{member_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id_members_member_id).
     */
    put_fleets_fleet_id_members_member_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/squads/{squad_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id_squads_squad_id).
     */
    put_fleets_fleet_id_squads_squad_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/fleets/{fleet_id}/wings/{wing_id}/`](https://esi.evetech.net//#!/Fleets/put_fleets_fleet_id_wings_wing_id).
     */
    put_fleets_fleet_id_wings_wing_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/incursions/`](https://esi.evetech.net//#!/Incursions/get_incursions).
     */
    get_incursions: esi.Incursion[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/industry/jobs/`](https://esi.evetech.net//#!/Industry/get_characters_character_id_industry_jobs).
     */
    get_characters_character_id_industry_jobs: esi.character.IndustryJob[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/industry/facilities/`](https://esi.evetech.net//#!/Industry/get_industry_facilities).
     */
    get_industry_facilities: esi.industry.Facility[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/industry/systems/`](https://esi.evetech.net//#!/Industry/get_industry_systems).
     */
    get_industry_systems: esi.industry.System[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/insurance/prices/`](https://esi.evetech.net//#!/Insurance/get_insurance_prices).
     */
    get_insurance_prices: esi.InsurancePrice[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/killmails/recent/`](https://esi.evetech.net//#!/Killmails/get_characters_character_id_killmails_recent).
     */
    get_characters_character_id_killmails_recent: esi.killmail.KillmailLink[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/killmails/{killmail_id}/{killmail_hash}/`](https://esi.evetech.net//#!/Killmails/get_killmails_killmail_id_killmail_hash).
     */
    get_killmails_killmail_id_killmail_hash: esi.killmail.Killmail;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/location/`](https://esi.evetech.net//#!/Location/get_characters_character_id_location).
     */
    get_characters_character_id_location: esi.character.Location;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/online/`](https://esi.evetech.net//#!/Location/get_characters_character_id_online).
     */
    get_characters_character_id_online: boolean;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/ship/`](https://esi.evetech.net//#!/Location/get_characters_character_id_ship).
     */
    get_characters_character_id_ship: esi.character.Ship;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/loyalty/points/`](https://esi.evetech.net//#!/Loyalty/get_characters_character_id_loyalty_points).
     */
    get_characters_character_id_loyalty_points: esi.character.LoyaltyPoints[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/loyalty/stores/{corporation_id}/offers/`](https://esi.evetech.net//#!/Loyalty/get_loyalty_stores_corporation_id_offers).
     */
    get_loyalty_stores_corporation_id_offers: esi.corporation.LoyaltyStoreOffer[];
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/mail/labels/{label_id}/`](https://esi.evetech.net//#!/Mail/delete_characters_character_id_mail_labels_label_id).
     */
    delete_characters_character_id_mail_labels_label_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`DELETE /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/delete_characters_character_id_mail_mail_id).
     */
    delete_characters_character_id_mail_mail_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/mail/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail).
     */
    get_characters_character_id_mail: esi.character.mail.MailHeader[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/characters/{character_id}/mail/labels/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_labels).
     */
    get_characters_character_id_mail_labels: esi.character.mail.Labels;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/mail/lists/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_lists).
     */
    get_characters_character_id_mail_lists: esi.character.mail.List[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/get_characters_character_id_mail_mail_id).
     */
    get_characters_character_id_mail_mail_id: esi.character.mail.Mail;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/characters/{character_id}/mail/`](https://esi.evetech.net//#!/Mail/post_characters_character_id_mail).
     */
    post_characters_character_id_mail: number;
    /**
     * The type of this member is the response type of for the route: [`POST /v2/characters/{character_id}/mail/labels/`](https://esi.evetech.net//#!/Mail/post_characters_character_id_mail_labels).
     */
    post_characters_character_id_mail_labels: number;
    /**
     * The type of this member is the response type of for the route: [`PUT /v1/characters/{character_id}/mail/{mail_id}/`](https://esi.evetech.net//#!/Mail/put_characters_character_id_mail_mail_id).
     */
    put_characters_character_id_mail_mail_id: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/orders/`](https://esi.evetech.net//#!/Market/get_characters_character_id_orders).
     */
    get_characters_character_id_orders: esi.character.Order[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/groups/`](https://esi.evetech.net//#!/Market/get_markets_groups).
     */
    get_markets_groups: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/groups/{market_group_id}/`](https://esi.evetech.net//#!/Market/get_markets_groups_market_group_id).
     */
    get_markets_groups_market_group_id: esi.market.MarketGroup;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/prices/`](https://esi.evetech.net//#!/Market/get_markets_prices).
     */
    get_markets_prices: esi.market.Price[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/{region_id}/history/`](https://esi.evetech.net//#!/Market/get_markets_region_id_history).
     */
    get_markets_region_id_history: esi.market.History[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/{region_id}/orders/`](https://esi.evetech.net//#!/Market/get_markets_region_id_orders).
     */
    get_markets_region_id_orders: esi.market.Order[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/markets/structures/{structure_id}/`](https://esi.evetech.net//#!/Market/get_markets_structures_structure_id).
     */
    get_markets_structures_structure_id: esi.market.Order[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/opportunities/`](https://esi.evetech.net//#!/Opportunities/get_characters_character_id_opportunities).
     */
    get_characters_character_id_opportunities: esi.character.Opportunity[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/groups/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_groups).
     */
    get_opportunities_groups: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/groups/{group_id}/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_groups_group_id).
     */
    get_opportunities_groups_group_id: esi.OpportunitiesGroup;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/tasks/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_tasks).
     */
    get_opportunities_tasks: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/opportunities/tasks/{task_id}/`](https://esi.evetech.net//#!/Opportunities/get_opportunities_tasks_task_id).
     */
    get_opportunities_tasks_task_id: esi.OpportunitiesTask;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/planets/`](https://esi.evetech.net//#!/Planetary Interaction/get_characters_character_id_planets).
     */
    get_characters_character_id_planets: esi.character.planetaryinteraction.PlanetSummary[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/planets/{planet_id}/`](https://esi.evetech.net//#!/Planetary Interaction/get_characters_character_id_planets_planet_id).
     */
    get_characters_character_id_planets_planet_id: esi.character.planetaryinteraction.Planet;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/schematics/{schematic_id}/`](https://esi.evetech.net//#!/Planetary Interaction/get_universe_schematics_schematic_id).
     */
    get_universe_schematics_schematic_id: esi.universe.Schematic;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/route/{origin}/{destination}/`](https://esi.evetech.net//#!/Routes/get_route_origin_destination).
     */
    get_route_origin_destination: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/search/`](https://esi.evetech.net//#!/Search/get_characters_character_id_search).
     */
    get_characters_character_id_search: esi.character.Search;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/search/`](https://esi.evetech.net//#!/Search/get_search).
     */
    get_search: esi.Search;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/characters/{character_id}/skillqueue/`](https://esi.evetech.net//#!/Skills/get_characters_character_id_skillqueue).
     */
    get_characters_character_id_skillqueue: esi.character.Skillqueue[];
    /**
     * The type of this member is the response type of for the route: [`GET /v3/characters/{character_id}/skills/`](https://esi.evetech.net//#!/Skills/get_characters_character_id_skills).
     */
    get_characters_character_id_skills: esi.character.Skills;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/sovereignty/campaigns/`](https://esi.evetech.net//#!/Sovereignty/get_sovereignty_campaigns).
     */
    get_sovereignty_campaigns: esi.sovereignty.Campaign[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/sovereignty/map/`](https://esi.evetech.net//#!/Sovereignty/get_sovereignty_map).
     */
    get_sovereignty_map: esi.sovereignty.Map[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/sovereignty/structures/`](https://esi.evetech.net//#!/Sovereignty/get_sovereignty_structures).
     */
    get_sovereignty_structures: esi.sovereignty.Structure[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/status/`](https://esi.evetech.net//#!/Status/get_status).
     */
    get_status: esi.Status;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/bloodlines/`](https://esi.evetech.net//#!/Universe/get_universe_bloodlines).
     */
    get_universe_bloodlines: esi.universe.Bloodline[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/categories/`](https://esi.evetech.net//#!/Universe/get_universe_categories).
     */
    get_universe_categories: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/categories/{category_id}/`](https://esi.evetech.net//#!/Universe/get_universe_categories_category_id).
     */
    get_universe_categories_category_id: esi.universe.Category;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/constellations/`](https://esi.evetech.net//#!/Universe/get_universe_constellations).
     */
    get_universe_constellations: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/constellations/{constellation_id}/`](https://esi.evetech.net//#!/Universe/get_universe_constellations_constellation_id).
     */
    get_universe_constellations_constellation_id: esi.universe.Constellation;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/factions/`](https://esi.evetech.net//#!/Universe/get_universe_factions).
     */
    get_universe_factions: esi.universe.Faction[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/graphics/`](https://esi.evetech.net//#!/Universe/get_universe_graphics).
     */
    get_universe_graphics: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/graphics/{graphic_id}/`](https://esi.evetech.net//#!/Universe/get_universe_graphics_graphic_id).
     */
    get_universe_graphics_graphic_id: esi.universe.Graphic;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/groups/`](https://esi.evetech.net//#!/Universe/get_universe_groups).
     */
    get_universe_groups: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/groups/{group_id}/`](https://esi.evetech.net//#!/Universe/get_universe_groups_group_id).
     */
    get_universe_groups_group_id: esi.universe.Group;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/moons/{moon_id}/`](https://esi.evetech.net//#!/Universe/get_universe_moons_moon_id).
     */
    get_universe_moons_moon_id: esi.universe.Moon;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/planets/{planet_id}/`](https://esi.evetech.net//#!/Universe/get_universe_planets_planet_id).
     */
    get_universe_planets_planet_id: esi.universe.Planet;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/races/`](https://esi.evetech.net//#!/Universe/get_universe_races).
     */
    get_universe_races: esi.universe.Race[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/regions/`](https://esi.evetech.net//#!/Universe/get_universe_regions).
     */
    get_universe_regions: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/regions/{region_id}/`](https://esi.evetech.net//#!/Universe/get_universe_regions_region_id).
     */
    get_universe_regions_region_id: esi.universe.Region;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/stargates/{stargate_id}/`](https://esi.evetech.net//#!/Universe/get_universe_stargates_stargate_id).
     */
    get_universe_stargates_stargate_id: esi.universe.Stargate;
    /**
     * The type of this member is the response type of for the route: [`GET /v2/universe/stations/{station_id}/`](https://esi.evetech.net//#!/Universe/get_universe_stations_station_id).
     */
    get_universe_stations_station_id: esi.universe.Station;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/structures/`](https://esi.evetech.net//#!/Universe/get_universe_structures).
     */
    get_universe_structures: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/structures/{structure_id}/`](https://esi.evetech.net//#!/Universe/get_universe_structures_structure_id).
     */
    get_universe_structures_structure_id: esi.universe.Structure;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/system_jumps/`](https://esi.evetech.net//#!/Universe/get_universe_system_jumps).
     */
    get_universe_system_jumps: esi.universe.SystemJumps[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/system_kills/`](https://esi.evetech.net//#!/Universe/get_universe_system_kills).
     */
    get_universe_system_kills: esi.universe.SystemKills[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/systems/`](https://esi.evetech.net//#!/Universe/get_universe_systems).
     */
    get_universe_systems: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/universe/systems/{system_id}/`](https://esi.evetech.net//#!/Universe/get_universe_systems_system_id).
     */
    get_universe_systems_system_id: esi.universe.System;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/universe/types/`](https://esi.evetech.net//#!/Universe/get_universe_types).
     */
    get_universe_types: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v2/universe/types/{type_id}/`](https://esi.evetech.net//#!/Universe/get_universe_types_type_id).
     */
    get_universe_types_type_id: esi.universe.Type;
    /**
     * The type of this member is the response type of for the route: [`POST /v2/universe/names/`](https://esi.evetech.net//#!/Universe/post_universe_names).
     */
    post_universe_names: esi.universe.Name[];
    /**
     * The type of this member is the response type of for the route: [`POST /v2/ui/autopilot/waypoint/`](https://esi.evetech.net//#!/User Interface/post_ui_autopilot_waypoint).
     */
    post_ui_autopilot_waypoint: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/contract/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_contract).
     */
    post_ui_openwindow_contract: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/information/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_information).
     */
    post_ui_openwindow_information: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/marketdetails/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_marketdetails).
     */
    post_ui_openwindow_marketdetails: undefined;
    /**
     * The type of this member is the response type of for the route: [`POST /v1/ui/openwindow/newmail/`](https://esi.evetech.net//#!/User Interface/post_ui_openwindow_newmail).
     */
    post_ui_openwindow_newmail: undefined;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/wallets/`](https://esi.evetech.net//#!/Wallet/get_characters_character_id_wallets).
     */
    get_characters_character_id_wallets: esi.character.Wallet[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/characters/{character_id}/wallets/journal/`](https://esi.evetech.net//#!/Wallet/get_characters_character_id_wallets_journal).
     */
    get_characters_character_id_wallets_journal: esi.character.WalletJournal[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/wars/`](https://esi.evetech.net//#!/Wars/get_wars).
     */
    get_wars: number[];
    /**
     * The type of this member is the response type of for the route: [`GET /v1/wars/{war_id}/`](https://esi.evetech.net//#!/Wars/get_wars_war_id).
     */
    get_wars_war_id: esi.War;
    /**
     * The type of this member is the response type of for the route: [`GET /v1/wars/{war_id}/killmails/`](https://esi.evetech.net//#!/Wars/get_wars_war_id_killmails).
     */
    get_wars_war_id_killmails: esi.killmail.KillmailLink[];
}
export declare const ROUTE_MAP: RouteMap;
export interface RouteMap {
    get_alliances: URLInfo;
    get_alliances_alliance_id: URLInfo;
    get_alliances_alliance_id_corporations: URLInfo;
    get_alliances_alliance_id_icons: URLInfo;
    get_alliances_names: URLInfo;
    get_characters_character_id_assets: URLInfo;
    get_characters_character_id_bookmarks: URLInfo;
    get_characters_character_id_bookmarks_folders: URLInfo;
    get_characters_character_id_calendar: URLInfo;
    get_characters_character_id_calendar_event_id: URLInfo;
    put_characters_character_id_calendar_event_id: URLInfo;
    get_characters_character_id: URLInfo;
    get_characters_character_id_agents_research: URLInfo;
    get_characters_character_id_blueprints: URLInfo;
    get_characters_character_id_chat_channels: URLInfo;
    get_characters_character_id_corporationhistory: URLInfo;
    get_characters_character_id_medals: URLInfo;
    get_characters_character_id_portrait: URLInfo;
    get_characters_character_id_roles: URLInfo;
    get_characters_character_id_standings: URLInfo;
    get_characters_names: URLInfo;
    post_characters_affiliation: URLInfo;
    post_characters_character_id_cspa: URLInfo;
    get_characters_character_id_clones: URLInfo;
    delete_characters_character_id_contacts: URLInfo;
    get_characters_character_id_contacts: URLInfo;
    get_characters_character_id_contacts_labels: URLInfo;
    post_characters_character_id_contacts: URLInfo;
    put_characters_character_id_contacts: URLInfo;
    get_characters_character_id_contracts: URLInfo;
    get_characters_character_id_contracts_contract_id_bids: URLInfo;
    get_characters_character_id_contracts_contract_id_items: URLInfo;
    get_corporations_corporation_id: URLInfo;
    get_corporations_corporation_id_alliancehistory: URLInfo;
    get_corporations_corporation_id_icons: URLInfo;
    get_corporations_corporation_id_members: URLInfo;
    get_corporations_corporation_id_roles: URLInfo;
    get_corporations_corporation_id_structures: URLInfo;
    get_corporations_names: URLInfo;
    get_corporations_npccorps: URLInfo;
    put_corporations_corporation_id_structures_structure_id: URLInfo;
    get_dogma_attributes: URLInfo;
    get_dogma_attributes_attribute_id: URLInfo;
    get_dogma_effects: URLInfo;
    get_dogma_effects_effect_id: URLInfo;
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
    get_characters_character_id_wallets: URLInfo;
    get_characters_character_id_wallets_journal: URLInfo;
    get_wars: URLInfo;
    get_wars_war_id: URLInfo;
    get_wars_war_id_killmails: URLInfo;
}
export interface URLInfo {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
}
