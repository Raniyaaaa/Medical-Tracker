const AWS = require('aws-sdk');

// AWS Config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Uploads file buffer to S3
 * @param {*} fileBuffer — Buffer (from req.file.buffer)
 * @param {*} fileName — Unique file name
 * @param {*} mimeType — Content-Type
 * @returns file URL
 */
const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `records/${Date.now()}_${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};

module.exports = uploadToS3;
