import { Router } from "express";
import patientSchema from "../model/patientSchema.js";
import historySchema from "../model/historySchema.js";
import userSchema from "../model/userSchema.js";
import mongoose from "mongoose";
const patientRouter = Router();

const addPatient = async (req, res) => {
  const { name, age, gender, user } = req.body;

  try {
    const isUser = userSchema.findOne({ name: user });
    if (!isUser) {
      res.status(400).json({ success: false, msg: "User is not found" });
    }

    const patientAdd = await patientSchema.create({
      name,
      age,
      gender,
      user: isUser._id,
    });
    console.log(patientAdd);
  } catch (err) {
    console.log(err);
  }
  return res.json("hello");
};
patientRouter.post("/add", addPatient);

const doTest = async (req, res) => {
  const { patient, result, user, image } = req.body;
  if (!patient || !user)
    return res.status(400).json({ success: false, msg: "Enter Credentials" });
  try {
    const isUser = await userSchema.findOne({ name: user });
    if (!isUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (isUser.remaining_predict <= 0) {
      return res.status(400).json({
        success: false,
        message: "Prediction unavailable pay to continue",
      });
    }

    const isPatient = await patientSchema.findOne({ name: patient });
    if (!isPatient) {
      return res
        .status(400)
        .json({ success: false, message: "Patient not found" });
    }
    const isAlready = await historySchema.findOne({
      patient: isPatient._id,
      user: isUser._id,
    });
    console.log("isalready");

    if (isAlready) {
      isAlready.result.push(result);
      // isAlready.image.push(image);
      await isAlready.save();
      isUser.remaining_predict--;
      isUser.save();
      return res.json({ success: true, isAlready });
    }
    // const findUser = await userSchema.findOne({ name });
    // if (!findUser) {
    //   return res.status(400).json({ success: false, msg: "User not found" });
    // }
    // if (findUser.remaining_predict <= 0) {
    //   return res.status(400).json({
    //     success: false,
    //     msg: "Prediction unavailable pay to continue",
    //   });
    // }
    const createTest = await historySchema.create({
      patient: isPatient._id,
      result,
      user: isUser._id,
    });
    isUser.remaining_predict--;
    isUser.save();
    return res.json({ success: true, createTest });
    // return res.json({ success: false, message: "No such Patient found" });
  } catch (err) {
    return res.json(err.message);
  }
};
patientRouter.post("/test", doTest);

const viewStats = async (req, res) => {
  try {
    const patient = await historySchema.find();
    const user = await userSchema.find();
    const pneuPatient = patient.map(
      (a) => a.result.filter((n) => n === true).length
    );
    // console.log(patientData, "patientData");
    const sumPatient = pneuPatient.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const noUser = user.length;
    const pneuPatientAll = patient.map((a) => a.result.length);
    const sumPatientAll = pneuPatientAll.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return res.status(200).json({
      success: true,
      sumPatient,
      patient: sumPatientAll,
      noUser,
    });
  } catch (err) {
    console.log(err, "err");
    return res
      .status(400)
      .json({ success: false, message: "error in getting stats" });
  }
};
patientRouter.get("/statsNumber", viewStats);

const getHistory = async (req, res) => {
  const { user } = req.body;
  // const user = req.params.user;
  try {
    const isUser = await userSchema.findOne({ name: user });
    if (!isUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const history = await historySchema
      .find({ user: isUser._id })
      .populate("patient", "name");
    if (!history) {
      return res.status(400).json({ success: false, message: "no history " });
    } else return res.status(200).json({ success: true, history: history });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, message: err });
  }
};
patientRouter.post("/getHistory", getHistory);

const getPatient = async (req, res) => {
  const { name } = req.body;
  try {
    const isUser = await userSchema.findOne({ name });
    if (!isUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isPatient = await patientSchema.find({ user: isUser._id });
    if (!isPatient) {
      return res
        .status(400)
        .json({ success: false, message: "Patient getting error" });
    }
    return res.status(200).json({ success: true, isPatient });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Error in getting Patient" });
  }
};
patientRouter.post("/myPatient", getPatient);

export default patientRouter;
