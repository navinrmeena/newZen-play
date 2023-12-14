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

```js
 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
  }))
  app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
  }))
  app.use(express.static("public"))

  app.use(cookieParser());
```

our app.js becomes
```js
    import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
  }))
  app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
  }))
  app.use(express.static("public"))

  app.use(cookieParser());

export {app}
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
    return (req,res,next)=>{
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

```js
    import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // this commented part is use to genrate unique and systhematic name
      cb(null, file.originalname)
    }
  })

  
  export const upload = multer({ storage})


```



# HTTPS
HYPER TEXT TRANSFER PROTOCOL 
URL  UNIFORM RESOURSE LOCATOR
URI  UNIFORM RESOURSE IDENTIFIER
URN UNIFORM RESOURSE NAME

 
- what is headers ?
    meta-data - key value set along with req& res

    Request headers ->  from client 
    Response headers -> from server
    representtion headers -> encoding /compression
    payload headers -> data


 -https method
  GET:
  HEAD:
  OPTIONS :
  DELETE:
  PUT:
  POP:
  PUSH:



  HTTPS STATUS CODE

  1xx information
  2xx sucsuss
  3xx redirection
  4xx client eroe
  5xx server error
  


# CONTROLLERS

first we make file in folder controllers    name of file is ``` user.controllers.js```


```js
    import {asyncHandles} from '../utils/asyncHandler.js';

    const registerUser=asyncHandles(async (req,res)=>{
            res.status(200).json({
                message:"ok"
            })
    })
    export {registerUser}

```


# Routes

we make all the url link when they should call in this folder routes


we make file user.routes.js
```
    import { Router } from "express";

const router = Router();



export default router;



```

we improts routes in app.js files

mport userRouter from './routes/user.routes.js'

//   routes declarations 
but as our router are not in this current file so we have to use middle ware
so we use app.use("/useres",userRouter)
insteds of app.get()

our code in index.js is now===
```js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
  }))
  app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
  }))
  app.use(express.static("public"))

  app.use(cookieParser());

  //Routes import
  import userRouter from './routes/user.routes.js'

//   routes declarations 
app.use("/users",userRouter)


export {app}
```



now we add links in routes as we have called routes
```Router.route("/register").post(registerUser.js)```

our code in user.routes.js is now

```
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

Router.route("/register").post(registerUser.js)

export default router;



```

but now come back to app.js as we are calling api so only calling users is not good practice so we call it as "/api/v1/users"


app.use("/users",userRouter) ===  app.use("/api/v1/users",userRouter)
``http://localhost:8000/api/vl/users/register``


 JUST SMALL NOTES  

 -WHILE IMPORTING WE USE 
 ```import {DB_NAME} from "./constants.js";```

 when {....} is exported as defult 
 like 
 ```js 
 export default connectDB;
 ```

 other wise like
 ```js
 import mongoose from "mongoose";
 ```


- we fordeg to import app.js in index.js soo code changes and becomes

# index.js
```js
import dotenv from "dotenv"
import mongoose from "mongoose";
// import name from constant
import {DB_NAME} from "./constants.js";
import {app} from './app.js'
import connectDB from "./DB/index.js";

// improting express
import express  from "express";


dotenv.config({
    path:'./env'
})

// const app=express()


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


```


#  app.js 
```js
    import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
  }))
  app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
  }))
  app.use(express.static("public"))

  app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

