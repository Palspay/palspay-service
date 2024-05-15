import httpStatus from 'http-status';
import catchAsync from './../utills/catchAsync.js';
import { authService } from './../services/index.js';

const register = catchAsync(async(req, res) => {
    const data = await authService.createUser(req.body);
    res.status(httpStatus.CREATED).send({ message: 'User Registered', data: data });
});

const verifyOtp = catchAsync(async(req, res) => {
    const data = await authService.verifyOtp(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Otp Verify Successfuly', data: data });
})
const login = catchAsync(async(req, res) => {
    const access_token = await authService.loginUserWithEmailAndPassword(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Login Sucessfully', data:  access_token  });
});

const verifyUser = catchAsync(async(req, res) => { //verifyUser and send sms
    var otp = 123456 // Math.floor(100000 + Math.random() * 9000).toString();
    const mergedBody = {
        ...req.body,
        otp: otp
    };
    const isUser = await authService.verifyUser(mergedBody);
    if (isUser) {
        res.status(httpStatus.CREATED).send({ message: 'Login Sucessfully', data: isUser });
    } else {
        res.status(httpStatus.NOT_FOUND).send({ message: 'Not a valid user!', data: [] });
    }
});

const createNewPassword = catchAsync(async(req, res) => { //Create a new password

    if (req.body.confirmPassword != req.body.newPassword) {
        return res.status(httpStatus.NOT_ACCEPTABLE).send({ message: 'New password and confirm password is not matched!', data: [] });
    }
    const mergedBody = {
        ...req.body,
        userId: req.userId,
    };
    const isUser = await authService.createNewPassword(mergedBody);
    if (isUser) {
        res.status(httpStatus.CREATED).send({ message: 'Reset password sucessfully', data: isUser });
    } else {
        res.status(httpStatus.NOT_FOUND).send({ message: 'Not a valid user!', data: [] });
    }
});


export default {
    register,
    login,
    verifyOtp,
    verifyUser,
    createNewPassword
};
