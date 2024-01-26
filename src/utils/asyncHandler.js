const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}


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

export {asyncHandler}
// this is second function and both can be use 
