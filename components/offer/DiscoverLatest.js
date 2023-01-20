/* eslint-disable react/jsx-key */
import { Container } from "react-bootstrap";
import AhLink from "../widgets/AhLink";

import styles from "../../styles/components/DiscoverLatest.module.css";

export default function DiscoverLatest({ className }) {
  return (
    <Container className={className}>
      <div className={styles.discover}>
        <div className={styles.lead}>
          <h2 className="fw-bold">Dernières nouveautés</h2>
          <p className="mb-2">Découvrir les nouvelles dans le site...</p>
          <AhLink href="/offers-listing" variant="light" className="px-5">
            Découvrir
          </AhLink>
        </div>
      </div>
    </Container>
  );
}
