import { Col, Container, Row } from "react-bootstrap";
import Head from "next/head";
import Link from "next/link";
import OwnerLayout from "../../../components/layout/OwnerLayout";
import { getSession } from "next-auth/react";
import { getUser } from "../../../lib/back/UserService";
import { getOffersByOwner } from "../../../lib/back/OfferService";
import Image from "next/image";
import styles from "../../../styles/pages/owner/OwnerHome.module.css";
import {
  deleteOffer,
  getOfferStatus,
} from "../../../lib/front/owner/OwnerUtil";
import router from "next/router";

export default function OwnerIndex(props) {
  return (
    <OwnerLayout>
      <Head>
        <title>AtypikHouse</title>
        <meta property="og:title" content="AtypikHouse" key="title" />
      </Head>
      <Container className="mb-5">
        <h1 className="mt-5">Mes offres</h1>
        <hr className="mb-5" />
        <Row className="mb-3 fw-bold d-none d-md-flex">
          <Col md={2} className="text-center">
            Offre
          </Col>
          <Col md={4}></Col>
          <Col md={2}>Status</Col>
          <Col md={2}>Prix</Col>
          <Col md={2}>Action</Col>
        </Row>
        {props.ownerOffers &&
          props.ownerOffers.length &&
          props.ownerOffers.map((offer, index) => {
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
                        offer && offer.media && offer.media[0]
                          ? offer.media[0].url
                          : "/images/site/imageNotFound.png"
                      }
                      alt={`photo de ${offer.title}`}
                      variant="top"
                      layout="fill"
                    ></Image>
                  </div>
                </Col>
                <Col md={4}>
                  <p className="fs-6 fw-bold">{offer.title}</p>
                  <p>
                    <span className="text-muted">Ville: </span>
                    {offer.address.city.name}
                  </p>
                </Col>
                <Col md={2} className="pt-4">
                  {getOfferStatus(offer.status)}
                </Col>
                <Col md={2} className="pt-4">
                  <p className="fw-bold">{offer.unitPrice} €</p>
                </Col>
                <Col md={2} className="pt-4">
                  <p>
                    <Link href={`/owner/offer/detail/${offer.id}`} className={`me-4 ${styles.actionIcon}`}>
                     
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                   
                    </Link>
                    <span
                      className={styles.actionIcon}
                      onClick={async () => {
                        const deleted = await deleteOffer(offer.id);
                        if (deleted) {
                          router.reload();
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </span>
                  </p>
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

  const user = await getUser(session);

  let ownerOffers = [];
  if (user && user.id) {
    ownerOffers = await getOffersByOwner(user.id);
  }

  return {
    props: {
      ownerOffers,
    },
  };
}

OwnerIndex.requireRole = ["ROLE_OWNER"];
