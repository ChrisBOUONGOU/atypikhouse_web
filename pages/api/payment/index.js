// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getDaysBetween } from "../../../lib/common/DateService";
import { getSession } from "next-auth/react";
import {
  BASE_URL,
  PAYPAL_CLIENT_ID,
  PAYPAL_MODE,
  PAYPAL_SECRET,
} from "../../../lib/back/api/constants";
import { getCurrentReservation } from "../../../lib/back/BookingService";
import { getUser } from "../../../lib/back/UserService";

const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_SECRET,
});

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    res.end();
  }

  if (req.method !== "POST") {
    res.redirect("/checkout/payment");
  }

  const user = await getUser(session);
  const reservation = await getCurrentReservation(user);
  const paymentData = await getPaymentData(reservation);

  // Mock paypal payment
  if (process.env.MOCK_PAYMENT) {
    res.redirect("/api/payment/success");
    return;
  }

  paypal.payment.create(paymentData, function (error, payment) {
    if (error) {
      console.error("Paypal payment error.", error);
      res.redirect("/checkout/payment?error");
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
}

const getPaymentData = async (reservation) => {
  const { offer, description, startDate, endDate, totalPrice, unitPrice } =
    reservation;
  const nbrNights = getDaysBetween(startDate, endDate);

  return {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      // add urls to env params
      return_url: `${BASE_URL}/api/payment/success`,
      cancel_url: `${BASE_URL}/api/payment/error`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: offer.title,
              sku: offer.id,
              price: "" + (Math.round(unitPrice * 100) / 100).toFixed(2),
              currency: "EUR",
              quantity: nbrNights,
            },
          ],
          shipping_address: {
            recipient_name: "Jhon Doe",
            line1: "Av. de la Pelouse",
            city: "Paris",
            state: "Alsace",
            postal_code: "92170",
            country_code: "FR",
          },
        },
        amount: {
          currency: "EUR",
          total: "" + (Math.round(totalPrice * 100) / 100).toFixed(2),
        },
        description: description,
      },
    ],
  };
};
