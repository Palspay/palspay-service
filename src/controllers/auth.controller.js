const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');
const { authService } = require('./../services');

const register = catchAsync(async (req, res) => {
    const data = await authService.createUser(req.body);
    res.status(httpStatus.CREATED).send({ message:'User Registered',data:data });
});

const verifyOtp=catchAsync(async(req,res)=>{
    const data = await authService.verifyOtp(req.body);
    res.status(httpStatus.CREATED).send({ message:'Otp Verify Successfuly',data:data });
})
const login = catchAsync(async (req, res) => {
    const access_token = await authService.loginUserWithEmailAndPassword(req.body);
    res.status(httpStatus.CREATED).send({ message:'Login Sucessfully',data:{access_token} });
});


module.exports = {
    register,
    login,
    verifyOtp
};