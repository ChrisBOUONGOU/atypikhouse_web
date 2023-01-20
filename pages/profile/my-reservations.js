/* eslint-disable react/jsx-key */
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import CustomerLayout from "../../components/layout/CustomerLayout";
import ProfileNav from "../../components/profile/ProfileNav";
import { getReservationsForUser } from "../../lib/back/BookingService";
import { getUser } from "../../lib/back/UserService";
import styles from "../../styles/components/MyReservations.module.css";

export default function MyReservations({ allReservations }) {
  return (
    <CustomerLayout>
      <Container className="mt-5">
        <h1>Mes réservations</h1>
        <Row>
          <Col lg={3} className="order-lg-2">
            <ProfileNav source="reservations" />
          </Col>
          <Col lg={9} className="mt-5 order-lg-1 position-relative">
            {allReservations?.map((reservation, index) => {
              console.log(reservation);
              return (
                <Row
                  key={index}
                  className={`${
                    reservation.status == "canceled"
                      ? styles.reservationCanceled
                      : ""
                  } mb-4 border pt-2 position-relative`}
                >
                  <Col md={4} lg={5}>
                    <div className={styles.reservationImageWrapper}>
                      <Image
                        src={reservation.offer.media[0].url}
                        alt={reservation.offer.media[0].alt}
                        width="100%"
                        height="100%"
                        layout="responsive"
                        objectFit="none"
                      ></Image>
                    </div>
                  </Col>
                  <Col md={8} lg={7}>
                    <Row className="mt-2">
                      <Col>
                        <span className={styles.recapLabel}>Arrivée</span>
                        <span className={styles.recapBold}>
                          {reservation.formattedFromDate}
                        </span>
                        <span className={styles.recapTime}>
                          À partir de 17h00{" "}
                        </span>
                      </Col>

                      <Col>
                        <span className={styles.recapLabel}>Départ</span>
                        <span className={styles.recapBold}>
                          {reservation.formattedToDate}
                        </span>
                        <span className={styles.recapTime}>
                          Jusqu&apos;à 11h00
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col>
                        <span>Durée totale du séjour :</span>
                        <span className={styles.recapBold}>
                          {reservation.TotalLengthOfStay} nuits
                        </span>
                      </Col>
                      <Col>
                        <span>Montant réglé:</span>
                        <span className={styles.recapBold}>
                          {reservation.amounts.totalPrice.value}{" "}
                          {reservation.currency}
                        </span>
                      </Col>
                    </Row>
                    {reservation && reservation.status == "canceled" && (
                      <div className={`${styles.cancelWrapper}`}>
                        Réservation annulée
                      </div>
                    )}
                    <Row className={`${styles.seeOfferLinkWrapper}`}>
                      <div></div>
                      <div className={`${styles.seeOfferLink}`}>
                        <Link href={`/offers/${reservation.offer.id}`}>
                         
                            Consulter l&apos;offre <span>&#187;</span>
                         
                        </Link>
                      </div>
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
      </Container>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const user = await getUser(session);
  const allReservations = await getReservationsForUser(user);

  return {
    props: {
      user,
      allReservations,
    },
  };
}

MyReservations.requireRole = ["ROLE_USER"];
