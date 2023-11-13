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
```js
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
  ```js
import mongoose from "mongoose";
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
```js
  const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
      promiseresolve(requestHandler(req,res,next)).catch(error)=>next(err)
    }
  }
```


- type 2   try/catch method 

```js
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

```js
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

# Modeling 
first we make a file in models (user.models.js   vedio.models.js)


1)  # users->

    - in user model we add 
      ![Alt text](image.png)


      to write user model we write a code 

```js

          import mongoose ,{Schema} from "mongoose";

    const userSchema=new Schema(
        {
            username:{
                type:String,
                required:true,
                unique:true,
                lowercase:true,
                trim:true,
                index:true
            },
            // to any fiels if we want to add searching function 
            // make sure to add index field
            email:{
                type: String,
                required:true,
                unique:true,
                lowercase:true,
                trim:true
            },
            fullname:{
                type: String,
                required:true,
                lowercase:true,
                trim:true
            },
            avatar:{
                type: String, //here we use third party service like cloudniary url
                required:true,
            },
            coverimage:{
                type: String, //here we use third party service like cloudniary url
            },
            WatchHistory:{
                type:Schema.type.ObjectId,
                ref:"Vedio"
            },
            password:{
                type:String,
                required:[true,"pasword is required"] //we can give a coustom message with true

            }

        } ,{
            timestamps:true,

        }
    )


    export const User= mongoose.model("User",userSchema);

```


1)  # Video->
    ![Alt text](image-1.png)

``` js

  import mongoose, {Schema} from "mongoose";

const video=new Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.ObjectId,
        ref:"owner",
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, //cloudinary
        default:0

    },
    views:{
        type:Number,
        required:[true,0],

    },
    isPublish:{
        type:Boolean,
        default:true
    }

})


export const Vedio=mongoose.model("Video",video);


```

now we install mongoose-aggregate-paginate-v2
by
``
npm i mongoose-aggregate-paginate-v2
``
this  will help to use mongoose aggrigate framework

now we import mongoose-aggregate-paginate in vedios.model.js by
 ``
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
``

and after our const schema of vedo we use 
``
videoSchema.plugins(mongooseAggregatePaginate);
``
 and now our code becomes 
 ```js
  import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.ObjectId,
        ref:"owner",
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, //cloudinary
        default:0

    },
    views:{
        type:Number,
        required:[true,0],

    },
    isPublish:{
        type:Boolean,
        default:true
    }

})

videoSchema.plugins(mongooseAggregatePaginate);

export const Vedio=mongoose.model("Video",videoSchema);

 

 ```


 now we intall bcrypt  and   jsonwebtoken by ``npm i bcrypt``

 1) bcrypt : A library to help you hash passwords.
 now  we install jsonwebtoken by ``npm i jsonwebtoken``

2) jsonwebtoken: JWT stands for JSON Web Token. It is an open standard for securely transmitting information between parties as a JSON object. It is commonly used for authentication and authorization purposes in web applications.



now in user.model.js file 
we import jwt and bcrypt
``
import  Jwt  from "jsonwebtoken";
``

``
import bcrypt from"bcrypt";
``

now our code become
```js
  import mongoose ,{Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from"bcrypt";


const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        // to any fiels if we want to add searching function 
        // make sure to add index field
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type: String,
            required:true,
            lowercase:true,
            trim:true
        },
        avatar:{
            type: String, //here we use third party service like cloudniary url
            required:true,
        },
        coverimage:{
            type: String, //here we use third party service like cloudniary url
        },
        WatchHistory:{
            type:Schema.type.ObjectId,
            ref:"Vedio"
        },
        password:{
            type:String,
            required:[true,"pasword is required"] //we can give a coustom message with true

        }

    } ,{
        timestamps:true,

    }
)


export const User= mongoose.model("User",userSchema);

```

now we can not directly encrypt data we have to use hook
of mongoose

so we use PRE from mongoose 

