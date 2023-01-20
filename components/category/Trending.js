/* eslint-disable react/jsx-key */
import { Col, Container, Row } from "react-bootstrap";
import AhLink from "../widgets/AhLink";
import AhCard from "../widgets/AhCard";

export default function Trending({ trendingCollections, className }) {
  trendingCollections = trendingCollections.slice(0, 2);

  return (
    <Container className={className}>
      <Row className="mb-2">
        <Col>
          <h2>Tendance</h2>
        </Col>
        <Col className="d-none d-md-block">
          <div className="d-flex justify-content-end">
            <AhLink
              href="/categories-listing?trending=true"
              variant="secondary"
              className="px-4"
            >
              Découvrir
            </AhLink>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-between">
        {trendingCollections.map((category, index) => {
          return (
            <Col key={index} xs={12} md={6} className="mb-4">
              <AhCard
                src={category.imageUrl}
                href={`/category/${category.id}`}
                style={{
                  height: "300px",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
                alt={`image ${category.name}`}
              >
                <h3>{category.name}</h3>
              </AhCard>
            </Col>
          );
        })}
      </Row>
      <Row className="d-md-none">
        <Col>
          <div className="d-flex justify-content-center">
            <AhLink
              href="/categories-listing?trending=true"
              variant="secondary"
              className="w-100"
            >
              Découvrir
            </AhLink>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
