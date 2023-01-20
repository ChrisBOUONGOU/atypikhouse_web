/* eslint-disable react/jsx-key */
import { getSession } from "next-auth/react";
import { Col, Container, Row } from "react-bootstrap";
import CustomerLayout from "../../components/layout/CustomerLayout";
import OffersList from "../../components/offer/OffersList";
import { getFavoritesByUserId } from "../../lib/back/FavoritesService";
import { getUser } from "../../lib/back/UserService";
import ProfileNav from "../../components/profile/ProfileNav";
import React from "react";

export default function Favorites(props) {
  return (
    <CustomerLayout>
      <Container className="mt-5">
        <h1>Mon prochain voyage</h1>
        <Row className="justify-content-md-between">
          <Col lg={3} className="order-lg-2">
            <ProfileNav source="favorites" />
          </Col>
          <Col lg={9} className="mt-5 order-lg-1">
            <OffersList
              offers={props.favoritesOffer}
              favorites={props.favoritesOfferMapping}
              canRefresh={true}
            ></OffersList>
          </Col>
        </Row>
      </Container>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const user = await getUser(session);
  if (!user) {
    return {
      props: {
        user,
      },
    };
  }
  const favorites = await getFavoritesByUserId(user.id);

  const favoritesOfferMapping = {};
  favorites?.forEach((fav) => {
    favoritesOfferMapping[fav.offer.id] = "" + fav.id;
  });

  const favoritesOffer = favorites.map((fav) => {
    return fav.offer;
  });

  return {
    props: {
      user,
      favorites,
      favoritesOffer,
      favoritesOfferMapping,
    },
  };
}

Favorites.requireRole = ["ROLE_USER"];
