import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";





const genrateAccestokenAndRefreshTokens = async (userId) => {
  
  try {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccestoken();
    const refreshToken = user.genrateRefreshtoken();
    

    user.refreshToken = refreshToken;
    // now we added refreshToken but we have to save it soo

    await user.save({ validateBeforeSave: false }); //by this line we can save but every time we save
    // we need password to validate so {validateBeforeSave : false} it will skip validation

    return { accessToken, refreshToken };
    
  } catch (error) {
    console.log("error", error);
    throw new ApiError(
      500,
      "something went wrong while genrating acces Tokens and refresh Tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  // console.log("email",email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field is required ");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "user with same username or email exist ");
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  // this give path from multer where file is stored

  // const coverImagelocalPath=req.files?.coverImage[0]?.path;
  // but is thire is no local path input given from fronthend then we have to chek that it must not be undefine

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar file is required ");
  }

  const avatar = await uploadOnCloudinary(avatarlocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required ");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while user registration  ");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered sucsesfully "));
});

const loginUser = asyncHandler(async (req, res) => {
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

  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or email required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user doesnot  exits");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password invalid");
  }
  const { accessToken, refreshToken } = await genrateAccestokenAndRefreshTokens(
    user._id
  );

  const logedinuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    // while we send cookie we degine ootin
    // when we add this both option httpOnly,secure true then coookie is only modified by server not by front end
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedinuser,
          accessToken,
          refreshToken,
        },
        "user loggedin "
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken:1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    // while we send cookie we degine ootin
    // when we add this both option httpOnly,secure true then coookie is only modified by server not by front end
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out "));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  try {
    const incommingRefreshToken =
      req.cookie.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
      throw new ApiError(401, "unautoriserequest");
    }

    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRTE
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is invalid or used");
    }
    const options = {
      httpOnly: true,
      // while we send cookie we degine ootin
      // when we add this both option httpOnly,secure true then coookie is only modified by server not by front end
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await genrateAccestokenAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("acessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "AcessToken refreshed ......"
        )
      );
  } catch (error) {
    throw new ApiResponse(401, error?.message || "INVALID REFRESH TOEKN");
  }

  try {
  } catch (error) {}
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // if(!(newPassword===reenterPassword)){
  //   throw new ApiError(400,"new password and reentered password does not match");
  // }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed ....."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // const currentUser = User.id;
  return res
    .status(200)
    .josn(new ApiResponse(200, req.user, "current User featched"));
});

const UpdateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  // if we are updateing any files like photo then we should have different controllers for this
  if (!fullName || !email) {
    throw new ApiError(
      401,
      "give both email and fullName  (all field required)"
    );
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true } //this will return us updated user
  ).select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "account details updated (email and fullname ")
    );
});
const UpdateAvatar = asyncHandler(async (req, res) => {
  const avatarLocarpath = req.file?.path;
  if (!avatarLocarpath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocarpath);

  if (!avatar) {
    throw new ApiError(400, "problem in uploading avatar image on cloudinary ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  //   if(avatarLocarpath){
  //     fs.unlinkSync(avatarLocarpath);
  // }

  return res
    .status(200)
    .json(new ApiResponse(200), user, "updated avarat successfully ");
});

const UpdateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalpath = req.file?.path;
  if (!avatarLocalpath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if (!coverImage) {
    throw new ApiError(400, "problem in uploading cover  image on cloudinary ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  // if(coverImageLocalpath){
  //     fs.unlinkSync(coverImageLocalpath);
  // }

  return res
    .status(200)
    .json(new ApiResponse(200), user, "updated coverImage  successfully ");
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw ApiError(400, "username is misssing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (channel?.length) {
    throw ApiError(401, "channel does not exists ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "user chanel fatched succesfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changeCurrentPassword,
  getCurrentUser,
  UpdateAccountDetails,
  UpdateAvatar,
  UpdateCoverImage,
  getUserChannelProfile,
};
 