//importing packages
const express = require('express');
const app = express();
const cors = require('cors')
var path = require('path')

//importing mongoose packages for performing the query
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV || "production";
require('dotenv').config({ path: '.env.' + NODE_ENV });
const PORT = process.env.PORT;

console.log(`Your env is ${process.env.NODE_ENV}`);
app.use(cors());
app.set('view engine', 'html');
app.set("locale", "en");
global.LOCALE = app.get("locale");

app.set("env", process.env);
global.ENV = app.get("env");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const timeZone = 'Asia/Singapore';

//import Routes
const AppRouter = require('./routes/v1/AppRouter');
const reqStats = require("./logger/requestLogger");
app.use(reqStats());

app.use('/api/v1', AppRouter);

//checking routes
app.get('/', (req, res) => {
    res.send('API is working fine!');
});

//connecting database
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
    console.log("database connected")
});

//(error handling ) when errors will be occur
mongoose.connection.on('error', (err) => {
    console.log("err connecting", err)
});

//setting up custom error message for routes 
app.use((req, res, next) => {
    const error = new Error('This APIs does not exist');
    error.status = 404;
    next(error);
});

//Error handler function`
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//callig server
app.listen(PORT, () => {
    console.log("server is running on", PORT)
});