- PRE - Pre middleware functions are executed one after another, when each middleware calls next.
```


userSchema.pre("save", async function(next){
    if(this.isModifid("password")){
        this.password=bcrypt.hash(this.password,10)
        // bcrypt.hash(this.password,10) is the method of bcrypt and 10= 10 times
    next();
    }
    // here we add this if because we dont want that every time save event called and password cahnges
    // like is user change avitar and save event called and here 
    // our pre changes password again

    return next();
    
})


// here in pre "save" is event we can read more on monngose website
// and in  pre we dont use arrow function because it doest not have this key word
// this type of funcaton always take time so we use async

```



our new user.models.js becomes
```js
  import mongoose ,{Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from"bcrypt";


const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        // to any fiels if we want to add searching function 
        // make sure to add index field
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type: String,
            required:true,
            lowercase:true,
            trim:true
        },
        avatar:{
            type: String, //here we use third party service like cloudniary url
            required:true,
        },
        coverimage:{
            type: String, //here we use third party service like cloudniary url
        },
        WatchHistory:{
            type:Schema.type.ObjectId,
            ref:"Vedio"
        },
        password:{
            type:String,
            required:[true,"pasword is required"] //we can give a coustom message with true

        }

    } ,{
        timestamps:true,

    }
)

userSchema.pre("save", async function(next){
    if(this.isModifid("password")){
        this.password=bcrypt.hash(this.password,10)
        // bcrypt.hash(this.password,10) is the method of bcrypt and 10= 10 times
    next();
    }
    // here we add this if because we dont want that every time save event called and password cahnges
    // like is user change avitar and save event called and here 
    // our pre changes password again

    return next();
    
})


// here in pre "save" is event we can read more on monngose website
// and in  pre we dont use arrow function because it doest not have this key word
// this type of funcaton always take time so we use async

export const User= mongoose.model("User",userSchema);

```



we add password compare function 
in moongoose we can add coustom functions 


now our code looks like 
```js
  import mongoose ,{Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from"bcrypt";


const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        // to any fiels if we want to add searching function 
        // make sure to add index field
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type: String,
            required:true,
            lowercase:true,
            trim:true
        },
        avatar:{
            type: String, //here we use third party service like cloudniary url
            required:true,
        },
        coverimage:{
            type: String, //here we use third party service like cloudniary url
        },
        WatchHistory:{
            type:Schema.type.ObjectId,
            ref:"Vedio"
        },
        password:{
            type:String,
            required:[true,"pasword is required"] //we can give a coustom message with true

        }

    } ,{
        timestamps:true,

    }
)

userSchema.pre("save", async function(next){
    if(this.isModifid("password")){
        this.password=bcrypt.hash(this.password,10)
        // bcrypt.hash(this.password,10) is the method of bcrypt and 10= 10 times
    next();
    }
    // here we add this if because we dont want that every time save event called and password cahnges
    // like is user change avitar and save event called and here 
    // our pre changes password again

    return next();
    
})


// here in pre "save" is event we can read more on monngose website
// and in  pre we dont use arrow function because it doest not have this key word
// this type of funcaton always take time so we use async

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password);
    // bcrypt.compare(password,this.password);
    // in this  bcrypt compare our password given by user and saved password 
}

export const User= mongoose.model("User",userSchema);

```

now we add ACCESS_TOKEN  we can set it like password or random in .env file
``
ACCESS_TOKEN_SECRTE=l!XtnVIaRKuc-YLBb1Zw/v33O2RkLV0Ml4K9DkOa-7y3hZNsrXfPbD8u0ie8eW1u
``

``
ACCESS_TOKEN_EXPIRY=1d
``

``
REFRESH_TOKEN_SECTRE=v3kSWK3A4qLSVM=UI1?
``

``
REFRESH_TOKEN_EXPIRY=10d
``



we make function in user.model.js 

jwt.sign is a function used in JavaScript to create a JSON Web Token (JWT) by signing a payload with a secret key. The resulting JWT can be used for authentication and authorization purposes. Is there anything specific you would like to know about jwt.sign?
```
  userSchema.method.genrateAccestoken= async function(){
    return  Jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRTE,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.method.genrateRefreshtoken= async function(){
    return  Jwt.sign(
        // jwt.sign is method which genrate token 
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECTRE,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


```