export {app }
```



#  logic making for register user
1. get user details from frontend 
2. validate that details are not empty (mostly done by frontend but its better to check once more)
3. check if user  already exist or not check it by matching username,or email (apps like instargram use username its all depent on usecase)
4. check for image for avatar
5. upload then upload it to cloudinary 
6. create user object and upload it to DB 
7. check if user is sreated properly and then if created then send it to front end but make sure we remove password and tokan number 
8. resend res....

- get user details from frontend 

    so to get data we write code in user.conrtollers.js in ontrollers folder
     first we save incomming info in 
    ```js
    const {fullName,email,username,password}=req.body
    ```
    and also to test we print it into consol 
    and send resest by postman


-  now to handle files
    we first improt storage of multer which is middleware 
   by code
    ```js
        import {upload} from "…/middlewares/multer.middleware.js"

   ```
    and then we add middleware in routes and in routes in  register routes 
    ```js

        router.route('/register').post(
            upload.fields([
                {name:"avatar",
                maxCount:1},
                {name:"coverImage",
                maxCount:1}
            ]),
            registerUser)




    ```

``
     upload.fields([
                {name:"avatar",
                maxCount:1},
                {name:"coverImage",
                maxCount:1}
            ]),
``

this is the multer upload we use 



-  VALIDATION 

    for validation we first import apiError file in users.conroller.js which will to throw error 
    ```js
    import {apiError} from "../utils/ApiErrors.js"
    ```

first in 
```js
if
(
[fullName, email, username, password].some( (field) => field?.trim() === "")

){
    throw new ApiError(400,"invalid Fullname or full name required
    ")
}

```

here ? means if it exit follow next step
here we first trim fullname then if we get  empty then we throw error

- CHECK USER EXIST OR NOT 

in conrtoller we have to import User as User can directly asses DB  as it is from mongoose
```js 
    import { User} from "../models/user.model.js"   
```
user have a method find one which return first member in DB  

```js
const existeduser=Users.findone({
    $or:[{ username },{ email }]
})
if(existeduser){
    throw new apiError(409,"user with email or username exits")
}

// in if(){}   we can pass [] (array) as an argument 
```


- CHECK FOR IMAGES 


as we can asses all data from req.body 
multer also give us asses to files 
by req.files


so we use code 
```js
const avatarlocalpath=req.files?avatar[0]?.path
const coverimagelocalpath=req.files?coverimage[0]?.path

if(!avatarlocalpath){
    throw apiError(400,"avatar required")
}
```


-UPLOAD FILES TO CLOUDINARY

we first import coludinary in user.conroller.js
and then we have a method to upload files in cloudinary as define in utils.cloudinay
then we crreate object and make entry in DB by method .create 
to send rep we have already maked a utility apiResponse 
so we import it into user.controller.js


by code 
```js
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await upload0nCloudinary( coverImageLocalPath)

if(!avatar){
    throw apiError(400,"Avatar files required ")
}
const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username,tolowercase()
})

const createdUser=await User.findbyId(user._Id).select(
    "-password -refershTokens"
)

if(!createdUser){
    throw ApiError(500, "something went wrong in user registration ")
}

return res.status(201).json({
    new apiResponce(200,createdUser," User Registered sucesfully")
})

```

# send file from POSTMAN

now we test our api 

1. we use url http://localhost:8000/api/v1/users/register  and we select post as it is post request 
2. in postman to give input we use body and in body we set to form-data
3.![Alt text](image-2.png)
4. we add key of all fields which are required 



# bugs checks 
 as thire is many minor bugs which is solved and not code becomes
 for user.comtraller.js
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
            fs.unlinkSync(localPath);
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


 for user.models.js
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
        coverImage:{
            type: String, //here we use third party service like cloudniary url
        },
        WatchHistory:{
            type:Schema.ObjectId,
            ref:"Vedio"
        },
        password:{
            type:String,
            required:[true,"pasword is required"] //we can give a coustom message with true

        },
        refreshToken:{
            type:String
        }
        

    } ,{
        timestamps:true,

    }
)

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
        // bcrypt.hash(this.password,10) is the method of bcrypt and 10= 10 times
        // we add await as this function need time 
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



// test

// ÷tesrt÷
```


for cloudinar.js
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
            fs.unlinkSync(localPath);
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



# upldates in cloudinary 
 
 as we upload files from local path we also have to delete them after uploading and getting url 
 so we use 
 
 ```js 
fs.unlinkSync(localPath);```

 

and code becomes 
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
            fs.unlinkSync(localPath);
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




# login user

for log in user we do some stpes 
1. req body => data
2. username ,email
3. find user 
4. acess token and refresh token
5. send cookie 

```js
const userLogin=asyncHandler(async(req,res)=>{
    // ask for user name and password,
    // check if user exists
    // take passwrod and send it to encripter and match with data base password 
    // if match then allow user to log in 
    // and give acces token 


        // 1. req body => data
        // 2. username ,email
        // 3. find user 
        // 4. acess token and refresh token
        // 5. send cookie 

   const {email ,username,password}= req.body 
   if(!username||!email){
    throw new ApiError(400,"username or email required")
   }

   const user = await User.findOne({
    $or:[{username},{email}]
   })

   if(!user){
    throw new ApiError(404,"user doesnot  exits")
   }

   const isPasswordValid= await User.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(401,"password invalid") 
   }
   const {accessToken,refreshToken}=await genrateAccestokenAndRefreshTokens(user._id)

   const logedinuser=await User.findById(user._id).select("-password -refreshToken")

   const options={
    httpOnly:true,
    // while we send cookie we degine ootin 
    // when we add this both option httpOnly,secure true then coookie is only modified by server not by front end
    secure:true
   }
   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(200,{
        user: logedinuser,accessToken,refreshToken
    },
    "user loggedin ")
    )

})

```


# log out user 

when we have to log out user we cant find user by id as we doesnt as for email/username or password for logout so we have to user a middle ware which we desing in middle ware folder and name it as auth.middleware