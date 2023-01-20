/* eslint-disable react/jsx-key */
import { Col, Container, Row } from "react-bootstrap";
import AhLink from "../widgets/AhLink";
import AhCard from "../widgets/AhCard";

export default function CategoriesSection({ categories, className }) {
  categories = categories.slice(0, 6);

  return (
    <Container className={className}>
      <Row className="mb-2">
        <Col>
          <h2>Nos Collections</h2>
        </Col>
        <Col className="d-none d-md-block">
          <div className="d-flex justify-content-end">
            <AhLink
              href="/categories-listing"
              variant="secondary"
              className="px-4"
            >
              Découvrir
            </AhLink>
          </div>
        </Col>
      </Row>
      <Row>
        {categories.map((category, idx) => {
          let hideCollections = resposiveCollections(idx);
          return (
            <Col
              key={idx}
              xs={12}
              md={6}
              lg={4}
              className={`mb-4 ${hideCollections}`}
            >
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
              href="/categories-listing"
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

function resposiveCollections(idx) {
  let cssClassNames = "";
  if (idx >= 2 && idx < 4) {
    cssClassNames = `d-none d-md-block`;
  }
  if (idx >= 4) {
    cssClassNames = `d-none d-lg-block`;
  }
  return cssClassNames;
}
