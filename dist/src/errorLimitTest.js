"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const error_1 = require("./error");
const api = index_1.makeAPI({ minTimeBetweenRequests: 10, maxConcurrentRequests: 0, userAgent: 'lhkbob@gmail.com (Purposefully testing error-limit handling, sorry!)' });
let queue = [];
for (let i = 0; i < 200; i++) {
    queue.push(api.characters(i).info().catch(e => {
        if (error_1.isESIError(e) && e.info && e.info.response) {
            console.log(i, 'remaining errors:', e.info.response.headers['x-esi-error-limit-remain'], e.message);
        }
    }));
}
Promise.all(queue).then(() => {
    console.log('completed');
}).catch(error => {
    console.error('unexpected error: ', error);
});
//# sourceMappingURL=errorLimitTest.js.map