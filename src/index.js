import dotenv from "dotenv"
import mongoose from "mongoose";
// import name from constant
import {DB_NAME} from "./constants.js";

import connectDB from "./DB/index.js";

// improting express
import express  from "express";


dotenv.config({
    path:'./env'
})

const app=express()


console.log("\n",process.env.PORT);



connectDB()
.then(()=>{
    app.listen(process.env.PORT ||8000,()=>{
        console.log(`app is listining at ${process.env.PORT ||8000}`)
    })
})
.catch((error)=>{
    console.log("mongodb conection failed",error)
})



// we use a function and iffi
// iffi executte function onspot
// ( async()=>{
//     try{
//         // we have to use await for async  to manage delay
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("express can't conect to db",error);
//             throw error ;
//         })
//         app.listen(process.env.PORT(),()=>{
//             console.log(`App is listining as post ${process.env.PORT()}`)
//         })

//     } 
//     catch(error){
//         console.error("error",error);
//         throw error
//     }   
// } ) ( )

