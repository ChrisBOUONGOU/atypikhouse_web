import moment from "moment";
import { getDaysBetween } from "../common/DateService";
import apiPlatformClient from "./api/apiPlatformClient";
import { URI_RESERVATION, URI_RESERVATION_BY_ID } from "./api/constants";
import { getOfferDetailById } from "./OfferService";
import { getUser } from "./UserService";

export async function getBookedDatesForOffer(offer) {
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  let uri = `${URI_RESERVATION}?offer=/api/offers/${offer.id}&status[]=completed&status[]=confirmed&endDate[after]=${currentDate}`;
  const reservation = await apiPlatformClient.get(uri);
  // TODO take into account the unavailability
  return reservation;
}

export async function bookRangeForOffer([fromDate, toDate], offer) {
  let body = {
    offerId: offer.id,
    startDate: moment(fromDate).format("YYYY-MM-DD"),
    endDate: moment(toDate).format("YYYY-MM-DD"),
  };
  const reservation = await fetch("/api/reservation", {
    method: "post",
    body: JSON.stringify(body),
  });
}

export const getCurrentReservation = async (user) => {
  if (user) {
    let uri = `${URI_RESERVATION}?client=api/users/${user.id}&status=pending`;
    const reservation = await apiPlatformClient.get(uri);
    return reservation && reservation.length !== 0 ? reservation[0] : null;
  }
  return null;
};

export async function getCurrentReservationForRecap(session) {
  const user = await getUser(session);
  const currentReservation = await getCurrentReservation(user);
  if (!currentReservation) {
    return null;
  }
  const { startDate, endDate, totalPrice, unitPrice } = currentReservation;
  const nbrNights = getDaysBetween(startDate, endDate);

  return {
    currency: "€",
    TotalLengthOfStay: nbrNights,
    amounts: {
      totalPrice: { label: "Montant total", value: totalPrice },
      unitPrice: { label: "Prix par nuit", value: unitPrice },
    },
    fromDate: moment(startDate).lang("fr").format("LL"),
    toDate: moment(endDate).lang("fr").format("LL"),
  };
}

export async function getReservationForUserById(session, id) {
  const user = await getUser(session);
  if (user) {
    let uri = `${URI_RESERVATION}/${id}`;
    const reservation = await apiPlatformClient.get(uri);
    if (reservation && reservation.offer) {
      // checked whether the reservation belongs to the current user
      if (`/api/users/${user.id}` !== reservation.client) {
        return null;
      }
      const {
        id,
        startDate,
        endDate,
        totalPrice,
        unitPrice,
        offer,
        paymentId,
      } = reservation;
      const nbrNights = getDaysBetween(startDate, endDate);
      return {
        id,
        currency: "€",
        TotalLengthOfStay: nbrNights,
        amounts: {
          totalPrice: { label: "Montant total", value: totalPrice },
          unitPrice: { label: "Prix par nuit", value: unitPrice },
        },
        fromDate: moment(startDate).lang("fr").format("LL"),
        toDate: moment(endDate).lang("fr").format("LL"),
        offerId: offer.id,
        paymentId,
      };
    }
  }
  return null;
}

export async function getReservationForOwnerById(owner, reservationId) {
  if (owner) {
    let uri = `${URI_RESERVATION}/${reservationId}`;
    const reservation = await apiPlatformClient.get(uri);
    if (reservation && reservation.offer) {
      const offerReservation = await getOfferDetailById(reservation.offer.id);
      // checked whether the reservation belongs to the current owner
      if (`/api/users/${owner.id}` !== offerReservation.owner) {
        return null;
      }
      const {
        id,
        startDate,
        endDate,
        totalPrice,
        unitPrice,
        offer,
        paymentId,
      } = reservation;
      const nbrNights = getDaysBetween(startDate, endDate);
      return {
        id,
        currency: "€",
        TotalLengthOfStay: nbrNights,
        amounts: {
          totalPrice: { label: "Montant total", value: totalPrice },
          unitPrice: { label: "Prix par nuit", value: unitPrice },
        },
        fromDate: moment(startDate).lang("fr").format("LL"),
        toDate: moment(endDate).lang("fr").format("LL"),
        offerId: offer.id,
        paymentId,
      };
    }
  }
  return null;
}

export async function getCurrentUserReservationForOffer(session, offerId) {
  const user = await getUser(session);
  if (offerId && user) {
    let uri = `${URI_RESERVATION}?client=${user.id}&offer=${offerId}`;
    const reservations = await apiPlatformClient.get(uri);
    const result = reservations.map(formatReservation());
    return result;
  }
  return [];
}

export async function getReservationsForUser(user) {
  if (user) {
    let uri = `${URI_RESERVATION}?client=${user.id}`;
    const reservations = await apiPlatformClient.get(uri);

    const result = reservations.map(formatReservation());
    return result;
  }
  return null;
}

export const markCurrentReservationAsPayed = async (user, paymentData) => {
  const currentReservation = await getCurrentReservation(user);
  let data = {
    accept: "application/json",
    payload: {
      status: "confirmed",
      paymentId: paymentData.id,
      lastModified: moment().toDate(),
      paymentDate: moment().toDate(),
    },
  };
  await apiPlatformClient.put(
    URI_RESERVATION_BY_ID + currentReservation.id,
    data
  );

  return currentReservation.id;
};

export const markReservationAsCanceled = async (reservation) => {
  let data = {
    accept: "application/json",
    payload: {
      status: "canceled",
      lastModified: moment().toDate(),
      cancelDate: moment().toDate(),
    },
  };
  await apiPlatformClient.put(URI_RESERVATION_BY_ID + reservation.id, data);
};

function formatReservation() {
  return (reservation) => {
    const {
      id,
      startDate,
      endDate,
      totalPrice,
      unitPrice,
      offer,
      paymentId,
      status,
      paymentDate,
    } = reservation;
    const nbrNights = getDaysBetween(startDate, endDate);
    return {
      id,
      currency: "€",
      TotalLengthOfStay: nbrNights,
      amounts: {
        totalPrice: { label: "Montant total", value: totalPrice },
        unitPrice: { label: "Prix par nuit", value: unitPrice },
      },
      fromDate: startDate,
      toDate: endDate,
      formattedFromDate: moment(startDate).lang("fr").format("LL"),
      formattedToDate: moment(endDate).lang("fr").format("LL"),
      offer: reservation.offer,
      cancellable: status === "confirmed" && paymentId != undefined,
      status,
    };
  };
}
