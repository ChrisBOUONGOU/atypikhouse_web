/* eslint-disable react/jsx-key */
import { Col, Container, Row } from "react-bootstrap";
import AhLink from "../widgets/AhLink";
import AhOfferCard from "../widgets/AhOfferCard";

export default function OffersSection({ offers, className }) {
  offers = offers.slice(0, 3);

  return (
    <Container className={className}>
      <Row className="mb-2">
        <Col>
          <h2>Nouvelles Offres</h2>
        </Col>
        <Col className="d-none d-md-block">
          <div className="d-flex justify-content-end">
            <AhLink href="/offers-listing" variant="secondary" className="px-4">
              Découvrir
            </AhLink>
          </div>
        </Col>
      </Row>
      <Row>
        {offers.map((offer, idx) => {
          let cssClassNames = resposiveSection(idx);

          return (
            <Col
              key={idx}
              xs={12}
              md={6}
              lg={4}
              className={`${cssClassNames} mb-4`}
            >
              <AhOfferCard offer={offer}></AhOfferCard>
            </Col>
          );
        })}
      </Row>
      <Row className="d-md-none">
        <Col>
          <div className="d-flex justify-content-center">
            <AhLink
              href="/offers-listing"
              variant="secondary"
              className="w-100"
            >
              Plus
            </AhLink>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function resposiveSection(idx) {
  let cssClassNames = "";
  if (idx == 2) {
    cssClassNames = "d-none d-lg-block";
  }

  return cssClassNames;
}
