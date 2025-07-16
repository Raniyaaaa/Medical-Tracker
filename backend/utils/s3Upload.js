const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  const content = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `records/${Date.now()}_${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const data = await s3.upload(content).promise();
  return data.Location;
};

module.exports = uploadToS3;
