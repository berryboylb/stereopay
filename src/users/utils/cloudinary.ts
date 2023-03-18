import { v2 as cloudinary } from 'cloudinary';
import dotenv = require('dotenv');
import { BadRequestException } from '@nestjs/common';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = async (file: string, folder: string) => {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: 'auto', // to allow audio and video upload
  });
  if (result.error)
    throw new BadRequestException(
      'An error ocuured with uploading the file try another',
    );
  return {
    url: result.secure_url,
    id: result.asset_id,
  };
};

export default cloudinary;
