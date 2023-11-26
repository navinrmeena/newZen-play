import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError}  from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser=asyncHandler(async (req,res)=>{
    
    const {fullName,email, username ,password}=req.body
    console.log("email",email);

    if(
        [fullName,email,password,username].some((field)=>
    field?.trim()==="")
    ){
        throw new apiError(400,"All field is required ");
    }

    const existedUser= User.findOne(
        {
            $or:[{username},{email}]
        }
    )
    if(existedUser){
        throw apiError(409,"user with same username or email exist ")
    }

    const avatarlocalpath=req.files?.avatar[0]?.path
    const coverimagelocalpath=req.files?.coverimage[0]?.path    

    if(!avatarlocalpath){
        throw apiError(400,"avatar file is required ")
    }

    const avatar=await uploadOnCloudinary(avatarlocalpath);
    const coverimage=await uploadOnCloudinary(coverimagelocalpath)

    if(!avatar){
        throw apiError(400,"avatar file is required ")
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
        throw apiError(500,"something went wrong while user registration  ")
    }

    return req.status(201).json(
       new ApiResponse(200,createdUser,"user registered sucsesfully ")
    )

    
})










const registerlogin=asyncHandler(async (req,res)=>{
    res.status(200).json({
        logedin :true
    })
})


export {registerUser}
export {registerlogin}
