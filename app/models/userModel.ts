import mongoose from "mongoose";

export interface IUserModel extends mongoose.Document {
  name: string;
}

const UserSchema = new mongoose.Schema({
  shopify_id: { type: Number, required: true },
  name: String,
  email: { type: String, required: true },
  phone: Number,
  routines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReminderList",
    },
  ],
});

export default mongoose.model<IUserModel>("User", UserSchema);
