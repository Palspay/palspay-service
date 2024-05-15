import httpStatus from 'http-status';
import catchAsync from './../utills/catchAsync.js';
import { userService } from './../services/index.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// const { use } = require('../routes/v1/user.routes');
import activityService from './../services/activity.service.js';

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
    const groupsDetails = await userService.getMembersByGroupId(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Data Load succesfully', data: { groupsDetails } });
});

const getMyGroups = catchAsync(async (req, res) => {
    const groupsList = await userService.getMyGroups(req.userId);
    res.status(httpStatus.OK).send({ message: 'Data Load succesfully', data: { groupsList } });
});

const setPasscode = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        currentDate: req.currentDate
    };
    const passcode = await userService.setPasscode(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Passcode set succesfully', data: {} });
});

const getAllTimezones = catchAsync(async (req, res) => {
    const timezones = await userService.getAllTimezones();
    res.status(httpStatus.OK).send({ message: 'Data Load succesfully', data: { timezones } });
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const upload = multer({ storage });

const uploadFile = catchAsync(async (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} });
        }
        if (!req.file) {
            res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} });
        }

        const releativePath = path.join(req.file.filename);
        res.json({ message: 'File uploaded successfully', imagePath: releativePath });
    });
});

const editProfile = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        modification_date: req.currentDate
    };
    const profile = await userService.editProfile(mergedBody, req.userId);
    res.status(httpStatus.OK).send({ message: 'Profile update succesfully', data: {} });
});

const leaveGroup = catchAsync(async (req, res) => {
    const group_id = req.query.group_id;
    const mergedBody = {
        group_id,
        modification_date: req.currentDate
    };
    const profile = await userService.leaveGroup(mergedBody, req.userId);
    res.status(httpStatus.OK).send({ message: 'Leave group succesfully', data: {} });
});

const deleteGroup = catchAsync(async (req, res) => {
    const group_id = req.query.group_id;
    const mergedBody = {
        group_id,
        modification_date: req.currentDate
    };
    const profile = await userService.deleteGroup(mergedBody, req.userId);
    res.status(httpStatus.OK).send({ message: 'Delete succesfully', data: {} });
});

const removeFriend = catchAsync(async (req, res) => {
    const user_id = req.query.user_id;
    const mergedBody = {
        user_id,
        modification_date: req.currentDate
    };
    const profile = await userService.removeFriend(mergedBody, req.userId);
    res.status(httpStatus.OK).send({ message: 'Delete succesfully', data: {} });
});

const takePlan = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        modification_date: req.currentDate,
        plan_selected_date: req.currentDate,

    };
    await userService.takePlan(mergedBody, req.userId);
    res.status(httpStatus.OK).send({ message: 'Plan update succesfully', data: {} });
});



const getActivity = catchAsync(async (req, res) => {
    const activity = await activityService.getActivity(req.userId);
    res.status(httpStatus.OK).send({ message: 'Data Loading', data: { activity } });
})

export default {
    addFriends,
    getFriends,
    createGroups,
    getMembersByGroupId,
    getMyGroups,
    setPasscode,
    getAllTimezones,
    uploadFile,
    editProfile,
    leaveGroup,
    deleteGroup,
    removeFriend,
    takePlan,
    getActivity
};
