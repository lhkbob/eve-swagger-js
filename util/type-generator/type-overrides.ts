export interface ExplicitNames {
  [name: string]: string;
}

// Title refers to a route id, name is a valid namespace path
export const NAMESPACE_OVERRIDES: ExplicitNames = {
  'post_ui_openwindow_newmail': 'esi.character.mail',
  'get_universe_schematics_schematic_id': 'esi.universe',
  'get_characters_character_id_killmails_recent': 'esi.killmail',
};

// Full namespaces that should be collapsed into their parent, these
// are spaces that can be consolidated logically but don't match the present
// set of heuristics for automatic collapse.
export const COLLAPSE_NAMESPACE: string[] = [
  'esi.fleet.wing',
  'esi.fleet.member',
  'esi.character.mail.label',
  'esi.corporation.structure',
  'esi.character.skill',
  'esi.universe.type'
];

// Title refers to the generated title for a type, name is the new name
export const TYPENAME_OVERRIDES: ExplicitNames = {
  'get_characters_character_id_killmails_recent_element': 'KillmailLink',
  'get_insurance_prices_element_levels_element': 'InsuranceLevel',
  'get_characters_character_id_assets_element_location_flag': 'AssetLocation',
  'get_characters_character_id_blueprints_element_location_flag': 'BlueprintLocation',
  'post_characters_character_id_fittings_fitting': 'NewFitting',
  'post_characters_character_id_mail_mail': 'NewMail',
  'get_characters_character_id_mail_element': 'MailHeader',
  'post_characters_character_id_mail_labels_label': 'NewLabel',
  'get_characters_character_id_planets_element': 'PlanetSummary',
  'get_universe_systems_system_id_planets_element': 'SystemPlanet',
  'get_characters_character_id_industry_jobs_element_status': 'JobStatus',
  'get_characters_character_id_corporationhistory_element': 'CorporationHistory',
  'get_corporations_corporation_id_alliancehistory_element': 'AllianceHistory',
  'get_corporations_corporation_id_structures_element_current_vul_element': 'VulnerabilitySchedule',
  'get_universe_system_jumps_element': 'SystemJumps',
  'get_universe_system_kills_element': 'SystemKills',
  'get_characters_character_id_planets_planet_id_pins_element_extractor_details_heads_element': 'ExtractorHead',
  'get_characters_character_id_clones_jump_clones_element': 'JumpClone',
  'get_markets_groups_market_group_id': 'MarketGroup',
  'get_characters_character_id_orders_element_state': 'OrderState',
  'get_corporations_corporation_id_roles_element': 'MemberRoles',
  'get_characters_character_id_wallets_journal_element': 'WalletJournal',
  'get_characters_character_id_loyalty_points_element': 'LoyaltyPoints',
  'get_killmails_killmail_id_killmail_hash': 'Killmail',
  'get_killmails_killmail_id_killmail_hash_attackers_element': 'Attacker',
  'get_killmails_killmail_id_killmail_hash_victim_items_element': 'Item',
  'get_killmails_killmail_id_killmail_hash_victim_items_element_items_element': 'Charge',
  'post_ui_openwindow_newmail_new_mail': 'NewMailWindow',
  'post_characters_character_id_cspa_characters': 'CSPACharacters',
  'post_characters_character_id_cspa_response': 'CSPACost',
  'get_characters_character_id_contacts_labels_element': 'ContactLabel',
  'get_characters_character_id_agents_research_element': 'AgentResearch',
  'get_loyalty_stores_corporation_id_offers_element': 'LoyaltyStoreOffer',
  'get_loyalty_stores_corporation_id_offers_element_required_items_element': 'LoyaltyStoreRequirement',
  'get_characters_character_id_orders_element_range': 'OrderRange',
  'post_universe_names_element_category': 'NameCategory',
  'get_characters_character_id_chat_channels_element_allowed_element': 'AllowedAccessor',
  'get_characters_character_id_chat_channels_element_blocked_element': 'RestrictedAccessor',
  'post_characters_character_id_fittings_response': 'FittingID',
  'post_fleets_fleet_id_wings_response': 'WingID',
  'post_fleets_fleet_id_wings_wing_id_squads_response': 'SquadID',
  'post_fleets_fleet_id_members_invitation': 'Invitation',
  'put_characters_character_id_mail_mail_id_contents': 'MailUpdate'
};
