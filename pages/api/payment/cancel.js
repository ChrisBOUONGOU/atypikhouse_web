const paypal = require("paypal-rest-sdk");

import moment from "moment";
import { getSession } from "next-auth/react";
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_MODE,
  PAYPAL_SECRET,
} from "../../../lib/back/api/constants";
import {
  getReservationForOwnerById,
  markReservationAsCanceled,
} from "../../../lib/back/BookingService";
import { getUser } from "../../../lib/back/UserService";

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_SECRET,
});

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method !== "POST" || !session) {
    res.status(401);
  }
  const user = await getUser(session);
  if (!user) {
    res.status(401);
  }

  const reservationId = req.body.reservationId;

  const reservation = await getReservationForOwnerById(user, reservationId);
  if (reservation && isEligibleToCancel(reservation, user)) {
    if (
      process.env.MOCK_PAYMENT &&
      reservation.paymentId === "PAYED_WITH_MOCK"
    ) {
      await markReservationAsCanceled(reservation);
      return res.status(200).json({ data: "Refund success" });
    }

    const refund_details = {
      amount: {
        currency: "EUR",
        total: reservation.amounts.totalPrice.value,
      },
    };

    paypal.payment.get(
      reservation.paymentId,
      async function (error, paymentInfoDetails) {
        if (error) {
          console.log("cannot get data to process refund", error);
          return res
            .status(400)
            .json({ error: "cannot get data to process refund" });
        } else {
          console.log(JSON.stringify(paymentInfoDetails));

          performRefund(res, reservation, paymentInfoDetails, refund_details);
        }
      }
    );
  }
  return res.status(400).json({ error: "Order not eligible to refund" });
}

const performRefund = (
  res,
  reservation,
  paymentInfoDetails,
  refund_details
) => {
  const transaction = paymentInfoDetails.transactions[0];
  const resource = transaction["related_resources"];
  const sale = resource[0].sale;
  const transactionId = sale["id"];

  paypal.capture.refund(
    transactionId,
    refund_details,
    async function (error, refund) {
      if (error) {
        console.log("cannot process refund", error);
        return res.status(400).json({ error: "cannot process refund" });
      } else {
        console.log(refund);
        await markReservationAsCanceled(reservation);
        return res.status(200).json({ data: "Refund success" });
      }
    }
  );
};

const isEligibleToCancel = async (reservation, user) => {
  const isStartDateInFuture = moment().isBefore(reservation.startDate, "day");
  const isOrderStatusConfirmed = reservation.status == "confirmed";

  return (
    reservation &&
    reservation.amounts &&
    reservation.amounts.totalPrice &&
    reservation.paymentId &&
    isStartDateInFuture &&
    isOrderStatusConfirmed
  );
};
