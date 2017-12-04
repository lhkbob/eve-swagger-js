"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This is a generated file, take caution when editing manually.
// Run `npm run gen:esi` to regenerate.
// Generated 220 types in monolithic namespace for ESI v0.7.0.
var esi;
(function (esi) {
    let character;
    (function (character) {
        let asset;
        (function (asset) {
            /**
             * Type of the location_id.
             */
            let LocationType;
            (function (LocationType) {
                LocationType["ASSET_SAFETY"] = "AssetSafety";
                LocationType["AUTO_FIT"] = "AutoFit";
                LocationType["CARGO"] = "Cargo";
                LocationType["CORPSE_BAY"] = "CorpseBay";
                LocationType["DELIVERIES"] = "Deliveries";
                LocationType["DRONE_BAY"] = "DroneBay";
                LocationType["FIGHTER_BAY"] = "FighterBay";
                LocationType["FIGHTER_TUBE_0"] = "FighterTube0";
                LocationType["FIGHTER_TUBE_1"] = "FighterTube1";
                LocationType["FIGHTER_TUBE_2"] = "FighterTube2";
                LocationType["FIGHTER_TUBE_3"] = "FighterTube3";
                LocationType["FIGHTER_TUBE_4"] = "FighterTube4";
                LocationType["FLEET_HANGAR"] = "FleetHangar";
                LocationType["HANGAR"] = "Hangar";
                LocationType["HANGAR_ALL"] = "HangarAll";
                LocationType["HI_SLOT_0"] = "HiSlot0";
                LocationType["HI_SLOT_1"] = "HiSlot1";
                LocationType["HI_SLOT_2"] = "HiSlot2";
                LocationType["HI_SLOT_3"] = "HiSlot3";
                LocationType["HI_SLOT_4"] = "HiSlot4";
                LocationType["HI_SLOT_5"] = "HiSlot5";
                LocationType["HI_SLOT_6"] = "HiSlot6";
                LocationType["HI_SLOT_7"] = "HiSlot7";
                LocationType["HIDDEN_MODIFIERS"] = "HiddenModifiers";
                LocationType["IMPLANT"] = "Implant";
                LocationType["LO_SLOT_0"] = "LoSlot0";
                LocationType["LO_SLOT_1"] = "LoSlot1";
                LocationType["LO_SLOT_2"] = "LoSlot2";
                LocationType["LO_SLOT_3"] = "LoSlot3";
                LocationType["LO_SLOT_4"] = "LoSlot4";
                LocationType["LO_SLOT_5"] = "LoSlot5";
                LocationType["LO_SLOT_6"] = "LoSlot6";
                LocationType["LO_SLOT_7"] = "LoSlot7";
                LocationType["LOCKED"] = "Locked";
                LocationType["MED_SLOT_0"] = "MedSlot0";
                LocationType["MED_SLOT_1"] = "MedSlot1";
                LocationType["MED_SLOT_2"] = "MedSlot2";
                LocationType["MED_SLOT_3"] = "MedSlot3";
                LocationType["MED_SLOT_4"] = "MedSlot4";
                LocationType["MED_SLOT_5"] = "MedSlot5";
                LocationType["MED_SLOT_6"] = "MedSlot6";
                LocationType["MED_SLOT_7"] = "MedSlot7";
                LocationType["MODULE"] = "Module";
                LocationType["QUAFE_BAY"] = "QuafeBay";
                LocationType["RIG_SLOT_0"] = "RigSlot0";
                LocationType["RIG_SLOT_1"] = "RigSlot1";
                LocationType["RIG_SLOT_2"] = "RigSlot2";
                LocationType["RIG_SLOT_3"] = "RigSlot3";
                LocationType["RIG_SLOT_4"] = "RigSlot4";
                LocationType["RIG_SLOT_5"] = "RigSlot5";
                LocationType["RIG_SLOT_6"] = "RigSlot6";
                LocationType["RIG_SLOT_7"] = "RigSlot7";
                LocationType["SHIP_HANGAR"] = "ShipHangar";
                LocationType["SPECIALIZED_AMMO_HOLD"] = "SpecializedAmmoHold";
                LocationType["SPECIALIZED_COMMAND_CENTER_HOLD"] = "SpecializedCommandCenterHold";
                LocationType["SPECIALIZED_FUEL_BAY"] = "SpecializedFuelBay";
                LocationType["SPECIALIZED_GAS_HOLD"] = "SpecializedGasHold";
                LocationType["SPECIALIZED_INDUSTRIAL_SHIP_HOLD"] = "SpecializedIndustrialShipHold";
                LocationType["SPECIALIZED_LARGE_SHIP_HOLD"] = "SpecializedLargeShipHold";
                LocationType["SPECIALIZED_MATERIAL_BAY"] = "SpecializedMaterialBay";
                LocationType["SPECIALIZED_MEDIUM_SHIP_HOLD"] = "SpecializedMediumShipHold";
                LocationType["SPECIALIZED_MINERAL_HOLD"] = "SpecializedMineralHold";
                LocationType["SPECIALIZED_ORE_HOLD"] = "SpecializedOreHold";
                LocationType["SPECIALIZED_PLANETARY_COMMODITIES_HOLD"] = "SpecializedPlanetaryCommoditiesHold";
                LocationType["SPECIALIZED_SALVAGE_HOLD"] = "SpecializedSalvageHold";
                LocationType["SPECIALIZED_SHIP_HOLD"] = "SpecializedShipHold";
                LocationType["SPECIALIZED_SMALL_SHIP_HOLD"] = "SpecializedSmallShipHold";
                LocationType["SUB_SYSTEM_BAY"] = "SubSystemBay";
                LocationType["SUB_SYSTEM_SLOT_0"] = "SubSystemSlot0";
                LocationType["SUB_SYSTEM_SLOT_1"] = "SubSystemSlot1";
                LocationType["SUB_SYSTEM_SLOT_2"] = "SubSystemSlot2";
                LocationType["SUB_SYSTEM_SLOT_3"] = "SubSystemSlot3";
                LocationType["SUB_SYSTEM_SLOT_4"] = "SubSystemSlot4";
                LocationType["SUB_SYSTEM_SLOT_5"] = "SubSystemSlot5";
                LocationType["SUB_SYSTEM_SLOT_6"] = "SubSystemSlot6";
                LocationType["SUB_SYSTEM_SLOT_7"] = "SubSystemSlot7";
                LocationType["UNLOCKED"] = "Unlocked";
                LocationType["WARDROBE"] = "Wardrobe";
            })(LocationType = asset.LocationType || (asset.LocationType = {}));
        })(asset = character.asset || (character.asset = {}));
        let calendar;
        (function (calendar) {
            let OwnerType;
            (function (OwnerType) {
                OwnerType["ALLIANCE"] = "alliance";
                OwnerType["CHARACTER"] = "character";
                OwnerType["CORPORATION"] = "corporation";
                OwnerType["EVE_SERVER"] = "eve_server";
                OwnerType["FACTION"] = "faction";
            })(OwnerType = calendar.OwnerType || (calendar.OwnerType = {}));
            let ResponseState;
            (function (ResponseState) {
                ResponseState["ACCEPTED"] = "accepted";
                ResponseState["DECLINED"] = "declined";
                ResponseState["NOT_RESPONDED"] = "not_responded";
                ResponseState["TENTATIVE"] = "tentative";
            })(ResponseState = calendar.ResponseState || (calendar.ResponseState = {}));
        })(calendar = character.calendar || (character.calendar = {}));
        let mail;
        (function (mail) {
            /**
             * Hexadecimal string representing label color, in RGB format.
             */
            let Color;
            (function (Color) {
                Color["C_0000FE"] = "#0000fe";
                Color["C_006634"] = "#006634";
                Color["C_0099FF"] = "#0099ff";
                Color["C_00FF33"] = "#00ff33";
                Color["C_01FFFF"] = "#01ffff";
                Color["C_349800"] = "#349800";
                Color["C_660066"] = "#660066";
                Color["C_666666"] = "#666666";
                Color["C_999999"] = "#999999";
                Color["C_99FFFF"] = "#99ffff";
                Color["C_9A0000"] = "#9a0000";
                Color["C_CCFF9A"] = "#ccff9a";
                Color["C_E6E6E6"] = "#e6e6e6";
                Color["C_FE0000"] = "#fe0000";
                Color["C_FF6600"] = "#ff6600";
                Color["C_FFFF01"] = "#ffff01";
                Color["C_FFFFCD"] = "#ffffcd";
                Color["C_FFFFFF"] = "#ffffff";
            })(Color = mail.Color || (mail.Color = {}));
            let RecipientType;
            (function (RecipientType) {
                RecipientType["ALLIANCE"] = "alliance";
                RecipientType["CHARACTER"] = "character";
                RecipientType["CORPORATION"] = "corporation";
                RecipientType["MAILING_LIST"] = "mailing_list";
            })(RecipientType = mail.RecipientType || (mail.RecipientType = {}));
        })(mail = character.mail || (character.mail = {}));
        let notification;
        (function (notification) {
            let SenderType;
            (function (SenderType) {
                SenderType["ALLIANCE"] = "alliance";
                SenderType["CHARACTER"] = "character";
                SenderType["CORPORATION"] = "corporation";
                SenderType["FACTION"] = "faction";
                SenderType["OTHER"] = "other";
            })(SenderType = notification.SenderType || (notification.SenderType = {}));
            let Type;
            (function (Type) {
                Type["ACCEPTED_ALLY"] = "AcceptedAlly";
                Type["ACCEPTED_SURRENDER"] = "AcceptedSurrender";
                Type["ALL_ANCHORING_MSG"] = "AllAnchoringMsg";
                Type["ALL_MAINTENANCE_BILL_MSG"] = "AllMaintenanceBillMsg";
                Type["ALL_STRUC_INVULNERABLE_MSG"] = "AllStrucInvulnerableMsg";
                Type["ALL_STRUCT_VULNERABLE_MSG"] = "AllStructVulnerableMsg";
                Type["ALL_WAR_CORP_JOINED_ALLIANCE_MSG"] = "AllWarCorpJoinedAllianceMsg";
                Type["ALL_WAR_DECLARED_MSG"] = "AllWarDeclaredMsg";
                Type["ALL_WAR_INVALIDATED_MSG"] = "AllWarInvalidatedMsg";
                Type["ALL_WAR_RETRACTED_MSG"] = "AllWarRetractedMsg";
                Type["ALL_WAR_SURRENDER_MSG"] = "AllWarSurrenderMsg";
                Type["ALLIANCE_CAPITAL_CHANGED"] = "AllianceCapitalChanged";
                Type["ALLY_CONTRACT_CANCELLED"] = "AllyContractCancelled";
                Type["ALLY_JOINED_WAR_AGGRESSOR_MSG"] = "AllyJoinedWarAggressorMsg";
                Type["ALLY_JOINED_WAR_ALLY_MSG"] = "AllyJoinedWarAllyMsg";
                Type["ALLY_JOINED_WAR_DEFENDER_MSG"] = "AllyJoinedWarDefenderMsg";
                Type["BATTLE_PUNISH_FRIENDLY_FIRE"] = "BattlePunishFriendlyFire";
                Type["BILL_OUT_OF_MONEY_MSG"] = "BillOutOfMoneyMsg";
                Type["BILL_PAID_CORP_ALL_MSG"] = "BillPaidCorpAllMsg";
                Type["BOUNTY_CLAIM_MSG"] = "BountyClaimMsg";
                Type["BOUNTY_ESSSHARED"] = "BountyESSShared";
                Type["BOUNTY_ESSTAKEN"] = "BountyESSTaken";
                Type["BOUNTY_PLACED_ALLIANCE"] = "BountyPlacedAlliance";
                Type["BOUNTY_PLACED_CHAR"] = "BountyPlacedChar";
                Type["BOUNTY_PLACED_CORP"] = "BountyPlacedCorp";
                Type["BOUNTY_YOUR_BOUNTY_CLAIMED"] = "BountyYourBountyClaimed";
                Type["BUDDY_CONNECT_CONTACT_ADD"] = "BuddyConnectContactAdd";
                Type["CHAR_APP_ACCEPT_MSG"] = "CharAppAcceptMsg";
                Type["CHAR_APP_REJECT_MSG"] = "CharAppRejectMsg";
                Type["CHAR_APP_WITHDRAW_MSG"] = "CharAppWithdrawMsg";
                Type["CHAR_LEFT_CORP_MSG"] = "CharLeftCorpMsg";
                Type["CHAR_MEDAL_MSG"] = "CharMedalMsg";
                Type["CHAR_TERMINATION_MSG"] = "CharTerminationMsg";
                Type["CLONE_ACTIVATION_MSG"] = "CloneActivationMsg";
                Type["CLONE_ACTIVATION_MSG_2"] = "CloneActivationMsg2";
                Type["CLONE_MOVED_MSG"] = "CloneMovedMsg";
                Type["CLONE_REVOKED_MSG_1"] = "CloneRevokedMsg1";
                Type["CLONE_REVOKED_MSG_2"] = "CloneRevokedMsg2";
                Type["CONTACT_ADD"] = "ContactAdd";
                Type["CONTACT_EDIT"] = "ContactEdit";
                Type["CONTAINER_PASSWORD_MSG"] = "ContainerPasswordMsg";
                Type["CORP_ALL_BILL_MSG"] = "CorpAllBillMsg";
                Type["CORP_APP_ACCEPT_MSG"] = "CorpAppAcceptMsg";
                Type["CORP_APP_INVITED_MSG"] = "CorpAppInvitedMsg";
                Type["CORP_APP_NEW_MSG"] = "CorpAppNewMsg";
                Type["CORP_APP_REJECT_CUSTOM_MSG"] = "CorpAppRejectCustomMsg";
                Type["CORP_APP_REJECT_MSG"] = "CorpAppRejectMsg";
                Type["CORP_DIVIDEND_MSG"] = "CorpDividendMsg";
                Type["CORP_FRIENDLY_FIRE_DISABLE_TIMER_COMPLETED"] = "CorpFriendlyFireDisableTimerCompleted";
                Type["CORP_FRIENDLY_FIRE_DISABLE_TIMER_STARTED"] = "CorpFriendlyFireDisableTimerStarted";
                Type["CORP_FRIENDLY_FIRE_ENABLE_TIMER_COMPLETED"] = "CorpFriendlyFireEnableTimerCompleted";
                Type["CORP_FRIENDLY_FIRE_ENABLE_TIMER_STARTED"] = "CorpFriendlyFireEnableTimerStarted";
                Type["CORP_KICKED"] = "CorpKicked";
                Type["CORP_LIQUIDATION_MSG"] = "CorpLiquidationMsg";
                Type["CORP_NEW_CEOMSG"] = "CorpNewCEOMsg";
                Type["CORP_NEWS_MSG"] = "CorpNewsMsg";
                Type["CORP_OFFICE_EXPIRATION_MSG"] = "CorpOfficeExpirationMsg";
                Type["CORP_STRUCT_LOST_MSG"] = "CorpStructLostMsg";
                Type["CORP_TAX_CHANGE_MSG"] = "CorpTaxChangeMsg";
                Type["CORP_VOTE_CEOREVOKED_MSG"] = "CorpVoteCEORevokedMsg";
                Type["CORP_VOTE_MSG"] = "CorpVoteMsg";
                Type["CORP_WAR_DECLARED_MSG"] = "CorpWarDeclaredMsg";
                Type["CORP_WAR_FIGHTING_LEGAL_MSG"] = "CorpWarFightingLegalMsg";
                Type["CORP_WAR_INVALIDATED_MSG"] = "CorpWarInvalidatedMsg";
                Type["CORP_WAR_RETRACTED_MSG"] = "CorpWarRetractedMsg";
                Type["CORP_WAR_SURRENDER_MSG"] = "CorpWarSurrenderMsg";
                Type["CUSTOMS_MSG"] = "CustomsMsg";
                Type["DECLARE_WAR"] = "DeclareWar";
                Type["DISTRICT_ATTACKED"] = "DistrictAttacked";
                Type["DUST_APP_ACCEPTED_MSG"] = "DustAppAcceptedMsg";
                Type["ENTOSIS_CAPTURE_STARTED"] = "EntosisCaptureStarted";
                Type["FAC_WAR_CORP_JOIN_REQUEST_MSG"] = "FacWarCorpJoinRequestMsg";
                Type["FAC_WAR_CORP_JOIN_WITHDRAW_MSG"] = "FacWarCorpJoinWithdrawMsg";
                Type["FAC_WAR_CORP_LEAVE_REQUEST_MSG"] = "FacWarCorpLeaveRequestMsg";
                Type["FAC_WAR_CORP_LEAVE_WITHDRAW_MSG"] = "FacWarCorpLeaveWithdrawMsg";
                Type["FAC_WAR_LPDISQUALIFIED_EVENT"] = "FacWarLPDisqualifiedEvent";
                Type["FAC_WAR_LPDISQUALIFIED_KILL"] = "FacWarLPDisqualifiedKill";
                Type["FAC_WAR_LPPAYOUT_EVENT"] = "FacWarLPPayoutEvent";
                Type["FAC_WAR_LPPAYOUT_KILL"] = "FacWarLPPayoutKill";
                Type["FWALLIANCE_KICK_MSG"] = "FWAllianceKickMsg";
                Type["FWALLIANCE_WARNING_MSG"] = "FWAllianceWarningMsg";
                Type["FWCHAR_KICK_MSG"] = "FWCharKickMsg";
                Type["FWCHAR_RANK_GAIN_MSG"] = "FWCharRankGainMsg";
                Type["FWCHAR_RANK_LOSS_MSG"] = "FWCharRankLossMsg";
                Type["FWCHAR_WARNING_MSG"] = "FWCharWarningMsg";
                Type["FWCORP_JOIN_MSG"] = "FWCorpJoinMsg";
                Type["FWCORP_KICK_MSG"] = "FWCorpKickMsg";
                Type["FWCORP_LEAVE_MSG"] = "FWCorpLeaveMsg";
                Type["FWCORP_WARNING_MSG"] = "FWCorpWarningMsg";
                Type["GAME_TIME_ADDED"] = "GameTimeAdded";
                Type["GAME_TIME_RECEIVED"] = "GameTimeReceived";
                Type["GAME_TIME_SENT"] = "GameTimeSent";
                Type["GIFT_RECEIVED"] = "GiftReceived";
                Type["IHUB_DESTROYED_BY_BILL_FAILURE"] = "IHubDestroyedByBillFailure";
                Type["INCURSION_COMPLETED_MSG"] = "IncursionCompletedMsg";
                Type["INDUSTRY_TEAM_AUCTION_LOST"] = "IndustryTeamAuctionLost";
                Type["INDUSTRY_TEAM_AUCTION_WON"] = "IndustryTeamAuctionWon";
                Type["INFRASTRUCTURE_HUB_BILL_ABOUT_TO_EXPIRE"] = "InfrastructureHubBillAboutToExpire";
                Type["INSURANCE_EXPIRATION_MSG"] = "InsuranceExpirationMsg";
                Type["INSURANCE_FIRST_SHIP_MSG"] = "InsuranceFirstShipMsg";
                Type["INSURANCE_INVALIDATED_MSG"] = "InsuranceInvalidatedMsg";
                Type["INSURANCE_ISSUED_MSG"] = "InsuranceIssuedMsg";
                Type["INSURANCE_PAYOUT_MSG"] = "InsurancePayoutMsg";
                Type["JUMP_CLONE_DELETED_MSG_1"] = "JumpCloneDeletedMsg1";
                Type["JUMP_CLONE_DELETED_MSG_2"] = "JumpCloneDeletedMsg2";
                Type["KILL_REPORT_FINAL_BLOW"] = "KillReportFinalBlow";
                Type["KILL_REPORT_VICTIM"] = "KillReportVictim";
                Type["KILL_RIGHT_AVAILABLE"] = "KillRightAvailable";
                Type["KILL_RIGHT_AVAILABLE_OPEN"] = "KillRightAvailableOpen";
                Type["KILL_RIGHT_EARNED"] = "KillRightEarned";
                Type["KILL_RIGHT_UNAVAILABLE"] = "KillRightUnavailable";
                Type["KILL_RIGHT_UNAVAILABLE_OPEN"] = "KillRightUnavailableOpen";
                Type["KILL_RIGHT_USED"] = "KillRightUsed";
                Type["LOCATE_CHAR_MSG"] = "LocateCharMsg";
                Type["MADE_WAR_MUTUAL"] = "MadeWarMutual";
                Type["MERC_OFFERED_NEGOTIATION_MSG"] = "MercOfferedNegotiationMsg";
                Type["MISSION_OFFER_EXPIRATION_MSG"] = "MissionOfferExpirationMsg";
                Type["MISSION_TIMEOUT_MSG"] = "MissionTimeoutMsg";
                Type["MOONMINING_AUTOMATIC_FRACTURE"] = "MoonminingAutomaticFracture";
                Type["MOONMINING_EXTRACTION_CANCELLED"] = "MoonminingExtractionCancelled";
                Type["MOONMINING_EXTRACTION_FINISHED"] = "MoonminingExtractionFinished";
                Type["MOONMINING_LASER_FIRED"] = "MoonminingLaserFired";
                Type["NOTIFICATION_TYPE_MOONMINING_EXTRACTION_STARTED"] = "notificationTypeMoonminingExtractionStarted";
                Type["NPCSTANDINGS_GAINED"] = "NPCStandingsGained";
                Type["NPCSTANDINGS_LOST"] = "NPCStandingsLost";
                Type["OFFERED_SURRENDER"] = "OfferedSurrender";
                Type["OFFERED_TO_ALLY"] = "OfferedToAlly";
                Type["OLD_LSC_MESSAGES"] = "OldLscMessages";
                Type["OPERATION_FINISHED"] = "OperationFinished";
                Type["ORBITAL_ATTACKED"] = "OrbitalAttacked";
                Type["ORBITAL_REINFORCED"] = "OrbitalReinforced";
                Type["OWNERSHIP_TRANSFERRED"] = "OwnershipTransferred";
                Type["REIMBURSEMENT_MSG"] = "ReimbursementMsg";
                Type["RESEARCH_MISSION_AVAILABLE_MSG"] = "ResearchMissionAvailableMsg";
                Type["RETRACTS_WAR"] = "RetractsWar";
                Type["SEASONAL_CHALLENGE_COMPLETED"] = "SeasonalChallengeCompleted";
                Type["SOV_ALL_CLAIM_AQUIRED_MSG"] = "SovAllClaimAquiredMsg";
                Type["SOV_ALL_CLAIM_LOST_MSG"] = "SovAllClaimLostMsg";
                Type["SOV_COMMAND_NODE_EVENT_STARTED"] = "SovCommandNodeEventStarted";
                Type["SOV_CORP_BILL_LATE_MSG"] = "SovCorpBillLateMsg";
                Type["SOV_CORP_CLAIM_FAIL_MSG"] = "SovCorpClaimFailMsg";
                Type["SOV_DISRUPTOR_MSG"] = "SovDisruptorMsg";
                Type["SOV_STATION_ENTERED_FREEPORT"] = "SovStationEnteredFreeport";
                Type["SOV_STRUCTURE_DESTROYED"] = "SovStructureDestroyed";
                Type["SOV_STRUCTURE_REINFORCED"] = "SovStructureReinforced";
                Type["SOV_STRUCTURE_SELF_DESTRUCT_CANCEL"] = "SovStructureSelfDestructCancel";
                Type["SOV_STRUCTURE_SELF_DESTRUCT_FINISHED"] = "SovStructureSelfDestructFinished";
                Type["SOV_STRUCTURE_SELF_DESTRUCT_REQUESTED"] = "SovStructureSelfDestructRequested";
                Type["SOVEREIGNTY_IHDAMAGE_MSG"] = "SovereigntyIHDamageMsg";
                Type["SOVEREIGNTY_SBUDAMAGE_MSG"] = "SovereigntySBUDamageMsg";
                Type["SOVEREIGNTY_TCUDAMAGE_MSG"] = "SovereigntyTCUDamageMsg";
                Type["STATION_AGGRESSION_MSG_1"] = "StationAggressionMsg1";
                Type["STATION_AGGRESSION_MSG_2"] = "StationAggressionMsg2";
                Type["STATION_CONQUER_MSG"] = "StationConquerMsg";
                Type["STATION_SERVICE_DISABLED"] = "StationServiceDisabled";
                Type["STATION_SERVICE_ENABLED"] = "StationServiceEnabled";
                Type["STATION_STATE_CHANGE_MSG"] = "StationStateChangeMsg";
                Type["STORY_LINE_MISSION_AVAILABLE_MSG"] = "StoryLineMissionAvailableMsg";
                Type["STRUCTURE_ANCHORING"] = "StructureAnchoring";
                Type["STRUCTURE_COURIER_CONTRACT_CHANGED"] = "StructureCourierContractChanged";
                Type["STRUCTURE_DESTROYED"] = "StructureDestroyed";
                Type["STRUCTURE_FUEL_ALERT"] = "StructureFuelAlert";
                Type["STRUCTURE_ITEMS_DELIVERED"] = "StructureItemsDelivered";
                Type["STRUCTURE_LOST_ARMOR"] = "StructureLostArmor";
                Type["STRUCTURE_LOST_SHIELDS"] = "StructureLostShields";
                Type["STRUCTURE_ONLINE"] = "StructureOnline";
                Type["STRUCTURE_SERVICES_OFFLINE"] = "StructureServicesOffline";
                Type["STRUCTURE_UNANCHORING"] = "StructureUnanchoring";
                Type["STRUCTURE_UNDER_ATTACK"] = "StructureUnderAttack";
                Type["TOWER_ALERT_MSG"] = "TowerAlertMsg";
                Type["TOWER_RESOURCE_ALERT_MSG"] = "TowerResourceAlertMsg";
                Type["TRANSACTION_REVERSAL_MSG"] = "TransactionReversalMsg";
                Type["TUTORIAL_MSG"] = "TutorialMsg";
                Type["WAR_ALLY_OFFER_DECLINED_MSG"] = "WarAllyOfferDeclinedMsg";
                Type["WAR_SURRENDER_DECLINED_MSG"] = "WarSurrenderDeclinedMsg";
                Type["WAR_SURRENDER_OFFER_MSG"] = "WarSurrenderOfferMsg";
            })(Type = notification.Type || (notification.Type = {}));
        })(notification = character.notification || (character.notification = {}));
        let planetaryinteraction;
        (function (planetaryinteraction) {
            let PlanetType;
            (function (PlanetType) {
                PlanetType["BARREN"] = "barren";
                PlanetType["GAS"] = "gas";
                PlanetType["ICE"] = "ice";
                PlanetType["LAVA"] = "lava";
                PlanetType["OCEANIC"] = "oceanic";
                PlanetType["PLASMA"] = "plasma";
                PlanetType["STORM"] = "storm";
                PlanetType["TEMPERATE"] = "temperate";
            })(PlanetType = planetaryinteraction.PlanetType || (planetaryinteraction.PlanetType = {}));
        })(planetaryinteraction = character.planetaryinteraction || (character.planetaryinteraction = {}));
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
    let contract;
    (function (contract) {
        /**
         * To whom the contract is available.
         */
        let Availability;
        (function (Availability) {
            Availability["ALLIANCE"] = "alliance";
            Availability["CORPORATION"] = "corporation";
            Availability["PERSONAL"] = "personal";
            Availability["PUBLIC"] = "public";
        })(Availability = contract.Availability || (contract.Availability = {}));
        /**
         * Status of the the contract.
         */
        let Status;
        (function (Status) {
            Status["CANCELLED"] = "cancelled";
            Status["DELETED"] = "deleted";
            Status["FAILED"] = "failed";
            Status["FINISHED"] = "finished";
            Status["FINISHED_CONTRACTOR"] = "finished_contractor";
            Status["FINISHED_ISSUER"] = "finished_issuer";
            Status["IN_PROGRESS"] = "in_progress";
            Status["OUTSTANDING"] = "outstanding";
            Status["REJECTED"] = "rejected";
            Status["REVERSED"] = "reversed";
        })(Status = contract.Status || (contract.Status = {}));
        /**
         * Type of the contract.
         */
        let Type;
        (function (Type) {
            Type["AUCTION"] = "auction";
            Type["COURIER"] = "courier";
            Type["ITEM_EXCHANGE"] = "item_exchange";
            Type["LOAN"] = "loan";
            Type["UNKNOWN"] = "unknown";
        })(Type = contract.Type || (contract.Type = {}));
    })(contract = esi.contract || (esi.contract = {}));
    let corporation;
    (function (corporation) {
        let asset;
        (function (asset) {
            let Action;
            (function (Action) {
                Action["ADD"] = "add";
                Action["ASSEMBLE"] = "assemble";
                Action["CONFIGURE"] = "configure";
                Action["ENTER_PASSWORD"] = "enter_password";
                Action["LOCK"] = "lock";
                Action["MOVE"] = "move";
                Action["REPACKAGE"] = "repackage";
                Action["SET_NAME"] = "set_name";
                Action["SET_PASSWORD"] = "set_password";
                Action["UNLOCK"] = "unlock";
            })(Action = asset.Action || (asset.Action = {}));
            /**
             * Type of the location_id.
             */
            let LocationType;
            (function (LocationType) {
                LocationType["ASSET_SAFETY"] = "AssetSafety";
                LocationType["AUTO_FIT"] = "AutoFit";
                LocationType["BONUS"] = "Bonus";
                LocationType["BOOSTER"] = "Booster";
                LocationType["BOOSTER_BAY"] = "BoosterBay";
                LocationType["CAPSULE"] = "Capsule";
                LocationType["CARGO"] = "Cargo";
                LocationType["CORP_DELIVERIES"] = "CorpDeliveries";
                LocationType["CORP_SAG1"] = "CorpSAG1";
                LocationType["CORP_SAG2"] = "CorpSAG2";
                LocationType["CORP_SAG3"] = "CorpSAG3";
                LocationType["CORP_SAG4"] = "CorpSAG4";
                LocationType["CORP_SAG5"] = "CorpSAG5";
                LocationType["CORP_SAG6"] = "CorpSAG6";
                LocationType["CORP_SAG7"] = "CorpSAG7";
                LocationType["CRATE_LOOT"] = "CrateLoot";
                LocationType["DELIVERIES"] = "Deliveries";
                LocationType["DRONE_BAY"] = "DroneBay";
                LocationType["DUST_BATTLE"] = "DustBattle";
                LocationType["DUST_DATABANK"] = "DustDatabank";
                LocationType["FIGHTER_BAY"] = "FighterBay";
                LocationType["FIGHTER_TUBE_0"] = "FighterTube0";
                LocationType["FIGHTER_TUBE_1"] = "FighterTube1";
                LocationType["FIGHTER_TUBE_2"] = "FighterTube2";
                LocationType["FIGHTER_TUBE_3"] = "FighterTube3";
                LocationType["FIGHTER_TUBE_4"] = "FighterTube4";
                LocationType["FLEET_HANGAR"] = "FleetHangar";
                LocationType["HANGAR"] = "Hangar";
                LocationType["HANGAR_ALL"] = "HangarAll";
                LocationType["HI_SLOT_0"] = "HiSlot0";
                LocationType["HI_SLOT_1"] = "HiSlot1";
                LocationType["HI_SLOT_2"] = "HiSlot2";
                LocationType["HI_SLOT_3"] = "HiSlot3";
                LocationType["HI_SLOT_4"] = "HiSlot4";
                LocationType["HI_SLOT_5"] = "HiSlot5";
                LocationType["HI_SLOT_6"] = "HiSlot6";
                LocationType["HI_SLOT_7"] = "HiSlot7";
                LocationType["HIDDEN_MODIFERS"] = "HiddenModifers";
                LocationType["IMPLANT"] = "Implant";
                LocationType["IMPOUNDED"] = "Impounded";
                LocationType["JUNKYARD_REPROCESSED"] = "JunkyardReprocessed";
                LocationType["JUNKYARD_TRASHED"] = "JunkyardTrashed";
                LocationType["LO_SLOT_0"] = "LoSlot0";
                LocationType["LO_SLOT_1"] = "LoSlot1";
                LocationType["LO_SLOT_2"] = "LoSlot2";
                LocationType["LO_SLOT_3"] = "LoSlot3";
                LocationType["LO_SLOT_4"] = "LoSlot4";
                LocationType["LO_SLOT_5"] = "LoSlot5";
                LocationType["LO_SLOT_6"] = "LoSlot6";
                LocationType["LO_SLOT_7"] = "LoSlot7";
                LocationType["LOCKED"] = "Locked";
                LocationType["MED_SLOT_0"] = "MedSlot0";
                LocationType["MED_SLOT_1"] = "MedSlot1";
                LocationType["MED_SLOT_2"] = "MedSlot2";
                LocationType["MED_SLOT_3"] = "MedSlot3";
                LocationType["MED_SLOT_4"] = "MedSlot4";
                LocationType["MED_SLOT_5"] = "MedSlot5";
                LocationType["MED_SLOT_6"] = "MedSlot6";
                LocationType["MED_SLOT_7"] = "MedSlot7";
                LocationType["OFFICE_FOLDER"] = "OfficeFolder";
                LocationType["PILOT"] = "Pilot";
                LocationType["PLANET_SURFACE"] = "PlanetSurface";
                LocationType["QUAFE_BAY"] = "QuafeBay";
                LocationType["REWARD"] = "Reward";
                LocationType["RIG_SLOT_0"] = "RigSlot0";
                LocationType["RIG_SLOT_1"] = "RigSlot1";
                LocationType["RIG_SLOT_2"] = "RigSlot2";
                LocationType["RIG_SLOT_3"] = "RigSlot3";
                LocationType["RIG_SLOT_4"] = "RigSlot4";
                LocationType["RIG_SLOT_5"] = "RigSlot5";
                LocationType["RIG_SLOT_6"] = "RigSlot6";
                LocationType["RIG_SLOT_7"] = "RigSlot7";
                LocationType["SECONDARY_STORAGE"] = "SecondaryStorage";
                LocationType["SERVICE_SLOT_0"] = "ServiceSlot0";
                LocationType["SERVICE_SLOT_1"] = "ServiceSlot1";
                LocationType["SERVICE_SLOT_2"] = "ServiceSlot2";
                LocationType["SERVICE_SLOT_3"] = "ServiceSlot3";
                LocationType["SERVICE_SLOT_4"] = "ServiceSlot4";
                LocationType["SERVICE_SLOT_5"] = "ServiceSlot5";
                LocationType["SERVICE_SLOT_6"] = "ServiceSlot6";
                LocationType["SERVICE_SLOT_7"] = "ServiceSlot7";
                LocationType["SHIP_HANGAR"] = "ShipHangar";
                LocationType["SHIP_OFFLINE"] = "ShipOffline";
                LocationType["SKILL"] = "Skill";
                LocationType["SKILL_IN_TRAINING"] = "SkillInTraining";
                LocationType["SPECIALIZED_AMMO_HOLD"] = "SpecializedAmmoHold";
                LocationType["SPECIALIZED_COMMAND_CENTER_HOLD"] = "SpecializedCommandCenterHold";
                LocationType["SPECIALIZED_FUEL_BAY"] = "SpecializedFuelBay";
                LocationType["SPECIALIZED_GAS_HOLD"] = "SpecializedGasHold";
                LocationType["SPECIALIZED_INDUSTRIAL_SHIP_HOLD"] = "SpecializedIndustrialShipHold";
                LocationType["SPECIALIZED_LARGE_SHIP_HOLD"] = "SpecializedLargeShipHold";
                LocationType["SPECIALIZED_MATERIAL_BAY"] = "SpecializedMaterialBay";
                LocationType["SPECIALIZED_MEDIUM_SHIP_HOLD"] = "SpecializedMediumShipHold";
                LocationType["SPECIALIZED_MINERAL_HOLD"] = "SpecializedMineralHold";
                LocationType["SPECIALIZED_ORE_HOLD"] = "SpecializedOreHold";
                LocationType["SPECIALIZED_PLANETARY_COMMODITIES_HOLD"] = "SpecializedPlanetaryCommoditiesHold";
                LocationType["SPECIALIZED_SALVAGE_HOLD"] = "SpecializedSalvageHold";
                LocationType["SPECIALIZED_SHIP_HOLD"] = "SpecializedShipHold";
                LocationType["SPECIALIZED_SMALL_SHIP_HOLD"] = "SpecializedSmallShipHold";
                LocationType["STRUCTURE_ACTIVE"] = "StructureActive";
                LocationType["STRUCTURE_FUEL"] = "StructureFuel";
                LocationType["STRUCTURE_INACTIVE"] = "StructureInactive";
                LocationType["STRUCTURE_OFFLINE"] = "StructureOffline";
                LocationType["SUB_SYSTEM_SLOT_0"] = "SubSystemSlot0";
                LocationType["SUB_SYSTEM_SLOT_1"] = "SubSystemSlot1";
                LocationType["SUB_SYSTEM_SLOT_2"] = "SubSystemSlot2";
                LocationType["SUB_SYSTEM_SLOT_3"] = "SubSystemSlot3";
                LocationType["SUB_SYSTEM_SLOT_4"] = "SubSystemSlot4";
                LocationType["SUB_SYSTEM_SLOT_5"] = "SubSystemSlot5";
                LocationType["SUB_SYSTEM_SLOT_6"] = "SubSystemSlot6";
                LocationType["SUB_SYSTEM_SLOT_7"] = "SubSystemSlot7";
                LocationType["SUBSYSTEM_BAY"] = "SubsystemBay";
                LocationType["UNLOCKED"] = "Unlocked";
                LocationType["WALLET"] = "Wallet";
                LocationType["WARDROBE"] = "Wardrobe";
            })(LocationType = asset.LocationType || (asset.LocationType = {}));
        })(asset = corporation.asset || (corporation.asset = {}));
        let structure;
        (function (structure) {
            let SecurityRole;
            (function (SecurityRole) {
                SecurityRole["ALLIANCE_MEMBER"] = "alliance_member";
                SecurityRole["CONFIG_STARBASE_EQUIPMENT_ROLE"] = "config_starbase_equipment_role";
                SecurityRole["CORPORATION_MEMBER"] = "corporation_member";
                SecurityRole["STARBASE_FUEL_TECHNICIAN_ROLE"] = "starbase_fuel_technician_role";
            })(SecurityRole = structure.SecurityRole || (structure.SecurityRole = {}));
            /**
             * Access is allowed only for entities with this level of standing or better.
             */
            let StandingLevel;
            (function (StandingLevel) {
                StandingLevel["BAD"] = "bad";
                StandingLevel["EXCELLENT"] = "excellent";
                StandingLevel["GOOD"] = "good";
                StandingLevel["NEUTRAL"] = "neutral";
                StandingLevel["TERRIBLE"] = "terrible";
            })(StandingLevel = structure.StandingLevel || (structure.StandingLevel = {}));
            let State;
            (function (State) {
                State["OFFLINE"] = "offline";
                State["ONLINE"] = "online";
                State["ONLINING"] = "onlining";
                State["REINFORCED"] = "reinforced";
                State["UNANCHORING"] = "unanchoring";
            })(State = structure.State || (structure.State = {}));
        })(structure = corporation.structure || (corporation.structure = {}));
        let Faction;
        (function (Faction) {
            Faction["AMARR"] = "Amarr";
            Faction["CALDARI"] = "Caldari";
            Faction["GALLENTE"] = "Gallente";
            Faction["MINMATAR"] = "Minmatar";
        })(Faction = corporation.Faction || (corporation.Faction = {}));
        let RoleType;
        (function (RoleType) {
            RoleType["GRANTABLE_ROLES"] = "grantable_roles";
            RoleType["GRANTABLE_ROLES_AT_BASE"] = "grantable_roles_at_base";
            RoleType["GRANTABLE_ROLES_AT_HQ"] = "grantable_roles_at_hq";
            RoleType["GRANTABLE_ROLES_AT_OTHER"] = "grantable_roles_at_other";
            RoleType["ROLES"] = "roles";
            RoleType["ROLES_AT_BASE"] = "roles_at_base";
            RoleType["ROLES_AT_HQ"] = "roles_at_hq";
            RoleType["ROLES_AT_OTHER"] = "roles_at_other";
        })(RoleType = corporation.RoleType || (corporation.RoleType = {}));
    })(corporation = esi.corporation || (esi.corporation = {}));
    let fleet;
    (function (fleet) {
        let Role;
        (function (Role) {
            Role["FLEET_COMMANDER"] = "fleet_commander";
            Role["SQUAD_COMMANDER"] = "squad_commander";
            Role["SQUAD_MEMBER"] = "squad_member";
            Role["WING_COMMANDER"] = "wing_commander";
        })(Role = fleet.Role || (fleet.Role = {}));
    })(fleet = esi.fleet || (esi.fleet = {}));
    let industry;
    (function (industry) {
        let Activity;
        (function (Activity) {
            Activity["COPYING"] = "copying";
            Activity["DUPLICATING"] = "duplicating";
            Activity["INVENTION"] = "invention";
            Activity["MANUFACTURING"] = "manufacturing";
            Activity["NONE"] = "none";
            Activity["REACTION"] = "reaction";
            Activity["RESEARCHING_MATERIAL_EFFICIENCY"] = "researching_material_efficiency";
            Activity["RESEARCHING_TECHNOLOGY"] = "researching_technology";
            Activity["RESEARCHING_TIME_EFFICIENCY"] = "researching_time_efficiency";
            Activity["REVERSE_ENGINEERING"] = "reverse_engineering";
        })(Activity = industry.Activity || (industry.Activity = {}));
        let JobStatus;
        (function (JobStatus) {
            JobStatus["ACTIVE"] = "active";
            JobStatus["CANCELLED"] = "cancelled";
            JobStatus["DELIVERED"] = "delivered";
            JobStatus["PAUSED"] = "paused";
            JobStatus["READY"] = "ready";
            JobStatus["REVERTED"] = "reverted";
        })(JobStatus = industry.JobStatus || (industry.JobStatus = {}));
    })(industry = esi.industry || (esi.industry = {}));
    let market;
    (function (market) {
        /**
         * Valid order range, numbers are ranges in jumps.
         */
        let OrderRange;
        (function (OrderRange) {
            OrderRange["REGION"] = "region";
            OrderRange["SOLARSYSTEM"] = "solarsystem";
            OrderRange["STATION"] = "station";
            OrderRange["V_1"] = "1";
            OrderRange["V_10"] = "10";
            OrderRange["V_2"] = "2";
            OrderRange["V_20"] = "20";
            OrderRange["V_3"] = "3";
            OrderRange["V_30"] = "30";
            OrderRange["V_4"] = "4";
            OrderRange["V_40"] = "40";
            OrderRange["V_5"] = "5";
        })(OrderRange = market.OrderRange || (market.OrderRange = {}));
        /**
         * Current order state.
         */
        let OrderState;
        (function (OrderState) {
            OrderState["CANCELLED"] = "cancelled";
            OrderState["CHARACTER_DELETED"] = "character_deleted";
            OrderState["CLOSED"] = "closed";
            OrderState["EXPIRED"] = "expired";
            OrderState["OPEN"] = "open";
            OrderState["PENDING"] = "pending";
        })(OrderState = market.OrderState || (market.OrderState = {}));
    })(market = esi.market || (esi.market = {}));
    let sovereignty;
    (function (sovereignty) {
        /**
         * Type of event this campaign is for. tcu_defense, ihub_defense and station_defense are referred to as "Defense Events", station_freeport as "Freeport Events".
         */
        let EventType;
        (function (EventType) {
            EventType["IHUB_DEFENSE"] = "ihub_defense";
            EventType["STATION_DEFENSE"] = "station_defense";
            EventType["STATION_FREEPORT"] = "station_freeport";
            EventType["TCU_DEFENSE"] = "tcu_defense";
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
            Service["ASSASINATION_MISSIONS"] = "assasination-missions";
            Service["BLACK_MARKET"] = "black-market";
            Service["BOUNTY_MISSIONS"] = "bounty-missions";
            Service["CLONING"] = "cloning";
            Service["COURIER_MISSIONS"] = "courier-missions";
            Service["DNA_THERAPY"] = "dna-therapy";
            Service["DOCKING"] = "docking";
            Service["FACTORY"] = "factory";
            Service["FITTING"] = "fitting";
            Service["GAMBLING"] = "gambling";
            Service["INSURANCE"] = "insurance";
            Service["INTERBUS"] = "interbus";
            Service["JUMP_CLONE_FACILITY"] = "jump-clone-facility";
            Service["LABRATORY"] = "labratory";
            Service["LOYALTY_POINT_STORE"] = "loyalty-point-store";
            Service["MARKET"] = "market";
            Service["NAVY_OFFICES"] = "navy-offices";
            Service["NEWS"] = "news";
            Service["OFFICE_RENTAL"] = "office-rental";
            Service["PAINTSHOP"] = "paintshop";
            Service["REFINERY"] = "refinery";
            Service["REPAIR_FACILITIES"] = "repair-facilities";
            Service["REPROCESSING_PLANT"] = "reprocessing-plant";
            Service["SECURITY_OFFICES"] = "security-offices";
            Service["STOCK_EXCHANGE"] = "stock-exchange";
            Service["STORAGE"] = "storage";
            Service["SURGERY"] = "surgery";
        })(Service = universe.Service || (universe.Service = {}));
        let SpectralClass;
        (function (SpectralClass) {
            SpectralClass["A0"] = "A0";
            SpectralClass["A0IV"] = "A0IV";
            SpectralClass["A0IV2"] = "A0IV2";
            SpectralClass["F0IV"] = "F0 IV";
            SpectralClass["F0V"] = "F0 V";
            SpectralClass["F0VI"] = "F0 VI";
            SpectralClass["F1IV"] = "F1 IV";
            SpectralClass["F1V"] = "F1 V";
            SpectralClass["F1VI"] = "F1 VI";
            SpectralClass["F2IV"] = "F2 IV";
            SpectralClass["F2V"] = "F2 V";
            SpectralClass["F2VI"] = "F2 VI";
            SpectralClass["F3IV"] = "F3 IV";
            SpectralClass["F3V"] = "F3 V";
            SpectralClass["F3VI"] = "F3 VI";
            SpectralClass["F4IV"] = "F4 IV";
            SpectralClass["F4V"] = "F4 V";
            SpectralClass["F4VI"] = "F4 VI";
            SpectralClass["F5IV"] = "F5 IV";
            SpectralClass["F5V"] = "F5 V";
            SpectralClass["F5VI"] = "F5 VI";
            SpectralClass["F6IV"] = "F6 IV";
            SpectralClass["F6V"] = "F6 V";
            SpectralClass["F6VI"] = "F6 VI";
            SpectralClass["F7V"] = "F7 V";
            SpectralClass["F7VI"] = "F7 VI";
            SpectralClass["F8V"] = "F8 V";
            SpectralClass["F8VI"] = "F8 VI";
            SpectralClass["F9IV"] = "F9 IV";
            SpectralClass["F9V"] = "F9 V";
            SpectralClass["F9VI"] = "F9 VI";
            SpectralClass["G0IV"] = "G0 IV";
            SpectralClass["G0V"] = "G0 V";
            SpectralClass["G0VI"] = "G0 VI";
            SpectralClass["G1IV"] = "G1 IV";
            SpectralClass["G1V"] = "G1 V";
            SpectralClass["G1VI"] = "G1 VI";
            SpectralClass["G2IV"] = "G2 IV";
            SpectralClass["G2V"] = "G2 V";
            SpectralClass["G2VI"] = "G2 VI";
            SpectralClass["G3IV"] = "G3 IV";
            SpectralClass["G3V"] = "G3 V";
            SpectralClass["G3VI"] = "G3 VI";
            SpectralClass["G4IV"] = "G4 IV";
            SpectralClass["G4V"] = "G4 V";
            SpectralClass["G4VI"] = "G4 VI";
            SpectralClass["G5IV"] = "G5 IV";
            SpectralClass["G5V"] = "G5 V";
            SpectralClass["G5VI"] = "G5 VI";
            SpectralClass["G6V"] = "G6 V";
            SpectralClass["G6VI"] = "G6 VI";
            SpectralClass["G7IV"] = "G7 IV";
            SpectralClass["G7V"] = "G7 V";
            SpectralClass["G7VI"] = "G7 VI";
            SpectralClass["G8IV"] = "G8 IV";
            SpectralClass["G8V"] = "G8 V";
            SpectralClass["G8VI"] = "G8 VI";
            SpectralClass["G9V"] = "G9 V";
            SpectralClass["G9VI"] = "G9 VI";
            SpectralClass["K0IV"] = "K0 IV";
            SpectralClass["K0V"] = "K0 V";
            SpectralClass["K1IV"] = "K1 IV";
            SpectralClass["K1V"] = "K1 V";
            SpectralClass["K2IV"] = "K2 IV";
            SpectralClass["K2V"] = "K2 V";
            SpectralClass["K3IV"] = "K3 IV";
            SpectralClass["K3V"] = "K3 V";
            SpectralClass["K4IV"] = "K4 IV";
            SpectralClass["K4V"] = "K4 V";
            SpectralClass["K5IV"] = "K5 IV";
            SpectralClass["K5V"] = "K5 V";
            SpectralClass["K6IV"] = "K6 IV";
            SpectralClass["K6V"] = "K6 V";
            SpectralClass["K7IV"] = "K7 IV";
            SpectralClass["K7V"] = "K7 V";
            SpectralClass["K8IV"] = "K8 IV";
            SpectralClass["K8V"] = "K8 V";
            SpectralClass["K9IV"] = "K9 IV";
            SpectralClass["K9V"] = "K9 V";
            SpectralClass["M0V"] = "M0 V";
            SpectralClass["M1V"] = "M1 V";
            SpectralClass["M2V"] = "M2 V";
            SpectralClass["M3V"] = "M3 V";
            SpectralClass["M4V"] = "M4 V";
            SpectralClass["M5V"] = "M5 V";
            SpectralClass["M6V"] = "M6 V";
            SpectralClass["M7V"] = "M7 V";
            SpectralClass["M8V"] = "M8 V";
            SpectralClass["M9V"] = "M9 V";
        })(SpectralClass = universe.SpectralClass || (universe.SpectralClass = {}));
    })(universe = esi.universe || (esi.universe = {}));
    let EntityType;
    (function (EntityType) {
        EntityType["ALLIANCE"] = "alliance";
        EntityType["CHARACTER"] = "character";
        EntityType["CORPORATION"] = "corporation";
        EntityType["FACTION"] = "faction";
    })(EntityType = esi.EntityType || (esi.EntityType = {}));
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
     * This is the response type for the route, [`GET /v1/characters/{character_id}/roles/`](https://esi.tech.ccp.is/#!/Character/get_characters_character_id_roles).
     */
    let Role;
    (function (Role) {
        Role["ACCOUNT_TAKE_1"] = "Account_Take_1";
        Role["ACCOUNT_TAKE_2"] = "Account_Take_2";
        Role["ACCOUNT_TAKE_3"] = "Account_Take_3";
        Role["ACCOUNT_TAKE_4"] = "Account_Take_4";
        Role["ACCOUNT_TAKE_5"] = "Account_Take_5";
        Role["ACCOUNT_TAKE_6"] = "Account_Take_6";
        Role["ACCOUNT_TAKE_7"] = "Account_Take_7";
        Role["ACCOUNTANT"] = "Accountant";
        Role["AUDITOR"] = "Auditor";
        Role["COMMUNICATIONS_OFFICER"] = "Communications_Officer";
        Role["CONFIG_EQUIPMENT"] = "Config_Equipment";
        Role["CONFIG_STARBASE_EQUIPMENT"] = "Config_Starbase_Equipment";
        Role["CONTAINER_TAKE_1"] = "Container_Take_1";
        Role["CONTAINER_TAKE_2"] = "Container_Take_2";
        Role["CONTAINER_TAKE_3"] = "Container_Take_3";
        Role["CONTAINER_TAKE_4"] = "Container_Take_4";
        Role["CONTAINER_TAKE_5"] = "Container_Take_5";
        Role["CONTAINER_TAKE_6"] = "Container_Take_6";
        Role["CONTAINER_TAKE_7"] = "Container_Take_7";
        Role["CONTRACT_MANAGER"] = "Contract_Manager";
        Role["DIPLOMAT"] = "Diplomat";
        Role["DIRECTOR"] = "Director";
        Role["FACTORY_MANAGER"] = "Factory_Manager";
        Role["FITTING_MANAGER"] = "Fitting_Manager";
        Role["HANGAR_QUERY_1"] = "Hangar_Query_1";
        Role["HANGAR_QUERY_2"] = "Hangar_Query_2";
        Role["HANGAR_QUERY_3"] = "Hangar_Query_3";
        Role["HANGAR_QUERY_4"] = "Hangar_Query_4";
        Role["HANGAR_QUERY_5"] = "Hangar_Query_5";
        Role["HANGAR_QUERY_6"] = "Hangar_Query_6";
        Role["HANGAR_QUERY_7"] = "Hangar_Query_7";
        Role["HANGAR_TAKE_1"] = "Hangar_Take_1";
        Role["HANGAR_TAKE_2"] = "Hangar_Take_2";
        Role["HANGAR_TAKE_3"] = "Hangar_Take_3";
        Role["HANGAR_TAKE_4"] = "Hangar_Take_4";
        Role["HANGAR_TAKE_5"] = "Hangar_Take_5";
        Role["HANGAR_TAKE_6"] = "Hangar_Take_6";
        Role["HANGAR_TAKE_7"] = "Hangar_Take_7";
        Role["JUNIOR_ACCOUNTANT"] = "Junior_Accountant";
        Role["PERSONNEL_MANAGER"] = "Personnel_Manager";
        Role["RENT_FACTORY_FACILITY"] = "Rent_Factory_Facility";
        Role["RENT_OFFICE"] = "Rent_Office";
        Role["RENT_RESEARCH_FACILITY"] = "Rent_Research_Facility";
        Role["SECURITY_OFFICER"] = "Security_Officer";
        Role["STARBASE_DEFENSE_OPERATOR"] = "Starbase_Defense_Operator";
        Role["STARBASE_FUEL_TECHNICIAN"] = "Starbase_Fuel_Technician";
        Role["STATION_MANAGER"] = "Station_Manager";
        Role["TERRESTRIAL_COMBAT_OFFICER"] = "Terrestrial_Combat_Officer";
        Role["TERRESTRIAL_LOGISTICS_OFFICER"] = "Terrestrial_Logistics_Officer";
        Role["TRADER"] = "Trader";
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
    /**
     * Transaction type, different type of transaction will populate different fields in `extra_info`.
     */
    let TransactionType;
    (function (TransactionType) {
        TransactionType["ACCELERATION_GATE_FEE"] = "acceleration_gate_fee";
        TransactionType["ADVERTISEMENT_LISTING_FEE"] = "advertisement_listing_fee";
        TransactionType["AGENT_DONATION"] = "agent_donation";
        TransactionType["AGENT_LOCATION_SERVICES"] = "agent_location_services";
        TransactionType["AGENT_MISCELLANEOUS"] = "agent_miscellaneous";
        TransactionType["AGENT_MISSION_COLLATERAL_PAID"] = "agent_mission_collateral_paid";
        TransactionType["AGENT_MISSION_COLLATERAL_REFUNDED"] = "agent_mission_collateral_refunded";
        TransactionType["AGENT_MISSION_REWARD"] = "agent_mission_reward";
        TransactionType["AGENT_MISSION_REWARD_CORPORATION_TAX"] = "agent_mission_reward_corporation_tax";
        TransactionType["AGENT_MISSION_TIME_BONUS_REWARD"] = "agent_mission_time_bonus_reward";
        TransactionType["AGENT_MISSION_TIME_BONUS_REWARD_CORPORATION_TAX"] = "agent_mission_time_bonus_reward_corporation_tax";
        TransactionType["AGENT_SECURITY_SERVICES"] = "agent_security_services";
        TransactionType["AGENT_SERVICES_RENDERED"] = "agent_services_rendered";
        TransactionType["AGENTS_PREWARD"] = "agents_preward";
        TransactionType["ALLIANCE_MAINTAINANCE_FEE"] = "alliance_maintainance_fee";
        TransactionType["ALLIANCE_REGISTRATION_FEE"] = "alliance_registration_fee";
        TransactionType["ASSET_SAFETY_RECOVERY_TAX"] = "asset_safety_recovery_tax";
        TransactionType["BOUNTY"] = "bounty";
        TransactionType["BOUNTY_PRIZE"] = "bounty_prize";
        TransactionType["BOUNTY_PRIZE_CORPORATION_TAX"] = "bounty_prize_corporation_tax";
        TransactionType["BOUNTY_PRIZES"] = "bounty_prizes";
        TransactionType["BOUNTY_REIMBURSEMENT"] = "bounty_reimbursement";
        TransactionType["BOUNTY_SURCHARGE"] = "bounty_surcharge";
        TransactionType["BROKERS_FEE"] = "brokers_fee";
        TransactionType["CLONE_ACTIVATION"] = "clone_activation";
        TransactionType["CLONE_TRANSFER"] = "clone_transfer";
        TransactionType["CONTRABAND_FINE"] = "contraband_fine";
        TransactionType["CONTRACT_AUCTION_BID"] = "contract_auction_bid";
        TransactionType["CONTRACT_AUCTION_BID_CORP"] = "contract_auction_bid_corp";
        TransactionType["CONTRACT_AUCTION_BID_REFUND"] = "contract_auction_bid_refund";
        TransactionType["CONTRACT_AUCTION_SOLD"] = "contract_auction_sold";
        TransactionType["CONTRACT_BROKERS_FEE"] = "contract_brokers_fee";
        TransactionType["CONTRACT_BROKERS_FEE_CORP"] = "contract_brokers_fee_corp";
        TransactionType["CONTRACT_COLLATERAL"] = "contract_collateral";
        TransactionType["CONTRACT_COLLATERAL_DEPOSITED_CORP"] = "contract_collateral_deposited_corp";
        TransactionType["CONTRACT_COLLATERAL_PAYOUT"] = "contract_collateral_payout";
        TransactionType["CONTRACT_COLLATERAL_REFUND"] = "contract_collateral_refund";
        TransactionType["CONTRACT_DEPOSIT"] = "contract_deposit";
        TransactionType["CONTRACT_DEPOSIT_CORP"] = "contract_deposit_corp";
        TransactionType["CONTRACT_DEPOSIT_REFUND"] = "contract_deposit_refund";
        TransactionType["CONTRACT_DEPOSIT_SALES_TAX"] = "contract_deposit_sales_tax";
        TransactionType["CONTRACT_PRICE"] = "contract_price";
        TransactionType["CONTRACT_PRICE_PAYMENT_CORP"] = "contract_price_payment_corp";
        TransactionType["CONTRACT_REVERSAL"] = "contract_reversal";
        TransactionType["CONTRACT_REWARD"] = "contract_reward";
        TransactionType["CONTRACT_REWARD_DEPOSITED"] = "contract_reward_deposited";
        TransactionType["CONTRACT_REWARD_DEPOSITED_CORP"] = "contract_reward_deposited_corp";
        TransactionType["CONTRACT_REWARD_REFUND"] = "contract_reward_refund";
        TransactionType["CONTRACT_SALES_TAX"] = "contract_sales_tax";
        TransactionType["COPYING"] = "copying";
        TransactionType["CORPORATE_REWARD_PAYOUT"] = "corporate_reward_payout";
        TransactionType["CORPORATE_REWARD_TAX"] = "corporate_reward_tax";
        TransactionType["CORPORATION_ACCOUNT_WITHDRAWAL"] = "corporation_account_withdrawal";
        TransactionType["CORPORATION_BULK_PAYMENT"] = "corporation_bulk_payment";
        TransactionType["CORPORATION_DIVIDEND_PAYMENT"] = "corporation_dividend_payment";
        TransactionType["CORPORATION_LIQUIDATION"] = "corporation_liquidation";
        TransactionType["CORPORATION_LOGO_CHANGE_COST"] = "corporation_logo_change_cost";
        TransactionType["CORPORATION_PAYMENT"] = "corporation_payment";
        TransactionType["CORPORATION_REGISTRATION_FEE"] = "corporation_registration_fee";
        TransactionType["COURIER_MISSION_ESCROW"] = "courier_mission_escrow";
        TransactionType["CSPA"] = "cspa";
        TransactionType["CSPAOFFLINEREFUND"] = "cspaofflinerefund";
        TransactionType["DATACORE_FEE"] = "datacore_fee";
        TransactionType["DNA_MODIFICATION_FEE"] = "dna_modification_fee";
        TransactionType["DOCKING_FEE"] = "docking_fee";
        TransactionType["FACTORY_SLOT_RENTAL_FEE"] = "factory_slot_rental_fee";
        TransactionType["GM_CASH_TRANSFER"] = "gm_cash_transfer";
        TransactionType["INDUSTRY_JOB_TAX"] = "industry_job_tax";
        TransactionType["INFRASTRUCTURE_HUB_MAINTENANCE"] = "infrastructure_hub_maintenance";
        TransactionType["INHERITANCE"] = "inheritance";
        TransactionType["INSURANCE"] = "insurance";
        TransactionType["JUMP_CLONE_ACTIVATION_FEE"] = "jump_clone_activation_fee";
        TransactionType["JUMP_CLONE_INSTALLATION_FEE"] = "jump_clone_installation_fee";
        TransactionType["KILL_RIGHT_FEE"] = "kill_right_fee";
        TransactionType["LP_STORE"] = "lp_store";
        TransactionType["MANUFACTURING"] = "manufacturing";
        TransactionType["MARKET_ESCROW"] = "market_escrow";
        TransactionType["MARKET_FINE_PAID"] = "market_fine_paid";
        TransactionType["MARKET_TRANSACTION"] = "market_transaction";
        TransactionType["MEDAL_CREATION"] = "medal_creation";
        TransactionType["MEDAL_ISSUED"] = "medal_issued";
        TransactionType["MISSION_COMPLETION"] = "mission_completion";
        TransactionType["MISSION_COST"] = "mission_cost";
        TransactionType["MISSION_EXPIRATION"] = "mission_expiration";
        TransactionType["MISSION_REWARD"] = "mission_reward";
        TransactionType["OFFICE_RENTAL_FEE"] = "office_rental_fee";
        TransactionType["OPERATION_BONUS"] = "operation_bonus";
        TransactionType["OPPORTUNITY_REWARD"] = "opportunity_reward";
        TransactionType["PLANETARY_CONSTRUCTION"] = "planetary_construction";
        TransactionType["PLANETARY_EXPORT_TAX"] = "planetary_export_tax";
        TransactionType["PLANETARY_IMPORT_TAX"] = "planetary_import_tax";
        TransactionType["PLAYER_DONATION"] = "player_donation";
        TransactionType["PLAYER_TRADING"] = "player_trading";
        TransactionType["PROJECT_DISCOVERY_REWARD"] = "project_discovery_reward";
        TransactionType["PROJECT_DISCOVERY_TAX"] = "project_discovery_tax";
        TransactionType["RELEASE_OF_IMPOUNDED_PROPERTY"] = "release_of_impounded_property";
        TransactionType["REPAIR_BILL"] = "repair_bill";
        TransactionType["REPROCESSING_TAX"] = "reprocessing_tax";
        TransactionType["RESEARCHING_MATERIAL_PRODUCTIVITY"] = "researching_material_productivity";
        TransactionType["RESEARCHING_TECHNOLOGY"] = "researching_technology";
        TransactionType["RESEARCHING_TIME_PRODUCTIVITY"] = "researching_time_productivity";
        TransactionType["REVERSE_ENGINEERING"] = "reverse_engineering";
        TransactionType["SECURITY_PROCESSING_FEE"] = "security_processing_fee";
        TransactionType["SHARES"] = "shares";
        TransactionType["SOVEREIGNITY_BILL"] = "sovereignity_bill";
        TransactionType["STORE_PURCHASE"] = "store_purchase";
        TransactionType["STORE_PURCHASE_REFUND"] = "store_purchase_refund";
        TransactionType["TRANSACTION_TAX"] = "transaction_tax";
        TransactionType["UPKEEP_ADJUSTMENT_FEE"] = "upkeep_adjustment_fee";
        TransactionType["WAR_ALLY_CONTRACT"] = "war_ally_contract";
        TransactionType["WAR_FEE"] = "war_fee";
        TransactionType["WAR_FEE_SURRENDER"] = "war_fee_surrender";
    })(TransactionType = esi.TransactionType || (esi.TransactionType = {}));
})(esi = exports.esi || (exports.esi = {}));
exports.ROUTE_MAP = {
    get_alliances: { url: "/v1/alliances/", method: "GET" },
    get_alliances_alliance_id: { url: "/v2/alliances/{alliance_id}/", method: "GET" },
    get_alliances_alliance_id_corporations: { url: "/v1/alliances/{alliance_id}/corporations/", method: "GET" },
    get_alliances_alliance_id_icons: { url: "/v1/alliances/{alliance_id}/icons/", method: "GET" },
    get_alliances_names: { url: "/v1/alliances/names/", method: "GET" },
    get_characters_character_id_assets: { url: "/v1/characters/{character_id}/assets/", method: "GET" },
    get_corporations_corporation_id_assets: { url: "/v1/corporations/{corporation_id}/assets/", method: "GET" },
    post_characters_character_id_assets_locations: { url: "/v1/characters/{character_id}/assets/locations/", method: "POST" },
    post_characters_character_id_assets_names: { url: "/v1/characters/{character_id}/assets/names/", method: "POST" },
    post_corporations_corporation_id_assets_locations: { url: "/v1/corporations/{corporation_id}/assets/locations/", method: "POST" },
    post_corporations_corporation_id_assets_names: { url: "/v1/corporations/{corporation_id}/assets/names/", method: "POST" },
    get_characters_character_id_bookmarks: { url: "/v1/characters/{character_id}/bookmarks/", method: "GET" },
    get_characters_character_id_bookmarks_folders: { url: "/v1/characters/{character_id}/bookmarks/folders/", method: "GET" },
    get_corporations_corporation_id_bookmarks: { url: "/v1/corporations/{corporation_id}/bookmarks/", method: "GET" },
    get_corporations_corporation_id_bookmarks_folders: { url: "/v1/corporations/{corporation_id}/bookmarks/folders/", method: "GET" },
    get_characters_character_id_calendar: { url: "/v1/characters/{character_id}/calendar/", method: "GET" },
    get_characters_character_id_calendar_event_id: { url: "/v3/characters/{character_id}/calendar/{event_id}/", method: "GET" },
    get_characters_character_id_calendar_event_id_attendees: { url: "/v1/characters/{character_id}/calendar/{event_id}/attendees/", method: "GET" },
    put_characters_character_id_calendar_event_id: { url: "/v3/characters/{character_id}/calendar/{event_id}/", method: "PUT" },
    get_characters_character_id: { url: "/v4/characters/{character_id}/", method: "GET" },
    get_characters_character_id_agents_research: { url: "/v1/characters/{character_id}/agents_research/", method: "GET" },
    get_characters_character_id_blueprints: { url: "/v2/characters/{character_id}/blueprints/", method: "GET" },
    get_characters_character_id_chat_channels: { url: "/v1/characters/{character_id}/chat_channels/", method: "GET" },
    get_characters_character_id_corporationhistory: { url: "/v1/characters/{character_id}/corporationhistory/", method: "GET" },
    get_characters_character_id_fatigue: { url: "/v1/characters/{character_id}/fatigue/", method: "GET" },
    get_characters_character_id_medals: { url: "/v1/characters/{character_id}/medals/", method: "GET" },
    get_characters_character_id_notifications: { url: "/v1/characters/{character_id}/notifications/", method: "GET" },
    get_characters_character_id_notifications_contacts: { url: "/v1/characters/{character_id}/notifications/contacts/", method: "GET" },
    get_characters_character_id_portrait: { url: "/v2/characters/{character_id}/portrait/", method: "GET" },
    get_characters_character_id_roles: { url: "/v1/characters/{character_id}/roles/", method: "GET" },
    get_characters_character_id_standings: { url: "/v1/characters/{character_id}/standings/", method: "GET" },
    get_characters_character_id_titles: { url: "/v1/characters/{character_id}/titles/", method: "GET" },
    get_characters_names: { url: "/v1/characters/names/", method: "GET" },
    post_characters_affiliation: { url: "/v1/characters/affiliation/", method: "POST" },
    post_characters_character_id_cspa: { url: "/v3/characters/{character_id}/cspa/", method: "POST" },
    get_characters_character_id_clones: { url: "/v2/characters/{character_id}/clones/", method: "GET" },
    get_characters_character_id_implants: { url: "/v1/characters/{character_id}/implants/", method: "GET" },
    delete_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "DELETE" },
    get_alliances_alliance_id_contacts: { url: "/v1/alliances/{alliance_id}/contacts/", method: "GET" },
    get_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "GET" },
    get_characters_character_id_contacts_labels: { url: "/v1/characters/{character_id}/contacts/labels/", method: "GET" },
    get_corporations_corporation_id_contacts: { url: "/v1/corporations/{corporation_id}/contacts/", method: "GET" },
    post_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "POST" },
    put_characters_character_id_contacts: { url: "/v1/characters/{character_id}/contacts/", method: "PUT" },
    get_characters_character_id_contracts: { url: "/v1/characters/{character_id}/contracts/", method: "GET" },
    get_characters_character_id_contracts_contract_id_bids: { url: "/v1/characters/{character_id}/contracts/{contract_id}/bids/", method: "GET" },
    get_characters_character_id_contracts_contract_id_items: { url: "/v1/characters/{character_id}/contracts/{contract_id}/items/", method: "GET" },
    get_corporations_corporation_id_contracts: { url: "/v1/corporations/{corporation_id}/contracts/", method: "GET" },
    get_corporations_corporation_id_contracts_contract_id_bids: { url: "/v1/corporations/{corporation_id}/contracts/{contract_id}/bids/", method: "GET" },
    get_corporations_corporation_id_contracts_contract_id_items: { url: "/v1/corporations/{corporation_id}/contracts/{contract_id}/items/", method: "GET" },
    get_corporations_corporation_id: { url: "/v3/corporations/{corporation_id}/", method: "GET" },
    get_corporations_corporation_id_alliancehistory: { url: "/v2/corporations/{corporation_id}/alliancehistory/", method: "GET" },
    get_corporations_corporation_id_blueprints: { url: "/v1/corporations/{corporation_id}/blueprints/", method: "GET" },
    get_corporations_corporation_id_containers_logs: { url: "/v1/corporations/{corporation_id}/containers/logs/", method: "GET" },
    get_corporations_corporation_id_divisions: { url: "/v1/corporations/{corporation_id}/divisions/", method: "GET" },
    get_corporations_corporation_id_facilities: { url: "/v1/corporations/{corporation_id}/facilities/", method: "GET" },
    get_corporations_corporation_id_icons: { url: "/v1/corporations/{corporation_id}/icons/", method: "GET" },
    get_corporations_corporation_id_medals: { url: "/v1/corporations/{corporation_id}/medals/", method: "GET" },
    get_corporations_corporation_id_medals_issued: { url: "/v1/corporations/{corporation_id}/medals/issued/", method: "GET" },
    get_corporations_corporation_id_members: { url: "/v2/corporations/{corporation_id}/members/", method: "GET" },
    get_corporations_corporation_id_members_limit: { url: "/v1/corporations/{corporation_id}/members/limit/", method: "GET" },
    get_corporations_corporation_id_members_titles: { url: "/v1/corporations/{corporation_id}/members/titles/", method: "GET" },
    get_corporations_corporation_id_membertracking: { url: "/v1/corporations/{corporation_id}/membertracking/", method: "GET" },
    get_corporations_corporation_id_roles: { url: "/v1/corporations/{corporation_id}/roles/", method: "GET" },
    get_corporations_corporation_id_roles_history: { url: "/v1/corporations/{corporation_id}/roles/history/", method: "GET" },
    get_corporations_corporation_id_shareholders: { url: "/v1/corporations/{corporation_id}/shareholders/", method: "GET" },
    get_corporations_corporation_id_standings: { url: "/v1/corporations/{corporation_id}/standings/", method: "GET" },
    get_corporations_corporation_id_starbases: { url: "/v1/corporations/{corporation_id}/starbases/", method: "GET" },
    get_corporations_corporation_id_starbases_starbase_id: { url: "/v1/corporations/{corporation_id}/starbases/{starbase_id}/", method: "GET" },
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
    get_characters_character_id_fleet: { url: "/v1/characters/{character_id}/fleet/", method: "GET" },
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
    get_characters_character_id_mining: { url: "/v1/characters/{character_id}/mining/", method: "GET" },
    get_corporation_corporation_id_mining_extractions: { url: "/v1/corporation/{corporation_id}/mining/extractions/", method: "GET" },
    get_corporation_corporation_id_mining_observers: { url: "/v1/corporation/{corporation_id}/mining/observers/", method: "GET" },
    get_corporation_corporation_id_mining_observers_observer_id: { url: "/v1/corporation/{corporation_id}/mining/observers/{observer_id}/", method: "GET" },
    get_corporations_corporation_id_industry_jobs: { url: "/v1/corporations/{corporation_id}/industry/jobs/", method: "GET" },
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
    get_corporations_corporation_id_orders: { url: "/v1/corporations/{corporation_id}/orders/", method: "GET" },
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
    get_corporations_corporation_id_customs_offices: { url: "/v1/corporations/{corporation_id}/customs_offices/", method: "GET" },
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
    get_universe_types_type_id: { url: "/v3/universe/types/{type_id}/", method: "GET" },
    post_universe_names: { url: "/v2/universe/names/", method: "POST" },
    post_ui_autopilot_waypoint: { url: "/v2/ui/autopilot/waypoint/", method: "POST" },
    post_ui_openwindow_contract: { url: "/v1/ui/openwindow/contract/", method: "POST" },
    post_ui_openwindow_information: { url: "/v1/ui/openwindow/information/", method: "POST" },
    post_ui_openwindow_marketdetails: { url: "/v1/ui/openwindow/marketdetails/", method: "POST" },
    post_ui_openwindow_newmail: { url: "/v1/ui/openwindow/newmail/", method: "POST" },
    get_characters_character_id_wallet: { url: "/v1/characters/{character_id}/wallet/", method: "GET" },
    get_characters_character_id_wallet_journal: { url: "/v2/characters/{character_id}/wallet/journal/", method: "GET" },
    get_characters_character_id_wallet_transactions: { url: "/v1/characters/{character_id}/wallet/transactions/", method: "GET" },
    get_corporations_corporation_id_wallets: { url: "/v1/corporations/{corporation_id}/wallets/", method: "GET" },
    get_corporations_corporation_id_wallets_division_journal: { url: "/v1/corporations/{corporation_id}/wallets/{division}/journal/", method: "GET" },
    get_corporations_corporation_id_wallets_division_transactions: { url: "/v1/corporations/{corporation_id}/wallets/{division}/transactions/", method: "GET" },
    get_wars: { url: "/v1/wars/", method: "GET" },
    get_wars_war_id: { url: "/v1/wars/{war_id}/", method: "GET" },
    get_wars_war_id_killmails: { url: "/v1/wars/{war_id}/killmails/", method: "GET" }
};
//# sourceMappingURL=esi.js.map