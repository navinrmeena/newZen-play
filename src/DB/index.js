import mongoose from "mongoose";
import express from "express";
import {DB_NAME} from "../constants.js"
// import { env } from "process";




const connectDB=async()=>{
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DB Connected at",`${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("error ->",error);
        process.exit(1);
    }
}


export default connectDB;