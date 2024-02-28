import { Router } from "express";
import request from "request";
import userSchema from "../model/userSchema.js";
// import axios from "axios";
const paymentRouter = Router();

const doKhalti = async (req, res) => {
  const { name } = req.body;
  const findUser = await userSchema.findOne({ name });
  if (!findUser) return res.status(400).json("User not found");

  var options = {
    method: "POST",
    url: "https://a.khalti.com/api/v2/epayment/initiate/",
    headers: {
      Authorization: "key 6b076707efa84413bd088646701ba5c4",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: "http://example.com/",
      website_url: "https://example.com/",
      amount: "1000",
      purchase_order_id: "Order01",
      purchase_order_name: "test",
      customer_info: {
        name,
        email: "test@khalti.com",
        phone: "9800000001",
      },
    }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    findUser.remaining_predict += 10;
    findUser.save();
    console.log(response.body);
    return res.json(response.body);
  });
};
paymentRouter.post("/esewa", doKhalti);

export default paymentRouter;
