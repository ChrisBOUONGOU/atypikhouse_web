import Head from "next/head";
import moment from "moment";
import router from "next/router";
import Image from "next/image";
import { getSession } from "next-auth/react";
import "moment/locale/fr";
import { Col, Container, Row } from "react-bootstrap";
import OwnerLayout from "../../../components/layout/OwnerLayout";
import { cancelOrder, getReservationStatus } from "../../../lib/front/owner/OwnerUtil";
import { getReservationsByOwner } from "../../../lib/back/ReservationService";
import AhButton from "../../../components/widgets/AhButton";
import styles from "../../../styles/pages/owner/OwnerHome.module.css";

export default function OwnerIndex(props) {
  return (
    <OwnerLayout>
      <Head>
        <title>AtypikHouse</title>
        <meta property="og:title" content="AtypikHouse" key="title" />
      </Head>
      <Container className="mb-5">
        <h1 className="mt-5">Mes commandes</h1>
        <hr className="mb-5" />
        <Row className="mb-3 fw-bold d-none d-md-flex">
          <Col md={2} className="text-center">
            Commande
          </Col>
          <Col md={2}></Col>
          <Col md={2}>Dates</Col>
          <Col md={2}>Status</Col>
          <Col md={2}>Montant total</Col>
          <Col md={2}>Action</Col>
        </Row>
        {props.ownerOrders &&
          props.ownerOrders.map((order, index) => {
            moment.locale("fr");
            const formattedStartDate = moment(order.startDate).format("LL");
            const formattedEndDate = moment(order.endDate).format("LL");
            const isStartDateInFuture = moment().isBefore(order.startDate, "day");
            const isOrderStatusConfirmed = order.status == "confirmed";
            const canCancel = (isStartDateInFuture && isOrderStatusConfirmed);

            return (
              <Row
                key={index}
                className={`pt-3 pb-3 text-center text-md-start ${styles.alternateOffers}`}
              >
                <Col md={2}>
                  <div
                    className="position-relative m-auto mb-3 mb-md-0"
                    style={{ minHeight: "100px", maxWidth: "120px" }}
                  >
                    <Image
                      src={
                        order &&
                        order.offer &&
                        order.offer.media &&
                        order.offer.media[0]
                          ? order.offer.media[0].url
                          : "/images/site/imageNotFound.png"
                      }
                      alt={`photo de ${order.offer.title}`}
                      variant="top"
                      layout="fill"
                    ></Image>
                  </div>
                </Col>
                <Col md={2}>
                  <p>
                    <span className="text-muted">Offre: </span>
                    <br></br>
                    <span className="fs-6 fw-bold">{order.offer.title}</span>
                  </p>
                </Col>
                <Col md={2} className="pt-4">
                  <p>
                    {formattedStartDate}
                    <br />
                    <span className="text-muted">au</span>
                    <br />
                    {formattedEndDate}
                  </p>
                </Col>
                <Col md={2} className="pt-4">
                  {getReservationStatus(order.status)}
                </Col>
                <Col md={2} className="pt-4">
                  <p className="fw-bold">{order.totalPrice} €</p>
                </Col>
                <Col md={2} className="pt-4">
                  {canCancel && <p>
                    <span
                      onClick={async () => {
                        const deleted = await cancelOrder(order.id);
                        if (deleted) {
                          router.reload();
                        }
                      }}
                    >
                      <AhButton variant="secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="currentColor"
                          className="bi bi-x-square-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                        </svg>{" "}
                        Annuler
                      </AhButton>
                    </span>
                  </p>}
                </Col>
              </Row>
            );
          })}
      </Container>
    </OwnerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || !session.user || !session.user.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let ownerOrders = await getReservationsByOwner(session.user.id);

  return {
    props: {
      ownerOrders,
    },
  };
}

OwnerIndex.requireRole = ["ROLE_OWNER"];