now our code in user.models.js becomes 
```js
import mongoose ,{Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from"bcrypt";


const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        // to any fiels if we want to add searching function 
        // make sure to add index field
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullName:{
            type: String,
            required:true,
            lowercase:true,
            trim:true
        },
        avatar:{
            type: String, //here we use third party service like cloudniary url
            required:true,
        },
        coverimage:{
            type: String, //here we use third party service like cloudniary url
        },
        WatchHistory:{
            type:Schema.type.ObjectId,
            ref:"Vedio"
        },
        password:{
            type:String,
            required:[true,"pasword is required"] //we can give a coustom message with true

        }

    } ,{
        timestamps:true,

    }
)

userSchema.pre("save", async function(next){
    if(this.isModifid("password")){
        this.password=bcrypt.hash(this.password,10)
        // bcrypt.hash(this.password,10) is the method of bcrypt and 10= 10 times
    next();
    }
    // here we add this if because we dont want that every time save event called and password cahnges
    // like is user change avitar and save event called and here 
    // our pre changes password again

    return next();
    
})


// here in pre "save" is event we can read more on monngose website
// and in  pre we dont use arrow function because it doest not have this key word
// this type of funcaton always take time so we use async

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password);
    // bcrypt.compare(password,this.password);
    // in this  bcrypt compare our password given by user and saved password 
}

// we can also make function for genrating assec token

userSchema.method.genrateAccestoken= async function(){
    return  Jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRTE,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.method.genrateRefreshtoken= async function(){
    return  Jwt.sign(
        // jwt.sign is method which genrate token 
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECTRE,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User= mongoose.model("User",userSchema);

```
# File Upload

for storing file we use mostly third party services like cloudniary 


so in cloudinary 
first we install it by ``npm install cloudinary``

we also use multer and install it by multer ```npm i multer``` alternative of multer is expess-fileupload


we make a different file for file handling we can name it as filehandling or clournary
some developer store it in utils and some in src  we are useing filehandling as utils



we use two steps to upload file on
1. we first take file on local server the
2. n we upload file to cloudinary 
3. then we remove file from local server


import {v2 as cloudinary} from 'cloudinary';
heree v2 as cloudinary means imported v2 but wr rename it as cloudinary

now we import fs

now we allso add name in .env 

```js
PORT=8000
MONGODB_URI=mongodb+srv://navinmeena:1234@cluster0.uxyz2t0.mongodb.net
CORS_ORIGIN=*
# HERE * MEAN  any domain can asses but we can also change name 
ACCESS_TOKEN_SECRTE=l!XtnVIaRKuc-YLBb1Zw/v33O2RkLV0Ml4K9DkOa-7y3hZNsrXfPbD8u0ie8eW1u
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECTRE=v3kSWK3A4qLSVM=UI1?96jTlN2Q5Fp8VTXjGi0LqIahcx0YZG/q0ImzSfslGgp08
REFRESH_TOKEN_EXPIRY=10d


CLOUDINARY_CLOUD_NAME:diexrevjz
CLOUDINARY_API_KEY:576434828249582
CLOUDINARY_API_SECRET:5Z-Ag3uVSsebqP__JUx1UdYYWcI

```
and the also link to cloudinary.js



now we make a function in cloudinary.js for uploading file

```js
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { url } from 'inspector';
// fs is nodejs propertis

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


const uploadOnCloudinary=async (localPath)=>{
    try {
        if(localPath){
           const response=await cloudinary.uploader.upload(localPath,{
                resource_type:'auto'
            });
            console.log("file is uploaded on cloudinary",url);
            return response;


            // here it is syntex of cloudinary to upload files
            // we can give any url ,localfile address

        }
        else{
            const notfound="local path not found";
            return notfound
        }
    } catch (error) {
        fs.unlinkSync(localPath)
        // this will remove locall uploaded file is anything gone wrong
        return null;

    }
}

export {uploadOnCloudinary};

```


# Multer middleware

first we make a file in middlewares with name multer.middlewarre.js

