import { v2 as cloudinary } from "cloudinary";

export const connectCloud = () => {
    if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            cloud_api_key: process.env.CLOUD_API_KEY,
            cloud_api_secret: process.env.CLOUD_API_SECRET
        });
        console.log("Cloudinary configured successfully");
    } else {
        console.log("Cloudinary credentials missing or incomplete");
    }
};

export default cloudinary;