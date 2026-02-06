
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'skillbridge_uploads', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'zip'],
        resource_type: 'auto', // Allow images, raw files, video, etc.
    },
});

module.exports = {
    cloudinary,
    storage
};
