const paypal = require("paypal-rest-sdk");

import {
  PAYPAL_CLIENT_ID,
  PAYPAL_MODE,
  PAYPAL_SECRET,
} from "../../../lib/back/api/constants";

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_SECRET,
});

export default async function handler(req, res) {
  return res.status(404).json({ error: "Resource not found" });
  // resource to get the transaction info
  // maybe usefull when process refund
  // var orderId = "PAYID-MGTIPPA00H25250DU407753E";
  const orderId = req.id;

  paypal.payment.get(orderId, function (error, order) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Get Order Response");
      console.log(JSON.stringify(order));
    }
  });
  res.send(200);
}
