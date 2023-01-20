/* eslint-disable react/jsx-key */

import { Col, Container, Row } from "react-bootstrap";
import AhOffersSearch from "./AhOffersSearch";

import styles from "../../styles/components/SectionSearch.module.css";

export default function SectionSearch(props) {
  return (
    <div className={styles.sectionSearch}>
      <h1 className={styles.title}>Trouver un logement atypique</h1>
      <Container>
        <Row className="justify-content-center">
          <Col lg={11}>
            <AhOffersSearch></AhOffersSearch>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
