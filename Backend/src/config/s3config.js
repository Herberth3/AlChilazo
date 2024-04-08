const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortId = require('shortid');
const { Readable } = require("stream");
require('dotenv').config();
let s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldname})
        },
        key: function (req, file, cb) {
          cb(null, shortId.generate() + '-' + file.originalname);
        },
    })
});

/*async function uploadFileToS3(file) {
    
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: shortId.generate() + '-' + file.originalname,
      //Body: Readable.from(file.buffer),
      ContentType: file.mimetype,
    };
  
    const command = new PutObjectCommand(uploadParams);
  
    try {
      const response = await s3.send(command);
      console.log("Archivo subido exitosamente:", response);
      return response;
    } catch (error) {
      console.error("Error al subir el archivo a S3:", error);
      throw error;
    }
}*/

module.exports = {upload};