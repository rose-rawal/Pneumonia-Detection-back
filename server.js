import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use("/", (req, res) => {
  res.json("welcome");
});
mongoose
  .connect("mongodb://localhost:27017/pneumonia")
  .then(console.log("mongo db Connected"))
  .catch((err) => console.log(err));
app.listen(3000, () => {
  console.log("listening at port 3000");
});
