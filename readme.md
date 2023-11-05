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


export default connectDB;```