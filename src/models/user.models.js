import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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
    // return await bcrypt.compare(password, this.password);
    // bcrypt.compare(password,this.password);
    // in this  bcrypt compare our password given by user and saved password 
}

// we can also make function for genrating assec token
userSchema.methods.genrateAccestoken = function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        Name: this.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };
  
  userSchema.methods.genrateRefreshtoken = function () {
    return jwt.sign(
      // jwt.sign is method which genrate token
      {
        _id: this._id,
      },
      process.env.JWT_SECRET,
      {   
      
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };
  
export const User= mongoose.model("User",userSchema);



// test

// ÷tesrt÷