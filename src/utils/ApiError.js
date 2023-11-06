class ApiError extends Error{
    constructor(
        status,
        message="Something went wrong",
        errors=[],
        statck=""
    ){
        super(message)
        this.statusCode=this.statusCode
        this.data=null
        this.message=message
        this.success=false;
        this.error=errors

        if(this.stack){
            this.stack=statck
        }else{
            error.captureStackTrace(this,this.constructor)
        }
        

    }

}



export {ApiError}