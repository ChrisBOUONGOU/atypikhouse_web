/* eslint-disable react/jsx-key */
import { Col, Container, Row } from "react-bootstrap";
import styles from "../../styles/components/Newsletter.module.css";
import AhButton from "../widgets/AhButton";

export default function NewsLetter({ className }) {
  return (
    <div className={`${className} ${styles.newsletter}`}>
      <Container>
        <Row className="justify-content-center mb-3">
          <Col md={10}>
            <h5 className={styles.title}>
              Recevez les dernières offres et nouveautés
            </h5>
            <p>
              Vous êtes passionnés par le voyage et vous souhaitez profiter de
              nos dernières offres.
              <br />
              N&apos;attendez plus et rejoignez notre newsletter pour recevoir
              nos meilleurs offres de la saison.
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={4}>
            <input
              type="email"
              className="form-control mb-2"
              placeholder="votre adresse email"
            />
          </Col>
          <Col lg={2}>
            <AhButton variant="light" text="S'abonner">
              S&apos;abonner
            </AhButton>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
