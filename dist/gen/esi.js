"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var esi;
(function (esi) {
    let character;
    (function (character) {
        let calendar;
        (function (calendar) {
            let EventResponse;
            (function (EventResponse) {
                EventResponse["DECLINED"] = "declined";
                EventResponse["NOT_RESPONDED"] = "not_responded";
                EventResponse["ACCEPTED"] = "accepted";
                EventResponse["TENTATIVE"] = "tentative";
            })(EventResponse = calendar.EventResponse || (calendar.EventResponse = {}));
            let OwnerType;
            (function (OwnerType) {
                OwnerType["EVE_SERVER"] = "eve_server";
                OwnerType["CORPORATION"] = "corporation";
                OwnerType["FACTION"] = "faction";
                OwnerType["CHARACTER"] = "character";
                OwnerType["ALLIANCE"] = "alliance";
            })(OwnerType = calendar.OwnerType || (calendar.OwnerType = {}));
        })(calendar = character.calendar || (character.calendar = {}));
        let contract;
        (function (contract) {
            /**
             * To whom the contract is available.
             */
            let Availability;
            (function (Availability) {
                Availability["PUBLIC"] = "public";
                Availability["PERSONAL"] = "personal";
                Availability["CORPORATION"] = "corporation";
                Availability["ALLIANCE"] = "alliance";
            })(Availability = contract.Availability || (contract.Availability = {}));
            /**
             * Status of the the contract.
             */
            let Status;
            (function (Status) {
                Status["OUTSTANDING"] = "outstanding";
                Status["IN_PROGRESS"] = "in_progress";
                Status["FINISHED_ISSUER"] = "finished_issuer";
                Status["FINISHED_CONTRACTOR"] = "finished_contractor";
                Status["FINISHED"] = "finished";
                Status["CANCELLED"] = "cancelled";
                Status["REJECTED"] = "rejected";
                Status["FAILED"] = "failed";
                Status["DELETED"] = "deleted";
                Status["REVERSED"] = "reversed";
            })(Status = contract.Status || (contract.Status = {}));
            /**
             * Type of the contract.
             */
            let Type;
            (function (Type) {
                Type["UNKNOWN"] = "unknown";
                Type["ITEM_EXCHANGE"] = "item_exchange";
                Type["AUCTION"] = "auction";
                Type["COURIER"] = "courier";
                Type["LOAN"] = "loan";
            })(Type = contract.Type || (contract.Type = {}));
        })(contract = character.contract || (character.contract = {}));
        let mail;
        (function (mail) {
            /**
             * Hexadecimal string representing label color, in RGB format.
             */
            let Color;
            (function (Color) {
                Color["C_FFFFFF"] = "#ffffff";
                Color["C_FFFF01"] = "#ffff01";
                Color["C_FF6600"] = "#ff6600";
                Color["C_FE0000"] = "#fe0000";
                Color["C_9A0000"] = "#9a0000";
                Color["C_660066"] = "#660066";
                Color["C_0000FE"] = "#0000fe";
                Color["C_0099FF"] = "#0099ff";
                Color["C_01FFFF"] = "#01ffff";
                Color["C_00FF33"] = "#00ff33";
                Color["C_349800"] = "#349800";
                Color["C_006634"] = "#006634";
                Color["C_666666"] = "#666666";
                Color["C_999999"] = "#999999";
                Color["C_E6E6E6"] = "#e6e6e6";
                Color["C_FFFFCD"] = "#ffffcd";
                Color["C_99FFFF"] = "#99ffff";
                Color["C_CCFF9A"] = "#ccff9a";
            })(Color = mail.Color || (mail.Color = {}));
            let RecipientType;
            (function (RecipientType) {
                RecipientType["ALLIANCE"] = "alliance";
                RecipientType["CHARACTER"] = "character";
                RecipientType["CORPORATION"] = "corporation";
                RecipientType["MAILING_LIST"] = "mailing_list";
            })(RecipientType = mail.RecipientType || (mail.RecipientType = {}));
        })(mail = character.mail || (character.mail = {}));
        let planetaryinteraction;
        (function (planetaryinteraction) {
            let PlanetType;
            (function (PlanetType) {
                PlanetType["TEMPERATE"] = "temperate";
                PlanetType["BARREN"] = "barren";
                PlanetType["OCEANIC"] = "oceanic";
                PlanetType["ICE"] = "ice";
                PlanetType["GAS"] = "gas";
                PlanetType["LAVA"] = "lava";
                PlanetType["STORM"] = "storm";
                PlanetType["PLASMA"] = "plasma";
            })(PlanetType = planetaryinteraction.PlanetType || (planetaryinteraction.PlanetType = {}));
        })(planetaryinteraction = character.planetaryinteraction || (character.planetaryinteraction = {}));
        let AssetLocation;
        (function (AssetLocation) {
            AssetLocation["AUTO_FIT"] = "AutoFit";
            AssetLocation["CARGO"] = "Cargo";
            AssetLocation["CORPSE_BAY"] = "CorpseBay";
            AssetLocation["DRONE_BAY"] = "DroneBay";
            AssetLocation["FLEET_HANGAR"] = "FleetHangar";
            AssetLocation["DELIVERIES"] = "Deliveries";
            AssetLocation["HIDDEN_MODIFIERS"] = "HiddenModifiers";
            AssetLocation["HANGAR"] = "Hangar";
            AssetLocation["HANGAR_ALL"] = "HangarAll";
            AssetLocation["LO_SLOT_0"] = "LoSlot0";
            AssetLocation["LO_SLOT_1"] = "LoSlot1";
            AssetLocation["LO_SLOT_2"] = "LoSlot2";
            AssetLocation["LO_SLOT_3"] = "LoSlot3";
            AssetLocation["LO_SLOT_4"] = "LoSlot4";
            AssetLocation["LO_SLOT_5"] = "LoSlot5";
            AssetLocation["LO_SLOT_6"] = "LoSlot6";
            AssetLocation["LO_SLOT_7"] = "LoSlot7";
            AssetLocation["MED_SLOT_0"] = "MedSlot0";
            AssetLocation["MED_SLOT_1"] = "MedSlot1";
            AssetLocation["MED_SLOT_2"] = "MedSlot2";
            AssetLocation["MED_SLOT_3"] = "MedSlot3";
            AssetLocation["MED_SLOT_4"] = "MedSlot4";
            AssetLocation["MED_SLOT_5"] = "MedSlot5";
            AssetLocation["MED_SLOT_6"] = "MedSlot6";
            AssetLocation["MED_SLOT_7"] = "MedSlot7";
            AssetLocation["HI_SLOT_0"] = "HiSlot0";
            AssetLocation["HI_SLOT_1"] = "HiSlot1";
            AssetLocation["HI_SLOT_2"] = "HiSlot2";
            AssetLocation["HI_SLOT_3"] = "HiSlot3";
            AssetLocation["HI_SLOT_4"] = "HiSlot4";
            AssetLocation["HI_SLOT_5"] = "HiSlot5";
            AssetLocation["HI_SLOT_6"] = "HiSlot6";
            AssetLocation["HI_SLOT_7"] = "HiSlot7";
            AssetLocation["ASSET_SAFETY"] = "AssetSafety";
            AssetLocation["LOCKED"] = "Locked";
            AssetLocation["UNLOCKED"] = "Unlocked";
            AssetLocation["IMPLANT"] = "Implant";
            AssetLocation["QUAFE_BAY"] = "QuafeBay";
            AssetLocation["RIG_SLOT_0"] = "RigSlot0";
            AssetLocation["RIG_SLOT_1"] = "RigSlot1";
            AssetLocation["RIG_SLOT_2"] = "RigSlot2";
            AssetLocation["RIG_SLOT_3"] = "RigSlot3";
            AssetLocation["RIG_SLOT_4"] = "RigSlot4";
            AssetLocation["RIG_SLOT_5"] = "RigSlot5";
            AssetLocation["RIG_SLOT_6"] = "RigSlot6";
            AssetLocation["RIG_SLOT_7"] = "RigSlot7";
            AssetLocation["SHIP_HANGAR"] = "ShipHangar";
            AssetLocation["SPECIALIZED_FUEL_BAY"] = "SpecializedFuelBay";
            AssetLocation["SPECIALIZED_ORE_HOLD"] = "SpecializedOreHold";
            AssetLocation["SPECIALIZED_GAS_HOLD"] = "SpecializedGasHold";
            AssetLocation["SPECIALIZED_MINERAL_HOLD"] = "SpecializedMineralHold";
            AssetLocation["SPECIALIZED_SALVAGE_HOLD"] = "SpecializedSalvageHold";
            AssetLocation["SPECIALIZED_SHIP_HOLD"] = "SpecializedShipHold";
            AssetLocation["SPECIALIZED_SMALL_SHIP_HOLD"] = "SpecializedSmallShipHold";
            AssetLocation["SPECIALIZED_MEDIUM_SHIP_HOLD"] = "SpecializedMediumShipHold";
            AssetLocation["SPECIALIZED_LARGE_SHIP_HOLD"] = "SpecializedLargeShipHold";
            AssetLocation["SPECIALIZED_INDUSTRIAL_SHIP_HOLD"] = "SpecializedIndustrialShipHold";
            AssetLocation["SPECIALIZED_AMMO_HOLD"] = "SpecializedAmmoHold";
            AssetLocation["SPECIALIZED_COMMAND_CENTER_HOLD"] = "SpecializedCommandCenterHold";
            AssetLocation["SPECIALIZED_PLANETARY_COMMODITIES_HOLD"] = "SpecializedPlanetaryCommoditiesHold";
            AssetLocation["SPECIALIZED_MATERIAL_BAY"] = "SpecializedMaterialBay";
            AssetLocation["SUB_SYSTEM_SLOT_0"] = "SubSystemSlot0";
            AssetLocation["SUB_SYSTEM_SLOT_1"] = "SubSystemSlot1";
            AssetLocation["SUB_SYSTEM_SLOT_2"] = "SubSystemSlot2";
            AssetLocation["SUB_SYSTEM_SLOT_3"] = "SubSystemSlot3";
            AssetLocation["SUB_SYSTEM_SLOT_4"] = "SubSystemSlot4";
            AssetLocation["SUB_SYSTEM_SLOT_5"] = "SubSystemSlot5";
            AssetLocation["SUB_SYSTEM_SLOT_6"] = "SubSystemSlot6";
            AssetLocation["SUB_SYSTEM_SLOT_7"] = "SubSystemSlot7";
            AssetLocation["FIGHTER_BAY"] = "FighterBay";
            AssetLocation["FIGHTER_TUBE_0"] = "FighterTube0";
            AssetLocation["FIGHTER_TUBE_1"] = "FighterTube1";
            AssetLocation["FIGHTER_TUBE_2"] = "FighterTube2";
            AssetLocation["FIGHTER_TUBE_3"] = "FighterTube3";
            AssetLocation["FIGHTER_TUBE_4"] = "FighterTube4";
            AssetLocation["MODULE"] = "Module";
            AssetLocation["WARDROBE"] = "Wardrobe";
        })(AssetLocation = character.AssetLocation || (character.AssetLocation = {}));
        /**
         * Indicates something about this item's storage location. The flag is used to differentiate between hangar divisions, drone bay, fitting location, and similar.
         */
        let BlueprintLocation;
        (function (BlueprintLocation) {
            BlueprintLocation["AUTO_FIT"] = "AutoFit";
            BlueprintLocation["CARGO"] = "Cargo";
            BlueprintLocation["CORPSE_BAY"] = "CorpseBay";
            BlueprintLocation["DRONE_BAY"] = "DroneBay";
            BlueprintLocation["FLEET_HANGAR"] = "FleetHangar";
            BlueprintLocation["DELIVERIES"] = "Deliveries";
            BlueprintLocation["HIDDEN_MODIFIERS"] = "HiddenModifiers";
            BlueprintLocation["HANGAR"] = "Hangar";
            BlueprintLocation["HANGAR_ALL"] = "HangarAll";
            BlueprintLocation["LO_SLOT_0"] = "LoSlot0";
            BlueprintLocation["LO_SLOT_1"] = "LoSlot1";
            BlueprintLocation["LO_SLOT_2"] = "LoSlot2";
            BlueprintLocation["LO_SLOT_3"] = "LoSlot3";
            BlueprintLocation["LO_SLOT_4"] = "LoSlot4";
            BlueprintLocation["LO_SLOT_5"] = "LoSlot5";
            BlueprintLocation["LO_SLOT_6"] = "LoSlot6";
            BlueprintLocation["LO_SLOT_7"] = "LoSlot7";
            BlueprintLocation["MED_SLOT_0"] = "MedSlot0";
            BlueprintLocation["MED_SLOT_1"] = "MedSlot1";
            BlueprintLocation["MED_SLOT_2"] = "MedSlot2";
            BlueprintLocation["MED_SLOT_3"] = "MedSlot3";
            BlueprintLocation["MED_SLOT_4"] = "MedSlot4";
            BlueprintLocation["MED_SLOT_5"] = "MedSlot5";
            BlueprintLocation["MED_SLOT_6"] = "MedSlot6";
            BlueprintLocation["MED_SLOT_7"] = "MedSlot7";
            BlueprintLocation["HI_SLOT_0"] = "HiSlot0";
            BlueprintLocation["HI_SLOT_1"] = "HiSlot1";
            BlueprintLocation["HI_SLOT_2"] = "HiSlot2";
            BlueprintLocation["HI_SLOT_3"] = "HiSlot3";
            BlueprintLocation["HI_SLOT_4"] = "HiSlot4";
            BlueprintLocation["HI_SLOT_5"] = "HiSlot5";
            BlueprintLocation["HI_SLOT_6"] = "HiSlot6";
            BlueprintLocation["HI_SLOT_7"] = "HiSlot7";
            BlueprintLocation["ASSET_SAFETY"] = "AssetSafety";
            BlueprintLocation["LOCKED"] = "Locked";
            BlueprintLocation["UNLOCKED"] = "Unlocked";
            BlueprintLocation["IMPLANT"] = "Implant";
            BlueprintLocation["QUAFE_BAY"] = "QuafeBay";
            BlueprintLocation["RIG_SLOT_0"] = "RigSlot0";
            BlueprintLocation["RIG_SLOT_1"] = "RigSlot1";
            BlueprintLocation["RIG_SLOT_2"] = "RigSlot2";
            BlueprintLocation["RIG_SLOT_3"] = "RigSlot3";
            BlueprintLocation["RIG_SLOT_4"] = "RigSlot4";
            BlueprintLocation["RIG_SLOT_5"] = "RigSlot5";
            BlueprintLocation["RIG_SLOT_6"] = "RigSlot6";
            BlueprintLocation["RIG_SLOT_7"] = "RigSlot7";
            BlueprintLocation["SHIP_HANGAR"] = "ShipHangar";
            BlueprintLocation["SPECIALIZED_FUEL_BAY"] = "SpecializedFuelBay";
            BlueprintLocation["SPECIALIZED_ORE_HOLD"] = "SpecializedOreHold";
            BlueprintLocation["SPECIALIZED_GAS_HOLD"] = "SpecializedGasHold";
            BlueprintLocation["SPECIALIZED_MINERAL_HOLD"] = "SpecializedMineralHold";
            BlueprintLocation["SPECIALIZED_SALVAGE_HOLD"] = "SpecializedSalvageHold";
            BlueprintLocation["SPECIALIZED_SHIP_HOLD"] = "SpecializedShipHold";
            BlueprintLocation["SPECIALIZED_SMALL_SHIP_HOLD"] = "SpecializedSmallShipHold";
            BlueprintLocation["SPECIALIZED_MEDIUM_SHIP_HOLD"] = "SpecializedMediumShipHold";
            BlueprintLocation["SPECIALIZED_LARGE_SHIP_HOLD"] = "SpecializedLargeShipHold";
            BlueprintLocation["SPECIALIZED_INDUSTRIAL_SHIP_HOLD"] = "SpecializedIndustrialShipHold";
            BlueprintLocation["SPECIALIZED_AMMO_HOLD"] = "SpecializedAmmoHold";
            BlueprintLocation["SPECIALIZED_COMMAND_CENTER_HOLD"] = "SpecializedCommandCenterHold";
            BlueprintLocation["SPECIALIZED_PLANETARY_COMMODITIES_HOLD"] = "SpecializedPlanetaryCommoditiesHold";
            BlueprintLocation["SPECIALIZED_MATERIAL_BAY"] = "SpecializedMaterialBay";
            BlueprintLocation["SUB_SYSTEM_SLOT_0"] = "SubSystemSlot0";
            BlueprintLocation["SUB_SYSTEM_SLOT_1"] = "SubSystemSlot1";
            BlueprintLocation["SUB_SYSTEM_SLOT_2"] = "SubSystemSlot2";
            BlueprintLocation["SUB_SYSTEM_SLOT_3"] = "SubSystemSlot3";
            BlueprintLocation["SUB_SYSTEM_SLOT_4"] = "SubSystemSlot4";
            BlueprintLocation["SUB_SYSTEM_SLOT_5"] = "SubSystemSlot5";
            BlueprintLocation["SUB_SYSTEM_SLOT_6"] = "SubSystemSlot6";
            BlueprintLocation["SUB_SYSTEM_SLOT_7"] = "SubSystemSlot7";
            BlueprintLocation["FIGHTER_BAY"] = "FighterBay";
            BlueprintLocation["FIGHTER_TUBE_0"] = "FighterTube0";
            BlueprintLocation["FIGHTER_TUBE_1"] = "FighterTube1";
            BlueprintLocation["FIGHTER_TUBE_2"] = "FighterTube2";
            BlueprintLocation["FIGHTER_TUBE_3"] = "FighterTube3";
            BlueprintLocation["FIGHTER_TUBE_4"] = "FighterTube4";
            BlueprintLocation["MODULE"] = "Module";
        })(BlueprintLocation = character.BlueprintLocation || (character.BlueprintLocation = {}));
        let ContactType;
        (function (ContactType) {
            ContactType["CHARACTER"] = "character";
            ContactType["CORPORATION"] = "corporation";
            ContactType["ALLIANCE"] = "alliance";
            ContactType["FACTION"] = "faction";
        })(ContactType = character.ContactType || (character.ContactType = {}));
        let JobStatus;
        (function (JobStatus) {
            JobStatus["ACTIVE"] = "active";
            JobStatus["PAUSED"] = "paused";
            JobStatus["READY"] = "ready";
            JobStatus["DELIVERED"] = "delivered";
            JobStatus["CANCELLED"] = "cancelled";
            JobStatus["REVERTED"] = "reverted";
        })(JobStatus = character.JobStatus || (character.JobStatus = {}));
        /**
         * Current order state.
         */
        let OrderState;
        (function (OrderState) {
            OrderState["OPEN"] = "open";
            OrderState["CLOSED"] = "closed";
            OrderState["EXPIRED"] = "expired";
            OrderState["CANCELLED"] = "cancelled";
            OrderState["PENDING"] = "pending";
            OrderState["CHARACTER_DELETED"] = "character_deleted";
        })(OrderState = character.OrderState || (character.OrderState = {}));
        let SearchCategory;
        (function (SearchCategory) {
            SearchCategory["AGENT"] = "agent";
            SearchCategory["ALLIANCE"] = "alliance";
            SearchCategory["CHARACTER"] = "character";
            SearchCategory["CONSTELLATION"] = "constellation";
            SearchCategory["CORPORATION"] = "corporation";
            SearchCategory["FACTION"] = "faction";
            SearchCategory["INVENTORYTYPE"] = "inventorytype";
            SearchCategory["REGION"] = "region";
            SearchCategory["SOLARSYSTEM"] = "solarsystem";
            SearchCategory["STATION"] = "station";
            SearchCategory["STRUCTURE"] = "structure";
            SearchCategory["WORMHOLE"] = "wormhole";
        })(SearchCategory = character.SearchCategory || (character.SearchCategory = {}));
    })(character = esi.character || (esi.character = {}));
    let corporation;
    (function (corporation) {
        let Faction;
        (function (Faction) {
            Faction["MINMATAR"] = "Minmatar";
            Faction["GALLENTE"] = "Gallente";
            Faction["CALDARI"] = "Caldari";
            Faction["AMARR"] = "Amarr";
        })(Faction = corporation.Faction || (corporation.Faction = {}));
    })(corporation = esi.corporation || (esi.corporation = {}));
    let fleet;
    (function (fleet) {
        let Role;
        (function (Role) {
            Role["FLEET_COMMANDER"] = "fleet_commander";
            Role["WING_COMMANDER"] = "wing_commander";
            Role["SQUAD_COMMANDER"] = "squad_commander";
            Role["SQUAD_MEMBER"] = "squad_member";
        })(Role = fleet.Role || (fleet.Role = {}));
    })(fleet = esi.fleet || (esi.fleet = {}));
    let industry;
    (function (industry) {
        let Activity;
        (function (Activity) {
            Activity["NONE"] = "none";
            Activity["MANUFACTURING"] = "manufacturing";
            Activity["RESEARCHING_TECHNOLOGY"] = "researching_technology";
            Activity["RESEARCHING_TIME_EFFICIENCY"] = "researching_time_efficiency";
            Activity["RESEARCHING_MATERIAL_EFFICIENCY"] = "researching_material_efficiency";
            Activity["COPYING"] = "copying";
            Activity["DUPLICATING"] = "duplicating";
            Activity["INVENTION"] = "invention";
            Activity["REVERSE_ENGINEERING"] = "reverse_engineering";
        })(Activity = industry.Activity || (industry.Activity = {}));
    })(industry = esi.industry || (esi.industry = {}));
    let sovereignty;
    (function (sovereignty) {
        /**
         * Type of event this campaign is for. tcu_defense, ihub_defense and station_defense are referred to as "Defense Events", station_freeport as "Freeport Events".
         */
        let EventType;
        (function (EventType) {
            EventType["TCU_DEFENSE"] = "tcu_defense";
            EventType["IHUB_DEFENSE"] = "ihub_defense";
            EventType["STATION_DEFENSE"] = "station_defense";
            EventType["STATION_FREEPORT"] = "station_freeport";
        })(EventType = sovereignty.EventType || (sovereignty.EventType = {}));
    })(sovereignty = esi.sovereignty || (esi.sovereignty = {}));
    let universe;
    (function (universe) {
        let NameCategory;
        (function (NameCategory) {
            NameCategory["ALLIANCE"] = "alliance";
            NameCategory["CHARACTER"] = "character";
            NameCategory["CONSTELLATION"] = "constellation";
            NameCategory["CORPORATION"] = "corporation";
            NameCategory["INVENTORY_TYPE"] = "inventory_type";
            NameCategory["REGION"] = "region";
            NameCategory["SOLAR_SYSTEM"] = "solar_system";
            NameCategory["STATION"] = "station";
        })(NameCategory = universe.NameCategory || (universe.NameCategory = {}));
        let Service;
        (function (Service) {
            Service["BOUNTY_MISSIONS"] = "bounty-missions";
            Service["ASSASINATION_MISSIONS"] = "assasination-missions";
            Service["COURIER_MISSIONS"] = "courier-missions";
            Service["INTERBUS"] = "interbus";
            Service["REPROCESSING_PLANT"] = "reprocessing-plant";
            Service["REFINERY"] = "refinery";
            Service["MARKET"] = "market";
            Service["BLACK_MARKET"] = "black-market";
            Service["STOCK_EXCHANGE"] = "stock-exchange";
            Service["CLONING"] = "cloning";
            Service["SURGERY"] = "surgery";
            Service["DNA_THERAPY"] = "dna-therapy";
            Service["REPAIR_FACILITIES"] = "repair-facilities";
            Service["FACTORY"] = "factory";
            Service["LABRATORY"] = "labratory";
            Service["GAMBLING"] = "gambling";
            Service["FITTING"] = "fitting";
            Service["PAINTSHOP"] = "paintshop";
            Service["NEWS"] = "news";
            Service["STORAGE"] = "storage";
            Service["INSURANCE"] = "insurance";
            Service["DOCKING"] = "docking";
            Service["OFFICE_RENTAL"] = "office-rental";
            Service["JUMP_CLONE_FACILITY"] = "jump-clone-facility";
            Service["LOYALTY_POINT_STORE"] = "loyalty-point-store";
            Service["NAVY_OFFICES"] = "navy-offices";
            Service["SECURITY_OFFICES"] = "security-offices";
        })(Service = universe.Service || (universe.Service = {}));
    })(universe = esi.universe || (esi.universe = {}));
    let Language;
    (function (Language) {
        Language["DE"] = "de";
        Language["EN_US"] = "en-us";
        Language["FR"] = "fr";
        Language["JA"] = "ja";
        Language["RU"] = "ru";
        Language["ZH"] = "zh";
    })(Language = esi.Language || (esi.Language = {}));
    /**
     * Valid order range, numbers are ranges in jumps.
     */
    let OrderRange;
    (function (OrderRange) {
        OrderRange["STATION"] = "station";
        OrderRange["REGION"] = "region";
        OrderRange["SOLARSYSTEM"] = "solarsystem";
        OrderRange["V_1"] = "1";
        OrderRange["V_2"] = "2";
        OrderRange["V_3"] = "3";
        OrderRange["V_4"] = "4";
        OrderRange["V_5"] = "5";
        OrderRange["V_10"] = "10";
        OrderRange["V_20"] = "20";
        OrderRange["V_30"] = "30";
        OrderRange["V_40"] = "40";
    })(OrderRange = esi.OrderRange || (esi.OrderRange = {}));
    let Role;
    (function (Role) {
        Role["DIRECTOR"] = "Director";
        Role["PERSONNEL_MANAGER"] = "Personnel_Manager";
        Role["ACCOUNTANT"] = "Accountant";
        Role["SECURITY_OFFICER"] = "Security_Officer";
        Role["FACTORY_MANAGER"] = "Factory_Manager";
        Role["STATION_MANAGER"] = "Station_Manager";
        Role["AUDITOR"] = "Auditor";
        Role["HANGAR_TAKE_1"] = "Hangar_Take_1";
        Role["HANGAR_TAKE_2"] = "Hangar_Take_2";
        Role["HANGAR_TAKE_3"] = "Hangar_Take_3";
        Role["HANGAR_TAKE_4"] = "Hangar_Take_4";
        Role["HANGAR_TAKE_5"] = "Hangar_Take_5";
        Role["HANGAR_TAKE_6"] = "Hangar_Take_6";
        Role["HANGAR_TAKE_7"] = "Hangar_Take_7";
        Role["HANGAR_QUERY_1"] = "Hangar_Query_1";
        Role["HANGAR_QUERY_2"] = "Hangar_Query_2";
        Role["HANGAR_QUERY_3"] = "Hangar_Query_3";
        Role["HANGAR_QUERY_4"] = "Hangar_Query_4";
        Role["HANGAR_QUERY_5"] = "Hangar_Query_5";
        Role["HANGAR_QUERY_6"] = "Hangar_Query_6";
        Role["HANGAR_QUERY_7"] = "Hangar_Query_7";
        Role["ACCOUNT_TAKE_1"] = "Account_Take_1";
        Role["ACCOUNT_TAKE_2"] = "Account_Take_2";
        Role["ACCOUNT_TAKE_3"] = "Account_Take_3";
        Role["ACCOUNT_TAKE_4"] = "Account_Take_4";
        Role["ACCOUNT_TAKE_5"] = "Account_Take_5";
        Role["ACCOUNT_TAKE_6"] = "Account_Take_6";
        Role["ACCOUNT_TAKE_7"] = "Account_Take_7";
        Role["DIPLOMAT"] = "Diplomat";
        Role["CONFIG_EQUIPMENT"] = "Config_Equipment";
        Role["CONTAINER_TAKE_1"] = "Container_Take_1";
        Role["CONTAINER_TAKE_2"] = "Container_Take_2";
        Role["CONTAINER_TAKE_3"] = "Container_Take_3";
        Role["CONTAINER_TAKE_4"] = "Container_Take_4";
        Role["CONTAINER_TAKE_5"] = "Container_Take_5";
        Role["CONTAINER_TAKE_6"] = "Container_Take_6";
        Role["CONTAINER_TAKE_7"] = "Container_Take_7";
        Role["RENT_OFFICE"] = "Rent_Office";
        Role["RENT_FACTORY_FACILITY"] = "Rent_Factory_Facility";
        Role["RENT_RESEARCH_FACILITY"] = "Rent_Research_Facility";
        Role["JUNIOR_ACCOUNTANT"] = "Junior_Accountant";
        Role["CONFIG_STARBASE_EQUIPMENT"] = "Config_Starbase_Equipment";
        Role["TRADER"] = "Trader";
        Role["COMMUNICATIONS_OFFICER"] = "Communications_Officer";
        Role["CONTRACT_MANAGER"] = "Contract_Manager";
        Role["STARBASE_DEFENSE_OPERATOR"] = "Starbase_Defense_Operator";
        Role["STARBASE_FUEL_TECHNICIAN"] = "Starbase_Fuel_Technician";
        Role["FITTING_MANAGER"] = "Fitting_Manager";
        Role["TERRESTRIAL_COMBAT_OFFICER"] = "Terrestrial_Combat_Officer";
        Role["TERRESTRIAL_LOGISTICS_OFFICER"] = "Terrestrial_Logistics_Officer";
    })(Role = esi.Role || (esi.Role = {}));
    let SearchCategory;
    (function (SearchCategory) {
        SearchCategory["AGENT"] = "agent";
        SearchCategory["ALLIANCE"] = "alliance";
        SearchCategory["CHARACTER"] = "character";
        SearchCategory["CONSTELLATION"] = "constellation";
        SearchCategory["CORPORATION"] = "corporation";
        SearchCategory["FACTION"] = "faction";
        SearchCategory["INVENTORYTYPE"] = "inventorytype";
        SearchCategory["REGION"] = "region";
        SearchCategory["SOLARSYSTEM"] = "solarsystem";
        SearchCategory["STATION"] = "station";
        SearchCategory["WORMHOLE"] = "wormhole";
    })(SearchCategory = esi.SearchCategory || (esi.SearchCategory = {}));
})(esi = exports.esi || (exports.esi = {}));
exports.ROUTE_MAP = {
    get_alliances: { url: "/v1/alliances/", method: "GET" },
    get_alliances_alliance_id: { url: "/v2/alliances/{alliance_id}/", method: "GET" },
    get_alliances_alliance_id_corporations: { url: "/v1/alliances/{alliance_id}/corporations/", method: "GET" },
    get_alliances_alliance_id_icons: { url: "/v1/alliances/{alliance_id}/icons/", method: "GET" },
    get_alliances_names: { url: "/v1/alliances/names/", method: "GET" },
    get_characters_character_id_assets: { url: "/v1/characters/{character_id}/assets/", method: "GET" },
    get_characters_character_id_bookmarks: { url: "/v1/characters/{character_id}/bookmarks/", method: "GET" },
    get_characters_character_id_bookmarks_folders: { url: "/v1/characters/{character_id}/bookmarks/folders/", method: "GET" },
    get_characters_character_id_calendar: { url: "/v1/characters/{character_id}/calendar/", method: "GET" },
    get_characters_character_id_calendar_event_id: { url: "/v3/characters/{character_id}/calendar/{event_id}/", method: "GET" },
    put_characters_character_id_calendar_event_id: { url: "/v3/characters/{character_id}/calendar/{event_id}/", method: "PUT" },
    get_characters_character_id: { url: "/v4/characters/{character_id}/", method: "GET" },
    get_characters_character_id_agents_research: { url: "/v1/characters/{character_id}/agents_research/", method: "GET" },
    get_characters_character_id_blueprints: { url: "/v1/characters/{character_id}/blueprints/", method: "GET" },
    get_characters_character_id_chat_channels: { url: "/v1/characters/{character_id}/chat_channels/", method: "GET" },
    get_characters_character_id_corporationhistory: { url: "/v1/characters/{character_id}/corporationhistory/", method: "GET" },
    get_characters_character_id_medals: { url: "/v1/characters/{character_id}/medals/", method: "GET" },
    get_characters_character_id_portrait: { url: "/v2/characters/{character_id}/portrait/", method: "GET" },
    get_characters_character_id_roles: { url: "/v1/characters/{character_id}/roles/", method: "GET" },
    get_characters_character_id_standings: { url: "/v1/characters/{character_id}/standings/", method: "GET" },
    get_characters_names: { url: "/v1/characters/names/", method: "GET" },
    post_characters_affiliation: { url: "/v1/characters/affiliation/", method: "POST" },
    post_characters_character_id_cspa: { url: "/v3/characters/{character_id}/cspa/", method: "POST" },
    get_characters_character_id_clones: { url: "/v2/characters/{character_id}/clones/", method: "GET" },
    delete_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "DELETE" },
    get_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "GET" },
    get_characters_character_id_contacts_labels: { url: "/v1/characters/{character_id}/contacts/labels/", method: "GET" },
    post_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "POST" },
    put_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "PUT" },
    get_characters_character_id_contracts: { url: "/v1/characters/{character_id}/contracts/", method: "GET" },
    get_characters_character_id_contracts_contract_id_bids: { url: "/v1/characters/{character_id}/contracts/{contract_id}/bids/", method: "GET" },
    get_characters_character_id_contracts_contract_id_items: { url: "/v1/characters/{character_id}/contracts/{contract_id}/items/", method: "GET" },
    get_corporations_corporation_id: { url: "/v3/corporations/{corporation_id}/", method: "GET" },
    get_corporations_corporation_id_alliancehistory: { url: "/v1/corporations/{corporation_id}/alliancehistory/", method: "GET" },
    get_corporations_corporation_id_icons: { url: "/v1/corporations/{corporation_id}/icons/", method: "GET" },
    get_corporations_corporation_id_members: { url: "/v2/corporations/{corporation_id}/members/", method: "GET" },
    get_corporations_corporation_id_roles: { url: "/v1/corporations/{corporation_id}/roles/", method: "GET" },
    get_corporations_corporation_id_structures: { url: "/v1/corporations/{corporation_id}/structures/", method: "GET" },
    get_corporations_names: { url: "/v1/corporations/names/", method: "GET" },
    get_corporations_npccorps: { url: "/v1/corporations/npccorps/", method: "GET" },
    put_corporations_corporation_id_structures_structure_id: { url: "/v1/corporations/{corporation_id}/structures/{structure_id}/", method: "PUT" },
    get_dogma_attributes: { url: "/v1/dogma/attributes/", method: "GET" },
    get_dogma_attributes_attribute_id: { url: "/v1/dogma/attributes/{attribute_id}/", method: "GET" },
    get_dogma_effects: { url: "/v1/dogma/effects/", method: "GET" },
    get_dogma_effects_effect_id: { url: "/v1/dogma/effects/{effect_id}/", method: "GET" },
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
    get_markets_structures_structure_id: { url: "/v1/markets/structures/{structure_id}/", method: "GET" },
    get_characters_character_id_opportunities: { url: "/v1/characters/{character_id}/opportunities/", method: "GET" },
    get_opportunities_groups: { url: "/v1/opportunities/groups/", method: "GET" },
    get_opportunities_groups_group_id: { url: "/v1/opportunities/groups/{group_id}/", method: "GET" },
    get_opportunities_tasks: { url: "/v1/opportunities/tasks/", method: "GET" },
    get_opportunities_tasks_task_id: { url: "/v1/opportunities/tasks/{task_id}/", method: "GET" },
    get_characters_character_id_planets: { url: "/v1/characters/{character_id}/planets/", method: "GET" },
    get_characters_character_id_planets_planet_id: { url: "/v2/characters/{character_id}/planets/{planet_id}/", method: "GET" },
    get_universe_schematics_schematic_id: { url: "/v1/universe/schematics/{schematic_id}/", method: "GET" },
    get_route_origin_destination: { url: "/v1/route/{origin}/{destination}/", method: "GET" },
    get_characters_character_id_search: { url: "/v2/characters/{character_id}/search/", method: "GET" },
    get_search: { url: "/v1/search/", method: "GET" },
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
    get_universe_stations_station_id: { url: "/v2/universe/stations/{station_id}/", method: "GET" },
    get_universe_structures: { url: "/v1/universe/structures/", method: "GET" },
    get_universe_structures_structure_id: { url: "/v1/universe/structures/{structure_id}/", method: "GET" },
    get_universe_system_jumps: { url: "/v1/universe/system_jumps/", method: "GET" },
    get_universe_system_kills: { url: "/v1/universe/system_kills/", method: "GET" },
    get_universe_systems: { url: "/v1/universe/systems/", method: "GET" },
    get_universe_systems_system_id: { url: "/v2/universe/systems/{system_id}/", method: "GET" },
    get_universe_types: { url: "/v1/universe/types/", method: "GET" },
    get_universe_types_type_id: { url: "/v2/universe/types/{type_id}/", method: "GET" },
    post_universe_names: { url: "/v2/universe/names/", method: "POST" },
    post_ui_autopilot_waypoint: { url: "/v2/ui/autopilot/waypoint/", method: "POST" },
    post_ui_openwindow_contract: { url: "/v1/ui/openwindow/contract/", method: "POST" },
    post_ui_openwindow_information: { url: "/v1/ui/openwindow/information/", method: "POST" },
    post_ui_openwindow_marketdetails: { url: "/v1/ui/openwindow/marketdetails/", method: "POST" },
    post_ui_openwindow_newmail: { url: "/v1/ui/openwindow/newmail/", method: "POST" },
    get_characters_character_id_wallets: { url: "/v1/characters/{character_id}/wallets/", method: "GET" },
    get_characters_character_id_wallets_journal: { url: "/v1/characters/{character_id}/wallets/journal/", method: "GET" },
    get_wars: { url: "/v1/wars/", method: "GET" },
    get_wars_war_id: { url: "/v1/wars/{war_id}/", method: "GET" },
    get_wars_war_id_killmails: { url: "/v1/wars/{war_id}/killmails/", method: "GET" }
};
// Generated 164 types in monolithic namespace.
//# sourceMappingURL=esi.js.map