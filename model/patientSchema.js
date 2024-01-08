import mongoose from "mongoose";
const gend = {
  MALE: "male",
  FEMALE: "female",
};
const patientSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  gender: {
    type: String,
    enum: Object.values(gend),
    require: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    require: true,
  },
});
export default mongoose.model("patient", patientSchema);
