import { Router } from "express";
import patientSchema from "../model/patientSchema.js";
import historySchema from "../model/historySchema.js";
const patientRouter = Router();

const addPatient = async (req, res) => {
  const { name, age, gender, user } = req.body;
  try {
    const patientAdd = await patientSchema.create({
      name,
      age,
      gender,
      user,
    });
    console.log(patientAdd);
  } catch (err) {
    console.log(err);
  }
  return res.json("hello");
};
patientRouter.post("/add", addPatient);

const doTest = async (req, res) => {
  const { patient, result, user } = req.body;
  if (!patient || !result || !user)
    return res.status(400).json({ success: false, msg: "Enter Credentials" });
  try {
    const isAlready = await historySchema.findOne({ patient, user });
    if (isAlready) {
      isAlready.result.push(result);
      await isAlready.save();
      return res.json({ success: "true" });
    }

    const createTest = await historySchema.create({ patient, result, user });
    return res.json(createTest);
  } catch (err) {
    return res.json("error in doing test");
  }
};
patientRouter.post("/test", doTest);
export default patientRouter;
