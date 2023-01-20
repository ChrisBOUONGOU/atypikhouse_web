import moment from "moment";
import { getSession } from "next-auth/react";
import apiPlatformClient from "../../../lib/back/api/apiPlatformClient";
import {
  URI_RESERVATION,
  URI_RESERVATION_BY_ID,
} from "../../../lib/back/api/constants";
import { getOfferById } from "../../../lib/back/OfferService";
import { getUser } from "../../../lib/back/UserService";

const getDaysBetween = (from, to) => {
  return moment(to).diff(moment(from), "days");
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(404).json({ error: "Url not found" });
  }
  const session = await getSession({ req });
  if (!session) {
    res.status(401);
    res.end();
  }
  const user = await getUser(session);
  const currentReservation = await getCurrentReservation(user);

  const body = JSON.parse(req.body);
  let offer = await getOfferById(body.offerId);
  const bookedNightsCount = getDaysBetween(body.startDate, body.endDate);
  let data = {
    accept: "application/json",
    payload: {
      offer: "/api/offers/" + offer.id,
      startDate: moment.utc(body.startDate).add(16, "hours").toDate(),
      endDate: moment.utc(body.endDate).add(11, "hours").toDate(),
      unitPrice: offer.unitPrice,
      totalPrice: offer.unitPrice * bookedNightsCount,
      lastModified: moment().toDate(),
      status: "pending",
    },
  };
  if (currentReservation) {
    await updateReservation(currentReservation, data);
  } else {
    data.payload.createdAt = moment().toDate();
    data.payload.client = user ? `/api/users/${user.id}` : null;
    await createNewReservation(data);
  }
  res.send(200);
}

const getCurrentReservation = async (user) => {
  if (user) {
    let uri = `${URI_RESERVATION}?client=api/users/${user.id}&status=pending`;
    const reservation = await apiPlatformClient.get(uri);
    return reservation && reservation.length !== 0 ? reservation[0] : null;
  }
  return null;
};

const createNewReservation = async (data) => {
  await apiPlatformClient.post(URI_RESERVATION, data);
};

const updateReservation = async (currentReservation, data) => {
  await apiPlatformClient.put(
    URI_RESERVATION_BY_ID + currentReservation.id,
    data
  );
};
