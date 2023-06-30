const helper = {};
var fs = require("fs");
var _ = require('lodash');
const { resolve } = require("path");


helper.response = function(response, status_code, message, data) {
    var ret = {
        code: status_code,
        message: message,
    };
    if (data) {
        Object.assign(ret, data);
    }
    response.status(status_code).json(ret);
};

helper.base64_encode = (file) => {
    //const encoded = new Buffer.from(fs.readFileSync(file.path)).toString("base64")
    const encoded = fs.readFileSync(file.path);

    return encoded;
};

helper.base64_decode = (imageData, filename, targetFilePath, imageUrl) => {
    var image = "";
    var data = imageData.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFile(targetFilePath + filename, data, 'base64', function(err) {
        //Finished
        if (err) {

        } else {
            image = process.env.SERVER_URL + imageUrl + filename;
        }
    });
    return image;
};

helper.generateRandNo = () => {
    let rand_no = Math.random();
    let num = Math.floor(rand_no * 100000000 + 1);
    return num; /*8 digit random number*/
}

helper.getPageNumber = (page, limit) => {
    if (page == 1) {
        var start = 0;
    } else {
        if (page == 0) {
            page = 1;
        }
        page = (page - 1);
        var start = (((limit == undefined || limit == '') ? Config.SETTING.PER_PAGE_RECORD : limit) * page);
    }
    return start;
}

helper.strToLowerCase = (str) => {
    return str == undefined ? '' : helper._trim(str.toLowerCase());
}

helper._replace = (str) => {
    var responce = str == undefined ? '' : str.replace(/[^a-zA-Z0-9 ]/g, "");
    return responce;
}

helper._trim = (str) => {
    var responce = str == undefined ? '' : str.trim();
    return responce;
}

helper.generateRandString = () => {
    return Math.random().toString(36).substring(5);
}
helper.addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}
helper.modifyDate = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
helper.dateFormat = function(date, day) { //remove hrs/minute
    if (day) {
        date.setDate(date.getDate() + day);
    } else {
        date.setDate(date.getDate())
    }
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
helper.upcomingdays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
helper.priviousdays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

helper.generateOrderId = () => { // orderId
    //return Math.floor(100000 + Math.random() * 900000);

    // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const chars = '0123456789';
    let orderId = '';
    for (let i = 0; i < 10; i++) {
        orderId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return orderId;
}
helper.generateInvoice = () => { // invoiceId
    const chars = '0123456789';
    let invoiceId = '';
    for (let i = 0; i < 7; i++) {
        invoiceId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return invoiceId;
}

helper.getCurrentHours = () => { //India timezone
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    return now.toLocaleTimeString('en-US', options);
}

helper.generateRandProductId = () => {
    let num = Math.floor(1000000 + Math.random() * 9000000);
    return num; /*6 digit random number*/
}
helper.parseData = (i) => {
    j = i.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g, '"');
    return JSON.parse(j);
}
var self = module.exports = helper;