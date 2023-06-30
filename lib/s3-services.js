const AWS = require("aws-sdk");
const fs = require("fs");
const Helper = require('../config/helper');
const { logger } = require('../logger/winston');
// const { AWS_SPACE_KEY_ID, AWS_SPACE_ACCESS_KEY, AWS_SPACE_BUCKET } = process.env;
const s3 = new AWS.S3({
  apiVersion: "2012-11-05",
  region: process.env.S3_region,
  accessKeyId: process.env.AWS_SPACE_KEY_ID,
  secretAccessKey: process.env.AWS_SPACE_ACCESS_KEY,
  params: { Bucket: process.env.AWS_SPACE_BUCKET },
});

// Is working 17-02-2023
exports.getSyncSignedUrl = (fileName, fileType) => {
  if (fileName !== undefined && fileName !== "") {
    const url = s3.getSignedUrl("getObject", {
      Key: fileName,
      ResponseContentType: fileType,
      Expires:604800  // 7 * 24 * 60 * 60, // Link will expire in 7 days in sec
    });
    return url;
  }
  return "";
};
// Is working 17-02-2023
exports.deleteFile = (fileKeyObj) => {
  const params = {
    Bucket: process.env.AWS_SPACE_BUCKET,
    Delete: {
      Objects: [
        {
          Key: fileKeyObj,
        },
      ],
    },
  };
  s3.deleteObjects(params, function (err, data) {
    console.log(data);
    if (err) {
      console.log(err);
    }
  });
};
// Is working 17-02-2023
exports.existsFile =async (bucket,Key) => { 
      let exists =  await s3.headObject({
                      Bucket: bucket,
                      Key: Key,
                    }).promise()
                    .then(
                      () => true,
                      err => {
                      if (err.code === 'NotFound') { 
                        return false;
                      } 
                      throw err;
                      }
                    ); 
        return exists;
    
}






