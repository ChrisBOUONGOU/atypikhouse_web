/* eslint-disable react/jsx-key */
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AhOfferCard from "../widgets/AhOfferCard";

export default function OffersList({ offers, favorites, canRefresh }) {
  return (
    <Container>
      <Row>
        {offers &&
          offers.map((offer, index) => {
            return (
              <AhOfferCardWrapper
                key={index}
                favorites={favorites}
                offer={offer}
                canRefresh={canRefresh}
              ></AhOfferCardWrapper>
            );
          })}
      </Row>
    </Container>
  );
}

const AhOfferCardWrapper = ({ favorites, offer, canRefresh }) => {
  const [display, setDisplay] = useState(true);
  const removeFromFav = () => {
    if (canRefresh) setDisplay(false);
  };
  return (
    <>
      {display && (
        <Col xs={12} md={6} lg={4} className="mb-4">
          <AhOfferCard
            onRemoveFav={removeFromFav}
            offer={offer}
            favoriteId={favorites ? favorites[offer.id] : null}
          ></AhOfferCard>
        </Col>
      )}
    </>
  );
};
