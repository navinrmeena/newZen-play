import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models";
import { ApiResponse } from "../utils/ApiResponse";


export const verifyJWT=asyncHandler(async(req,res,next)=>{
   try {
     const token=req.cookies?.accessToken || req.header("Auhorization")?.replace("bearer ","")
 
     if(!token){
         throw new ApiError(401,"Unautorized request ")
     }
     const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRTE)
 
     const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!user){
         throw new ApiError(401,"Invalid Access Token")
     }
 
     req.user=user;
     next()
   } catch (error) {
    throw new ApiError(401,error?.message ||"Invalid Access Token")
    
   }


})