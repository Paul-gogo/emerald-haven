import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ public_id: publicId }, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
};
