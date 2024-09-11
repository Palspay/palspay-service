const httpStatus = require('http-status');
const catchAsync = require('./../utills/catchAsync');
const { userService } = require('./../services');
const msgService = require('./../services/msg91.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const { use } = require('../routes/v1/user.routes');
const activityService = require('./../services/activity.service');
// @ts-ignore
const { isGroupMember } = require('../validations/dynamicValidation/dynamic.validations');
const { findCommonGroups } = require('../services/user.service');
const { getGroupWalletByGroupId } = require('../services/user.service');
const ReportedUser = require('../models/reportedUser.model');
const User = require('../models/user.model');

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
    res.status(httpStatus.OK).send({ message: 'Friends List', data: { friends } });
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

const groupSettings = catchAsync(async (req, res) => {
    const mergedBody = {
        userId: req.userId,
        owner_only_payment: req.body.owner_only_payment,
        group_name: req.body.group_name,
        group_icon: req.body.group_icon,
        groupId: req.params.group_id,
        currentDate: req.currentDate
    };
    const updatedGroup = await userService.updateGroupPreference(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Group Settings updated', data: updatedGroup });
})

const getMembersByGroupId = catchAsync(async (req, res) => {
    const mergedBody = {
        ...req.body,
        userId: req.userId,
        groupId: req.params.group_id,
        currentDate: req.currentDate
    };
    const groupsDetails = await userService.getMembersByGroupId(mergedBody);
    res.status(httpStatus.OK).send({ message: 'Group details fetched succesfully', data: { groupsDetails } });
});

const getMyGroups = catchAsync(async (req, res) => {
    const groupsList = await userService.getMyGroups(req.userId);
    res.status(httpStatus.OK).send({ message: 'Group list fetched succesfully', data: { groupsList } });
});

const getGroup = async (req, res) => {
    const groupId = req.params.group_id;
    try {
        const group = await userService.getGroupById(groupId);
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getUserDetails = catchAsync(async (req, res) => {
    const userId = req.params.user_id
    const userDetails = await userService.getUserDetails(userId);
    res.status(httpStatus.OK).send({ message: 'User details fetched succesfully', data: userDetails });
})
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

const uploadUserProfilePicture = catchAsync(async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} });
        }
        if (!req.file) {
            return res.status(httpStatus.BAD_REQUEST).send({ message: 'File upload failed', data: {} });
        }

        const relativePath = path.join('uploads', req.file.filename);

        // Update user's dp field
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found', data: {} });
        }

        user.dp = relativePath;
        await user.save();

        res.status(httpStatus.OK).json({ message: 'File uploaded successfully', imagePath: relativePath });
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

    if (!!!(await isGroupMember(req.userId, group_id))) {
        res.status(httpStatus.FORBIDDEN).send({ message: 'User is not part of this group' });
        return;
    }
    await userService.leaveGroup(mergedBody, req.userId);
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


const getAvailablePlans = async (req, res) => {
      const plans = await userService.getAvailablePlans();
      res.status(httpStatus.OK).json(plans);
  };

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

const getTransactions = catchAsync(async (req, res) => {
    const { userId } = req.params;
    console.log('userId from params:', userId);
    const transactions = await userService.getTransactions(userId);
    res.status(httpStatus.OK).send({ message: 'Transactions Fetched', data: { transactions } });
});


const getCommonGroups = async (req, res, next) => {
    console.log('GET common-groups  route was called');
    try {
        const { userId } = req.params;
        const currentUserId = req.userId; // Assuming you are using some middleware to get the current user's ID
        const commonGroups = await findCommonGroups(currentUserId, userId);

        res.status(httpStatus.OK).json(commonGroups);
    } catch (error) {
        console.log(req.userId);
        next(error);
    }
}

const getGroupWallet = catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const groupWallet = await getGroupWalletByGroupId(groupId);
    res.status(httpStatus.OK).send({ message: 'Group wallet fetched successfully', data: { groupWallet } });
});

const reportUser = async (req, res) => {
    try {
        const { reportedUserId, reportedUserName, reportMessage } = req.body;

        if (!reportedUserId || !reportedUserName || !reportMessage) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newReport = new ReportedUser({
            reportedUserId,
            reportedUserName,
            reportMessage
        });

        await newReport.save();

        res.status(201).json({ message: 'User reported successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const sendReminderFriend = async (req, res) => {
    const { mobileNumber, friendName, amount, link } = req.body;
  
    if (!mobileNumber || !friendName || !amount || !link) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    try {
      const result = await msgService.sendReminderFriend(mobileNumber, friendName, amount, link);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error sending reminder:', error);
      res.status(500).json({ error: 'An error occurred while sending the reminder.' });
    }
  };


module.exports = {
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
    getAvailablePlans,
    takePlan,
    getActivity,
    getUserDetails,
    groupSettings,
    getTransactions,
    getCommonGroups,
    getGroupWallet,
    reportUser,
    uploadUserProfilePicture,
    getGroup,
    sendReminderFriend 
};
