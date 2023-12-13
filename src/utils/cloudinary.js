import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { url } from 'inspector';
// fs is nodejs propertis

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const uploadOnCloudinary=async (localPath)=>{
    try {
        if(localPath){
           const response=await cloudinary.uploader.upload(localPath,{
                resource_type:'auto'
            });
            console.log("file is uploaded on cloudinary",url);
            fs.unlinkSync(localPath);
            return response;


            // here it is syntex of cloudinary to upload files
            // we can give any url ,localfile address

        }
        else{
            const notfound="local path not found";
            return notfound
        }
    } catch (error) {
        fs.unlinkSync(localPath)
        // this will remove locall uploaded file is anything gone wrong
        return null; 

    }
}

export {uploadOnCloudinary};



