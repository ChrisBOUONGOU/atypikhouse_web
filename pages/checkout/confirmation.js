import { getSession } from "next-auth/react";
import CustomerLayout from "../../components/layout/CustomerLayout";
import { getReservationForUserById } from "../../lib/back/BookingService";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../../styles/components/ConfirmationPage.module.css";
import { getOfferById } from "../../lib/back/OfferService";
import Image from "next/image";
import { getUserById } from "../../lib/back/UserService";

export default function confirmationPage(props) {
  const reservationById = JSON.parse(props.reservation);
  const offer = props.offer;
  const owner = props.owner;
  // const owner = props.owner;
  let offerImage, offerAlt;

  if (Array.isArray(offer.media) && offer.media.length) {
    offerImage = offer.media[0].url;
    offerAlt = offer.media[0].alt;
  }
  return (
    <CustomerLayout>
      <Container className={`mt-4 mb-4 ${styles.mainContainer}`}>
        <h2 className="mb-4">Votre réservation est confirmée</h2>
        <Row>
          <Image
            src={offer.media[0].url}
            alt={offer.media[0].alt}
            width={300}
            height={300}
          />
        </Row>
        <Col className="mb-4 mt-4">
          <span className={styles.floatRight}>Propriétaire :</span>
          <span>
            {owner?.firstName} {owner?.lastName}
          </span>
        </Col>

        <Row>
          <Col className="mb-2">
            <span className={styles.floatRight}>Arrivée</span>
            <span className={styles.recapBold}>{reservationById.fromDate}</span>
            <span className={styles.recapTime}>À partir de 17h00 </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className={styles.floatRight}>Départ</span>
            <span className={styles.recapBold}>{reservationById.toDate}</span>
            <span className={styles.recapTime}>Jusqu&apos;à 11h00</span>
          </Col>
        </Row>

        <Col className="mt-2">
          <span className={styles.floatRight}>Durée totale du séjour :</span>
          <span className={styles.recapBold}>
            {reservationById.TotalLengthOfStay} nuits
          </span>
        </Col>
        <Col className="mt-2">
          <span className={styles.floatRight}>Montant réglé:</span>
          <span className={styles.recapBold}>
            {reservationById.amounts.totalPrice.value}
            {reservationById.currency}
          </span>
        </Col>
      </Container>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || !context.query.reservation) {
    return {
      redirect: {
        destination: "/", //redirect user to homepage
        permanent: false,
      },
    };
  }
  const reservation = await getReservationForUserById(
    session,
    context.query.reservation
  );
  if (!reservation) {
    return {
      redirect: {
        destination: "/", //redirect user to homepage
        permanent: false,
      },
    };
  }
  const offer = await getOfferById(reservation.offerId);
  let owner = {};
  if (offer.owner) {
    owner = await getUserById(offer.owner.replace("/api/users/", ""));
  }
  return {
    props: {
      reservation: JSON.stringify(reservation),
      offer,
      owner,
    },
  };
}
