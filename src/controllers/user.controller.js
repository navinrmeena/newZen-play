import {asyncHandler} from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js'


const registerUser=asyncHandler(async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    
    const {fullName,email, username ,password}=req.body
    // console.log("email",email);

    if(
        [fullName,email, username ,password].some((field)=>
    field?.trim()==="")
    ){
        throw new ApiError(400,"All field is required ");
    }

    const  existedUser= await User.findOne(
        {
            $or:[{username},{email}]
        }
    )
    if(existedUser){
        throw new ApiError(409,"user with same username or email exist ")
    }
    
    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverimagelocalpath=req.files?.coverimage[0]?.path;  
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarlocalpath){
        throw new  ApiError(400,"avatar file is required ")
    }

    const avatar=await uploadOnCloudinary(avatarlocalpath);
    const coverimage=await uploadOnCloudinary(coverimagelocalpath)

    if(!avatar){
        throw new ApiError(400,"avatar file is required ")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverimage:coverimage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while user registration  ")
    }

    return req.status(201).json(
       new ApiResponse(200,createdUser,"user registered sucsesfully ")
    )

})

export {registerUser}

