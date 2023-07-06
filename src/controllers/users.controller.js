const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');
const { userService } = require('./../services');

const addFriends = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const invite_details = await userService.addFriends(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Add friend succesfully', data: { invite_details } });
});

const getFriends = catchAsync(async (req, res) => {
    const friends = await userService.getFriendsById(req.userId);
    res.status(httpStatus.OK).send({ message: 'Data Loading', data: { friends } });
})


const createGroups = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const group_id = await userService.createGroups(mergedBody);
    res.status(httpStatus.CREATED).send({ message: 'Group Create succesfully', data: { group_id: group_id._id } });
});


const getMembersByGroupId = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const groupsDetails= await userService.getMembersByGroupId(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Data Load succesfully', data: { groupsDetails} });
});

const getMyGroups = catchAsync(async (req, res) => {
    const groupsList= await userService.getMyGroups(req.userId);
    res.status(httpStatus.OK).send({ message: 'Data Load succesfully', data: { groupsList} });
});
module.exports = {
    addFriends,
    getFriends,
    createGroups,
    getMembersByGroupId,
    getMyGroups
};