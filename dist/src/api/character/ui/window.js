"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Window} instance that uses the given `agent` to make
 * its HTTP requests to the ESI interface. The character whose UI is updated is
 * automatically determined from the token.
 *
 * @param agent The agent making actual requests
 * @param token The SSO token to authenticate requests
 * @returns An Window API instance
 */
function makeWindow(agent, token) {
    return new WindowImpl(agent, token);
}
exports.makeWindow = makeWindow;
class WindowImpl {
    constructor(agent, token) {
        this.agent = agent;
        this.token = token;
    }
    info(id) {
        return this.agent.request('post_ui_openwindow_information', { query: { target_id: id } }, this.token);
    }
    market(id) {
        return this.agent.request('post_ui_openwindow_marketdetails', { query: { type_id: id } }, this.token);
    }
    contract(id) {
        return this.agent.request('post_ui_openwindow_contract', { query: { contract_id: id } }, this.token);
    }
    newMail(settings) {
        return this.agent.request('post_ui_openwindow_newmail', { body: settings }, this.token);
    }
}
//# sourceMappingURL=window.js.map