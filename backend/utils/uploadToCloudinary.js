import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = async (fileBuffer, folder, mimetype) => {
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:${mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder
  });

  return {
    public_id: result.public_id,
    secure_url: result.secure_url
  };
};
