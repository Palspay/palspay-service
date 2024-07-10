"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require('firebase/app');
var admin = require("firebase-admin");
var express = require("express");
var helmet = require("helmet");
var xss = require("xss-clean");
var mongoSanitize = require("express-mongo-sanitize");
var compression = require("compression");
var cors = require("cors");
var httpStatus = require("http-status");
var config = require("./config/config");
var morgan = require("./config/morgan");
var routes = require("./routes/v1");
var _a = require("./middlewares/error"), errorConverter = _a.errorConverter, errorHandler = _a.errorHandler;
var ApiError = require("./utills/ApiError");
var path = require("path");
// const mime = require('mime');
var fs = require("fs");
var app = express();
var serviceAccount = require("../firebase_cert.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
// Firebase setup
var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "".concat(process.env.FIREBASE_PROJECT_ID, ".firebaseapp.com"),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: "".concat(process.env.FIREBASE_PROJECT_ID, ".appspot.com"),
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_WEB_APP_ID,
};
firebase.initializeApp(firebaseConfig);
if (config.env !== "test") {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}
app.use("/images", express.static(path.join(__dirname, "../public/uploads")));
console.log("test", path.join(__dirname, "../public/uploads"));
// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options("*", cors());
// v1 api routes
app.use("/v1", routes);
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, 'src', 'index.html'));
// });
app.get("/", function (req, res) {
    res.send("Server is running");
});
// send back a 404 error for any unknown api request
app.use(function (req, res, next) {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});
// convert error to ApiError, if needed
app.use(errorConverter);
app.use(errorHandler);
module.exports = app;
//# sourceMappingURL=app.js.map