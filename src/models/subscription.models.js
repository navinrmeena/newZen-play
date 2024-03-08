import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      // one who is subscribing
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    channel: {
      // one to whom subscriber' is subscriber
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
