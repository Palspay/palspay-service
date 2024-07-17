"use strict";
// config.js
var config = require('./config');
module.exports = {
    jwt: {
        privateKey: config.private_key,
        publicKey: config.publicKey
    }
};
//# sourceMappingURL=jwt.config.js.map