/* eslint-disable react/jsx-key */
import { Col, Container, Row } from "react-bootstrap";
import AhCard from "../widgets/AhCard";

export default function CategoriesList({ categories, className }) {
  return (
    <Container className={className}>
      <Row>
        {categories.map((category, index) => {
          return (
            <Col key={index} xs={12} md={6} lg={4} className={`mb-4`}>
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
    </Container>
  );
}
