"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var app = require('./app');
var config = require('./config/config');
var logger = require('./config/logger');
var server;
// const password = encodeURIComponent("A31401puri");
// const connectionString = `mongodb+srv://thepalspayapp:${password}@palspay.aqaz2lz.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(function () {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, function () {
        logger.info("Listening to port ".concat(config.port));
    });
});
// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };
var unexpectedErrorHandler = function (error) {
    logger.error(error);
    // exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', function () {
    logger.info('SIGTERM received');
    // if (server) {
    //   server.close();
    // }
});
//# sourceMappingURL=index.js.map