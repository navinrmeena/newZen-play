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
