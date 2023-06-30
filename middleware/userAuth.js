//impementing middleware using jwt only those user can access who have tocken
const jwt = require('jsonwebtoken')
const userModel = require('../models/CustomerModel')
const Helper = require('../config/helper');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    verifyToken: (req, res, next) => {
        const { authorization } = req.headers
            // console.log(authorization)
        if (!authorization) {
            return Helper.response(res, 401, "you must be logged in");
        }
        const token = authorization
        jwt.verify(token, JWT_SECRET, (err, payload) => {
            // console.log(payload)
            // return false;
            if (err) {
                return Helper.response(res, 401, "you must be logged in");
            }
            const { _id } = payload
            userModel.findById(_id).lean().then(userdata => {
                if (userdata === null) {
                    return Helper.response(res, 401, "Token is invalid");
                }
                //if(token == userdata.JWT_Token){
                if (userdata.JWT_Token.includes(token)) {
                    userdata.JWT_Token = [token];
                    req.user = userdata
                    next()
                } else {
                    return Helper.response(res, 401, "Token is invalid");
                }
            })

        })
    }
}