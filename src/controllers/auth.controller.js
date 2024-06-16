import httpStatus from 'http-status'
import catchAsync from './../utills/catchAsync';
import { authService, userService } from './../services';
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { generateToken } from '../services/auth.service';

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

export const verifyUser = catchAsync(async (req, res) => { //verifyUser and send sms
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

export const googleLogin = () => catchAsync(async (req, res) => {
    // Build Firebase credential with the Google ID token.
    const credential = GoogleAuthProvider.credential(req.body.token);
    // Sign in with credential from the Google user.
    const auth = getAuth();

    signInWithCredential(auth, credential).then(async (response) => {
        const user = response.user;
        const email = user.email;
        const name = user.displayName;
        const mobile = user.phoneNumber
        const isEmailExits = await userService.getUserByEmail(email);
        if (isEmailExits) {
            const access_token = await generateToken(user);
            res.status(httpStatus.CREATED).send({ message: 'Login Sucessfully', data: access_token });
        } else {
            const userCreated = await authService.createUserWithoutOTP({ email, name, mobile });
            const access_token = await generateToken(userCreated);
            res.status(httpStatus.CREATED).send({ message: 'User Created', data: access_token });
        }
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        res.status(httpStatus.NOT_FOUND).send({ message: 'Not a valid user!', data: [errorCode, errorMessage, email] });
    });

})
