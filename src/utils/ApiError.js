class ApiError extends Error{
    constructor(
        status,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=this.statusCode
        this.data=null
        this.message=message
        this.success=false;
        this.error=errors

        if(this.stack){
            this.stack=stack
        }else{
            error.captureStackTrace(this,this.constructor)
        }
        

    }

}



export {ApiError}