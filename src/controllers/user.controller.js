import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser=asyncHandler(async (req,res)=>{
        res.status(200).json({
            message:"ok"
        })
})


const registerlogin=asyncHandler(async (req,res)=>{
    res.status(200).json({
        logedin :true
    })
})


export {registerUser}
export {registerlogin}
