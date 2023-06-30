const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const shiftModel = require('../models/ShiftModel');
const shiftSlotModel = require('../models/ShiftSlotModel');
const supplierServicesModel = require('../models/SupplierServicesModel');
const supplierServiceStaffModel = require('../models/SupplierServiceStaffModel');
const ratingModel = require('../models/RatingModel');
const productRangeModel = require('../models/ProductRangeModel');
const moment = require('moment');
const { getSyncSignedUrl, deleteFile, existsFile } = require('../lib/s3-services');
const daycareServiceModel = require('../models/DaycareServiceModel');
const daycareServicePriceModel = require('../models/DaycareServicePriceModel');

const { logger } = require("../logger/winston");
/*
 * --------------------------------------------------------------------------
 * @ Function Name            : Add Data ShiftModel
 * @ Added By                 : Fakhruddin
 */
const saveShift = async(payload) => {
    try {
        let shift = new shiftModel(payload);
        let data = await shift.save();
        return data._id;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
/*
 * --------------------------------------------------------------------------
 * @ Function Name            : Add Data ShiftSlotModel
 * @ Added By                 : Fakhruddin
 */
const saveShiftSlot = async(payload) => {
    try {
        await shiftSlotModel.insertMany(payload);
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
/*
 * --------------------------------------------------------------------------
 * @ Function Name            : Add Data SupplierServicesModel
 * @ Added By                 : Fakhruddin
 */
const saveSupplierServices = async(payload) => {
    try {
        let supplierServices = new supplierServicesModel(payload);
        let data = await supplierServices.save();
        return data._id;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};

/*
 * --------------------------------------------------------------------------
 * @ Function Name            : Add Data SupplierServiceStaffModel
 * @ Added By                 : Fakhruddin
 */
const saveSupplierServiceStaff = async(payload) => {
    try {
        await supplierServiceStaffModel.insertMany(payload);
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
// Update Service Related Query...
const updateShift = async(payload, shiftId) => {
    try {
        await shiftModel.findOneAndUpdate({ _id: ObjectId(shiftId) }, { $set: payload }, { new: true, useFindAndModify: false });
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};

const deleteShiftSlot = async(shiftId) => {
    try {
        await shiftSlotModel.deleteMany({ shiftId: shiftId });
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
const deleteSupplierServices = async(supplierServiceId) => {
    try {
        await supplierServicesModel.remove({ _id: ObjectId(supplierServiceId) });
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
const updateSupplierServices = async(payload, supplierServiceId) => {
    try {
        await supplierServicesModel.findOneAndUpdate({ _id: ObjectId(supplierServiceId) }, { $set: payload }, { new: true, useFindAndModify: false });
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};

const deleteSupplierServiceStaff = async(supplierServiceId) => {
    try {
        await supplierServiceStaffModel.deleteMany({ supplierServiceId: ObjectId(supplierServiceId) });
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};

// fetch DB query...
const fetchSupplierService = async(supplierId) => {
    try {
        let query = [
            { $match: { supplierId: ObjectId(supplierId), "status": "Active" } },
            { "$lookup": { "from": "SupplierService", "localField": "_id", "foreignField": "shiftId", "as": "serviceDetails" } },
            { "$lookup": { "from": "SupplierServicePrice", "localField": "serviceDetails._id", "foreignField": "supplierServiceId", "as": "servicePriceDetails" } },
            { "$lookup": { "from": "SupplierServiceStaff", "localField": "serviceDetails._id", "foreignField": "supplierServiceId", "as": "serviceStaffDetails" } },
            // {"$lookup": {"from": "ServiceCategory","localField": "serviceCategoryId","foreignField": "_id","as": "categoryDetails"}},
            // {"$lookup": {"from": "ServiceType","localField": "serviceDetails.serviceTypeId","foreignField": "_id","as": "catTypeDetails"}},
            // {"$lookup": {"from": "petcategories","localField": "servicePriceDetails.petId","foreignField": "_id","as": "petCatDetails"}},
            // {"$lookup": {"from": "petsizes","localField": "servicePriceDetails.petSizeId","foreignField": "_id","as": "petSizeDetails"}},
            {
                "$project": {
                    "shiftTime": 1,
                    "durationInHours": 1,
                    "shiftName": 1,
                    "status": 1,
                    "serviceCategoryId": 1,
                    "supplierId": 1,
                    // "slotDetStartTime" : "$slotDetails.startTime","slotDetEndTime" : "$slotDetails.endTime",
                    "serviceDet._id": "$serviceDetails._id",
                    "serviceDet.supplierId": "$serviceDetails.supplierId",
                    "serviceDet.serviceCategoryId": "$serviceDetails.serviceCategoryId",
                    "serviceDet.serviceTypeId": "$serviceDetails.serviceTypeId",
                    "serviceDet.shiftId": "$serviceDetails.shiftId",
                    "servicePriceDet.supplierServiceId": "$servicePriceDetails.supplierServiceId",
                    "servicePriceDet.petId": "$servicePriceDetails.petId",
                    "servicePriceDet.petSizeId": "$servicePriceDetails.petSizeId",
                    "servicePriceDet.price": "$servicePriceDetails.price",
                    "serviceStaffDet.supplierServiceId": "$serviceStaffDetails.supplierServiceId",
                    "serviceStaffDet.serviceTypeId": "$serviceStaffDetails.serviceTypeId",
                    "serviceStaffDet.startTime": "$serviceStaffDetails.startTime",
                    "serviceStaffDet.endTime": "$serviceStaffDetails.endTime",
                    "serviceStaffDet.noOfPeople": "$serviceStaffDetails.noOfPeople",
                    // "categoryDet._id":"$categoryDetails._id",
                    // "categoryDet.serviceName":"$categoryDetails.serviceName",
                    // "catTypeDet._id":"$catTypeDetails._id",
                    // "catTypeDet.serviceTypeName":"$catTypeDetails.serviceTypeName",
                    // "petCatDet._id":"$petCatDetails._id",
                    // "petCatDet.name":"$petCatDetails.name",
                    // "petSizeDet._id":"$petSizeDetails._id",
                    // "petSizeDet.size":"$petSizeDetails.size",

                }
            }
        ];
        return query;
    } catch (error) {

    }
};
const getSupplierRating = async(supplierId) => {
    try {
        let query = [
            { $match: { supplierId: ObjectId(supplierId) } },
            { $group: { _id: { supplierId: "$supplierId" }, count: { $sum: 1 }, rating: { $avg: "$rating" } } },
            {
                "$project": {
                    _id: 0,
                    rating: 1,
                    totalRecord: "$count",
                    supplierId: "$_id.supplierId"
                }
            }
        ];
        const isExists = await ratingModel.aggregate(query);
        return (isExists) ? isExists : []
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
const deleteProductRange = async(productId) => {
    try {
        await productRangeModel.deleteMany({ productId: ObjectId(productId) });
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
const deleteDaycareService = async(payload) => {
    try {
        await daycareServiceModel.deleteMany(payload);
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
const deleteDaycareServicePrice = async(payload) => {
    try {
        await daycareServicePriceModel.deleteMany(payload);
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};
/*
 * --------------------------------------------------------------------------
 * @ Function Name            : Add Data
 * @ Added By                 : Fakhruddin
 */
const saveDaycareService = async(payload) => {
    try {
        await daycareServiceModel.insertMany(payload);
        return true;
    } catch (error) {
        logger.error(`####### Insert failed ######### error: ${error} `);
        throw new Error(error);
    }
};

const fetchBooking = async(queryData) => {
    try {
        let query = [
            { $match: queryData },
            { "$lookup": { "from": "Customer", "localField": "customerId", "foreignField": "_id", "as": "customerDetail" }, },
            { $unwind: "$customerDetail" },
            { "$lookup": { "from": "Suppliers", "localField": "supplierId", "foreignField": "_id", "as": "supplierDetail" }, },
            { $unwind: "$supplierDetail" },
            { "$lookup": { "from": "PetCategory", "localField": "petCategoryId", "foreignField": "_id", "as": "petType" }, },
            { $unwind: "$petType" },
            { "$lookup": { "from": "ServiceCategory", "localField": "serviceCategoryId", "foreignField": "_id", "as": "categoryDetails" }, },
            { $unwind: "$categoryDetails" },
            { "$lookup": { "from": "BookingPet", "localField": "_id", "foreignField": "bookingId", "as": "bookingPet" }, },
            { "$lookup": { "from": "CustomerPet", "localField": "bookingPet.userPetId", "foreignField": "_id", "as": "userPetDetails" }, },
            { "$lookup": { "from": "PetBreed", "localField": "userPetDetails.breedId", "foreignField": "_id", "as": "breedDetails" }, },
            { "$lookup": { "from": "PetSize", "localField": "userPetDetails.petSizeId", "foreignField": "_id", "as": "petSizeDetails" }, },
            {
                "$project": {
                    "bookingDate": "$bookingDate",
                    "bookingTime": "$bookingTime",
                    "status": "$status",
                    "paymentId": "$paymentId",
                    "paymentStatus": "$paymentStatus",
                    "totalPrice": "$totalPrice",
                    "slotKey": "$slotKey",
                    "slotCount": "$slotCount",
                    "invoiceNumber": "$invoiceNumber",
                    "commentMessage": "$commentMessage",
                    "isCommentMessage": "$isCommentMessage",
                    "customerName": "$customerDetail.name",
                    "customerCountryCode": "$customerDetail.Country_Code",
                    "customerMobile": "$customerDetail.mobile",
                    "customerEmail": "$customerDetail.email",
                    "customerStreetAddress": "$customerDetail.streetAddress",
                    "petName": "$petType.name",
                    "categoryServiceName": "$categoryDetails.serviceName",
                    "supplierName": "$supplierDetail.supplierName",
                    "supplierCountryCode": "$supplierDetail.countryCode",
                    "supplierMobile": "$supplierDetail.mobile",
                    "supplierBusinessName": "$supplierDetail.businessName",
                    "supplierAddress": "$supplierDetail.address",
                    "supplierBusinessTagLine": "$supplierDetail.businessTagLine",
                    "businessLogoS3Key": "$supplierDetail.businessLogoS3Key",
                    "businessLogoImgName": "$supplierDetail.businessLogoImgName",
                    // "bookingPet": 1,
                    // "userPetDetails": 1,
                    // "breedDetails": 1,
                    // "petSizeDetails": 1,
                    "docs": { // transform the "docs" field
                        $map: { // into something
                            input: { $range: [ 0, { $size: "$bookingPet" } ] }, // an array from 0 to n - 1 where n is the number of documents
                            as: "this", // which shall be accessible using "$$this"
                            in: {
                                $mergeObjects: [ // we join two documents
                                    { $arrayElemAt: [ "$bookingPet", "$$this" ] }, // one is the nth document in our "docs" array
                                    { $arrayElemAt: [ "$userPetDetails", "$$this" ] },
                                    { $arrayElemAt: [ "$breedDetails", "$$this" ] },
                                    { $arrayElemAt: [ "$petSizeDetails", "$$this" ] },
                                    //{ "index": { $concat: [ 'INV-00', { $substr: [ { $add: [ "$$this", 1 ] }, 0, -1 ] } ] } } // and the second document is the one with our "index" field
                                ]
                            }
                        }
                    }
                }
            }
        ];
        // logger.error(`####### query ######### error: ${JSON.stringify(query)} `);
        return query;
    } catch (error) {

    }
};

const bindBookingData = async(myData) => {
    let bindData = {
        "_id":myData[0]._id,
        "bookingDate":moment(myData[0].bookingDate).format('Do MMMM, YYYY'),
        "bookingTime":myData[0].bookingTime,
        "status":myData[0].status,
        "paymentId":myData[0].paymentId,
        "paymentStatus":myData[0].paymentStatus,
        "totalPrice":myData[0].totalPrice,
        "slotKey":myData[0].slotKey,
        "slotCount":myData[0].slotCount,
        "invoiceNumber":myData[0].invoiceNumber,
        "commentMessage":myData[0].commentMessage,
        "isCommentMessage":myData[0].isCommentMessage,
        "customerName":myData[0].customerName,
        "customerCountryCode":myData[0].customerCountryCode,
        "customerMobile":myData[0].customerMobile,
        "customerEmail":myData[0].customerEmail,
        "customerStreetAddress":myData[0].customerStreetAddress,
        "petName":myData[0].petName,
        "categoryServiceName":myData[0].categoryServiceName,
        "supplierName":myData[0].supplierName,
        "supplierCountryCode":myData[0].supplierCountryCode,
        "supplierMobile":myData[0].supplierMobile,
        "supplierBusinessName":myData[0].supplierBusinessName,
        "supplierAddress":myData[0].supplierAddress,
        "supplierBusinessTagLine":myData[0].supplierBusinessTagLine,
        "businessLogoImgName": await getSyncSignedUrl(myData[0].businessLogoS3Key, 'image/jpg'),
    }
    return bindData;
}
module.exports = {deleteDaycareServicePrice,bindBookingData, deleteDaycareService,saveShift, saveShiftSlot, saveSupplierServices, saveSupplierServiceStaff, fetchSupplierService, updateShift, deleteShiftSlot, deleteSupplierServices, updateSupplierServices, deleteSupplierServiceStaff, getSupplierRating,deleteProductRange,saveDaycareService,fetchBooking };