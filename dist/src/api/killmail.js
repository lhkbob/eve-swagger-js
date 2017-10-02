"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Killmail} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Killmail API instance
 */
function makeKillmail(agent) {
    return function (id, hash) {
        return agent.request('get_killmails_killmail_id_killmail_hash', { path: { killmail_id: id, killmail_hash: hash } });
    };
}
exports.makeKillmail = makeKillmail;
//# sourceMappingURL=killmail.js.map