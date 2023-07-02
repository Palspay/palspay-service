const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');
const { userService} = require('./../services');

const addFriends = catchAsync(async (req, res) => {
    const access_token = await userService.addFriends(req.body);
    res.status(httpStatus.CREATED).send({ access_token });
});


module.exports = {
    addFriends
};