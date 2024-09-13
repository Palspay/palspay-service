import httpStatus from 'http-status'
import catchAsync from './../utills/catchAsync';
import { authService, userService } from './../services';
import { generateToken } from '../services/auth.service';
import admin from 'firebase-admin';
const msg91Service = require('../services/msg91.service');

export const register = catchAsync(async (req, res) => {
    const data = await authService.createUser(req.body);
    res.status(httpStatus.CREATED).send({ message: 'User Registered', data: data });
});

export const verifyOtp = catchAsync(async (req, res) => {
    const data = await authService.verifyOtp(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Otp Verify Successfuly', data: data });
})
export const login = catchAsync(async (req, res) => {
    const access_token = await authService.loginUserWithEmailAndPassword(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Login Sucessfully', data: access_token });
});

// export const verifyUser = catchAsync(async (req, res) => { //verifyUser and send sms
//     var otp; // Math.floor(100000 + Math.random() * 9000).toString();
//     const mergedBody = {
//         ...req.body,
//         otp: otp
//     };
//     const isUser = await authService.verifyUser(mergedBody);
//     if (isUser) {
//         res.status(httpStatus.CREATED).send({ message: 'Login Sucessfully', data: isUser });
//     } else {
//         res.status(httpStatus.NOT_FOUND).send({ message: 'Not a valid user!', data: [] });
//     }
// });

export const verifyUser = catchAsync(async (req, res) => {
    const { mobile } = req.body;
    const user = await userService.getUserByMobile(mobile);

    if (user) {
        const otp = await generateOtp(6);
        // Assuming msg91Service.sendOtp is a service that sends OTP via SMS
        try {
            await msg91Service.sendOtp(mobile, otp);
            // Save the OTP in the user's data for verification later
            user.otp = otp;
            await user.save();
            res.status(httpStatus.CREATED).send({
                message: 'OTP sent successfully!',
                data: { otp, _id: user._id } // Sending OTP for testing; you can skip sending the OTP to frontend in production
            });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Failed to send OTP', error });
        }
    } else {
        res.status(httpStatus.NOT_FOUND).send({ message: 'User not found with this mobile number' });
    }
});


export const createNewPassword = catchAsync(async (req, res) => { //Create a new password

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

export const googleLogin = catchAsync(async (req, res) => {
    try {
        const adminAuth = admin.auth()
        // @ts-ignore
        const decodedToken = await adminAuth.verifyIdToken(req.body.token);
        const uid = decodedToken.uid;
        // Retrieve the user record from Firebase
        const user = await admin.auth().getUser(uid);
        const email = user.email;
        const name = user.displayName;
        const mobile = user.phoneNumber
        const dp = user.photoURL
        const existingUser = await userService.getUserByEmail(email, false);
        if (existingUser) {
            const access_token = await generateToken(existingUser);
            const data = { 
                access_token,
                // @ts-ignore
                is_passcode_enter: existingUser.is_passcode_enter,
                name: existingUser.name,
                // @ts-ignore
                email: existingUser.email,
                // @ts-ignore
                user_id: existingUser.id,
                // @ts-ignore
                currency: existingUser.currency,
                // @ts-ignore        
                vpa: existingUser.vpa || '',
                // @ts-ignore
                plan_active: existingUser.plan_active || false,
                // @ts-ignore
                plan_expired: existingUser.plan_expired || 0,                

            }
            res.status(httpStatus.OK).send({ message: 'Login Sucessfully', data });
        } else {
            const userCreated = await authService.createUserWithoutOTP({ email, name, mobile, dp, gmail_id: uid });
            const access_token = await generateToken(userCreated);
            // @ts-ignore
            const data = {
                access_token,
                is_passcode_enter: userCreated.is_passcode_enter,
                name: userCreated.name,
                email: userCreated.email,
                user_id: userCreated.id,
                currency: userCreated.currency,

            }
            res.status(httpStatus.CREATED).send({ message: 'User Created', data });
        }
    } catch (error) {
        // Handle error
        console.log(error);
        res.status(httpStatus.NOT_FOUND).send({ message: 'Not a valid user!', data: [] });
    }
})


export const facebookLogin = catchAsync(async (req, res) => {
    try {
        console.log('Received token:', req.body.token);
        const adminAuth = admin.auth();
        // Decode the Firebase ID token sent from the frontend
        const decodedToken = await adminAuth.verifyIdToken(req.body.token);
        console.log('Decoded token:', decodedToken); 
        const uid = decodedToken.uid;

        // Retrieve the user record from Firebase
        const user = await admin.auth().getUser(uid);
        const email = user.email;
        const name = user.displayName;
        const mobile = user.phoneNumber;
        const dp = user.photoURL;

        // Check if the user already exists in your database
        const existingUser = await userService.getUserByEmail(email, false);
        if (existingUser) {
            // Generate access token for existing user
            const access_token = await generateToken(existingUser);
            const data = {
                access_token,
                // @ts-ignore
                is_passcode_enter: existingUser.is_passcode_enter,
                name: existingUser.name,
                // @ts-ignore
                email: existingUser.email,
                // @ts-ignore
                user_id: existingUser.id,
                // @ts-ignore
                currency: existingUser.currency,
                // @ts-ignore
                vpa: existingUser.vpa || '',
                // @ts-ignore
                plan_active: existingUser.plan_active || false,
                // @ts-ignore
                plan_expired: existingUser.plan_expired || 0,
            };
            res.status(httpStatus.OK).send({ message: 'Login Successfully', data });
        } else {
            // Create a new user in the database if they don't exist
            const userCreated = await authService.createUserWithoutOTP({ email, name, mobile, dp, facebook_id: uid });
            const access_token = await generateToken(userCreated);
            const data = {
                access_token,
                is_passcode_enter: userCreated.is_passcode_enter,
                name: userCreated.name,
                email: userCreated.email,
                user_id: userCreated.id,
                currency: userCreated.currency,
            };
            res.status(httpStatus.CREATED).send({ message: 'User Created', data });
        }
    } catch (error) {
        // Handle error
        console.log(error);
        res.status(httpStatus.NOT_FOUND).send({ message: 'Not a valid user!', data: [] });
    }
});


const generateOtp = async (length) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
