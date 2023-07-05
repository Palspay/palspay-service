const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');
const { userService} = require('./../services');

const addFriends = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate:req.currentDate
      };
    await userService.addFriends(mergedBody);
    res.status(httpStatus.CREATED).send({message:'Add friend succesfully',data:{}});
});

const getFriends=catchAsync(async(req,res)=>{
   const friends= await userService.getFriendsById(req.userId);
   console.log(friends);
    res.status(httpStatus.OK).send({message:'Data Loading',data:{friends}});
})

module.exports = {
    addFriends,
    getFriends
};