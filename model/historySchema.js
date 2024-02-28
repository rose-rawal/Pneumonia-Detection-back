import mongoose from "mongoose";

const historySchema = mongoose.Schema({
  result: {
    type: [Boolean],
    require: true,
  },

  patient: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "patient",
    require: true,
  },
  image: {
    type: [String],
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    require: true,
  },
});
export default mongoose.model("history", historySchema);
