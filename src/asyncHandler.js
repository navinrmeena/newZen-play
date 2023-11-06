const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve().catch((error)=>next(error))
    }
}

export {asyncHandler}



const asyncHandler1=(fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code||500).json({
            succes:false,
            message:err.message
        })
    }
}

// this is second function and both can be use 
