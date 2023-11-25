class ApiResponse{
    constructor(statusCode,data,message="succes"){
        this.message=message
        this.data=data
        this.statusCode=statusCode
        this.succes= statusCode <400
    }
}
