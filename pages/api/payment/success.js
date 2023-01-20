const paypal = require("paypal-rest-sdk");

import { getSession } from "next-auth/react";
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_MODE,
  PAYPAL_SECRET
} from "../../../lib/back/api/constants";
import {
  getCurrentReservation,
  markCurrentReservationAsPayed
} from "../../../lib/back/BookingService";
import { getUser } from "../../../lib/back/UserService";

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_SECRET,
});

export default async function handler(req, res) {
  const payerID = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    res.end();
  }

  const user = await getUser(session);
  // Mock paypal payment
  if (process.env.MOCK_PAYMENT) {
    const reservationId = await markCurrentReservationAsPayed(user, {
      id: "PAYED_WITH_MOCK",
    });
    res.redirect(`/checkout/confirmation?reservation=${reservationId}`);
    return;
  }
  const executeRequestData = await getRequestData(payerID, user);
  paypal.payment.execute(paymentId, executeRequestData, async function (
    error,
    payment
  ) {
    if (error) {
      console.log("payment error : ", error.response);
      res.redirect("/checkout/payment");
    } else {
      console.log(payment);
      // change current reservation status to PAYED
      const reservationId = await markCurrentReservationAsPayed(user, payment);
      // TODO save payment.id as a transaction ID
      res.redirect(`/checkout/confirmation?reservation=${reservationId}`);
    }
  });
}

const getRequestData = async (payerID, user) => {
  const { totalPrice } = await getCurrentReservation(user);
  return {
    payer_id: payerID,
    transactions: [
      {
        amount: {
          currency: "EUR",
          total: "" + (Math.round(totalPrice * 100) / 100).toFixed(2),
        },
      },
    ],
  };
};
