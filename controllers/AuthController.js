const userModel = require('../models/CustomerModel');
const Helper = require('../config/helper');
const jwt = require('jsonwebtoken');
const { logger } = require("../logger/winston");
const SECRET_KEY = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');

module.exports = {
    registration: async(req, res) => {
        try {
            const { countryCode, mobile, deviceToken, name, password } = req.body;
            if (!countryCode || !mobile) {
                return Helper.response(res, 422, "Please add all the fields");
            }

            const isExists = await userModel.findOne({ countryCode, mobile });
            if (isExists) {
                if (isExists.status == "Active") {
                    return Helper.response(res, 200, `${name}, this user is already in our database.`);
                } else {
                    return Helper.response(res, 422, "Your account is deleted. Please use another number.");
                }
            } else {
                var newUser = new userModel(req.body);
                const saveResult = await newUser.save();
                if (saveResult) {
                    var token = jwt.sign({ _id: saveResult._id }, SECRET_KEY);
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    const saveUser = await userModel.findOneAndUpdate({ mobile: saveResult.mobile }, { $set: { deviceToken: deviceToken, password: hash }, $push: { JWT_Token: token } }, { new: true });
                    if (saveUser) {
                        const data = { response: saveUser }
                        return Helper.response(res, 200, `Welcome to the splitWise: ${saveUser.mobile}`, data);
                    }
                }
            }
        } catch (err) {
            logger.error("err1", err);
            return Helper.response(res, 500, " Server error.");
        }
    },

    //signIn 
    signIn: (req, res) => {
        try {
            userModel.findOne({
                    email: req.body.email,
                    // password: req.body.password,
                },
                (error, result) => {
                    if (error) {
                        return Helper.response(res, 500, "Internal server error.");
                    } else if (!result) {
                        return Helper.response(res, 422, "User does not exist.");
                    } else {
                        const isMatch = bcrypt.compareSync(req.body.password, result.password);
                        console.log(isMatch, "<isMatch")
                        if (isMatch) {
                            var token = jwt.sign({ _id: result._id }, SECRET_KEY);
                            userModel.findByIdAndUpdate({ _id: result._id }, { $push: { JWT_Token: token } }, { new: true, useFindAndModify: false },
                                (updateErr, updateRes) => {
                                    if (updateErr) {
                                        return Helper.response(res, 500, "Internal server error.");
                                    } else {
                                        updateRes.JWT_Token = [token];
                                        return Helper.response(res, 200, "User verified succesfully..", { response: updateRes });
                                    }
                                }
                            );
                        } else {
                            return Helper.response(res, 422, "Invalid credentials!");
                        }
                    }
                }
            );
        } catch (error) {
            logger.error("error", error);
            return Helper.response(res, 500, "Server error.");
        }
    },
}