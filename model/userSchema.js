import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  remaining_predict: {
    type: Number,
    default: 0,
  },
});
export default mongoose.model("User", userSchema);
