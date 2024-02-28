import { Router } from "express";

import userSchema from "../model/userSchema.js";
import patientRouter from "./patientRoute.js";
import paymentRouter from "./payment.js";
const router = Router();

const addUser = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password)
    return res.status(400).json({ success: false, msg: "Enter Credentials" });
  try {
    const alreadyUser = await userSchema.findOne({ name });
    console.log(alreadyUser);
    if (alreadyUser) {
      return res.status(400).json({ success: false, msg: "Already A User" });
    }
    const userCreated = await userSchema.create({
      name,
      password,
    });
  } catch (err) {
    return res.status(400).json({ success: false, msg: "SignUp Error" });
  }
  return res.status(200).json({ success: true, msg: "User Created" });
};
router.post("/register", addUser);

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const findUser = await userSchema.findByIdAndDelete(id);
    if (!findUser) {
      return res.status(400).json({ success: false, msg: "User Not Found" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "User Deleted Successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, msg: "Delete User Error" });
  }
};
router.get("/delete/:id", deleteUser);

const updateUser = async (req, res) => {
  const { name, password } = req.body;
  const id = req.params.id;
  let change = {};
  if (!name && !password)
    return res.status(400).json({ success: false, msg: "Nothing to Update" });
  else if (name && password) {
    change.name = name;
    change.password = password;
  } else if (name) change.name = name;
  else {
    change.password = password;
  }
  try {
    const findUser = await userSchema.findById(id);
    if (!findUser) {
      return res.status(400).json({ success: false, msg: "User Not Found" });
    }
    const updatedUser = await userSchema.findByIdAndUpdate(id, {
      $set: change,
    });
    return res
      .status(200)
      .json({ success: true, msg: "User Updated Successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, msg: "Update User Failed" });
  }
};
router.post("/update/:id", updateUser);

const login = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password)
    return res.status(400).json({ success: false, msg: "Enter Credentials" });
  try {
    const findUser = await userSchema.findOne({ name, password });
    if (!findUser)
      return res
        .status(400)
        .json({ success: false, msg: "Credentials Didnot Match" });
    return res.status(200).json({ success: true, msg: "Login Success" });
  } catch (err) {
    return res.status(400).json({ success: false, msg: "Login Failed" });
  }
};
router.post("/login", login);

router.use("/patient", patientRouter);
router.use("/payment", paymentRouter);

export default router;
