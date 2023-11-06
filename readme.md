# creating a vedio streaming plathform 
 
-[model-link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj) 

1. we create folder git but git does not track folders so we also add one file (.gitkeep)

2. and for file git ignore we use gitingnore  online genration it give us all ignored file text genrated

3. we create src folder and add app.js ,index.js

4. then we add type:"module"  in  json 

5. we install nodemon which automaticly start stop server 
    to install it we use commond (npm i -d nodemon) 
    then we add 
      "scripts": {"dev":"nodemon src/index.js"
      },
6. now we make new folders : 
                          
        mkdir controllers DB middlewares models routes utils 
 
 7. in env we set ``PORT``,



# Database setup 
  we use moongo db 
  first we  go to mongobd atlest to set up account 

  then  we set ``` MONGOBD_URI ```  in ENV 

we can create/ conect DB in two ways.



we can create/ conect DB in two ways.

- by writing code in index file which will execute as index file is executed
- another way is to write code in diffrent file and this code is clean and modular 

we have to add three npm package dotenv,mongoose,express
 `npm  -i dotenv express mongoose`

while useing databse alway remember two things 
1. db is always in another continante  it means to connect bd it will need time so use ASYNC
2. alway use try catch or promiss to handle errors.

code for connecting in index.js

this is our first approch 
```
  import mongoose from "mongoose";
// import name from constant
import {DB_NAME} from "./constants";

// improting express
import express  from "express";
const app=express()

// we use a function and iffi
// iffi executte function onspot
( async()=>{
    try{
        // we have to use await for async  to manage delay
        await mongoose.connect(`${process.env.MONGOBD_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("express can't conect to db",error);
            throw error
        })
        app.listen(process.env.PORT,()={
            console.log(`app is listening on ${process.env.PORT }`)
        })

    } 
    catch(error){
        console.error("error",error);
        throw error
    }   
} ) ( )
  ```


now second approch 

we make index.js in "./scr/DB"
  ```import mongoose from "mongoose";
import express from "express";
import {DB_NAME} from "./constant"




const connectDB=async()=>{
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGOBD_URI}/${DB_NAME}`)
        console.log("DB Connected at",`${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("error",error);
    }
}


export default connectDB;
```





# how listing of site 

1. we add express in app.js

    ```import express from "express"
      const app=express();
      export {app};
      ```

2. as our db code is async  so after calling that function we get a promiss so we add .then(),.catch()
  
  ```
  DBconnect()
  .then(()=>{
    app.listen(process.env.PORT||8000,()=>{
      console.log(`site is running at port : ${process.env.PORT||8000}`)
    })
  })
  .catch(()=>{
    console.log("db connection error ")
  })

  ```


- install 
```import cookieParser from "cookie-parser";
import cors from "cors";
```

and add in app.js

  ```import cookieParser from "cookie-parser";
  import cors from "cors";
  
  app.use(cors({
    origin: process.env.cors_origin,
    crediantials:true
  }))
  ```

cors can be modified by changing object which contains setting of it


  now add cors_origin in .env file 
  ```
  cors_origin=*
  ```

  here * means any one can asses but we ca set specific domain while hosting 

- now set we have to limit incoming data limit such as json limit to 16kb

```
  app.use(express.json({
    limit:16kb
  }))
  app.use(express.urlencoded({
    limit:16kb
  }))
  app.use(express.static("public"))

  app.use(cockieparser)
```

# middleware 
 - while taking data and sending (like from api) checking a validation (like user is loged in or not) 
 is called middle ware

 (error,req,res,next)
    

# asyncHandler.js

we make asyncHandler.js in ./scr/utils
- type 1  promises
```
  const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
      promiseresolve(requestHandler(req,res,next)).catch(error)=>next(err)
    }
  }
```


- type 2   try/catch method 

```
  const asyncHandler=(fn)=>async (req,res,next)=>{
    try{
      await fn(req,res,next)
    }catch (error){
      res.status(err.code ||500).json({

        sucess:fasle,
        essage:err.message
      })
    }
  }
```

we can use any one of them 


# ApiError

1. we make ApiError.js file in src/utils in which we add a class extendes error which is a node error class
here we standrise all the parameters which have to send during error

```
  class ApiError extends error {
    constructor(
      statusCode,
      message="something went wrong"
      errors=[],
      statck=""
      ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false;
        this.errors=errors


        if(statck){
          this.statck=statck
        }else{
          error.captureStacktrace(this,this.constructor)
        }
      }
  }
```
# ApiResponse

- male a file in ./scr/util  name ApiResponse.js

```
  class ApiResponse{
    constructor(statusCode,data,message="Success){
      this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=tatusCode
    }
        
  }
```