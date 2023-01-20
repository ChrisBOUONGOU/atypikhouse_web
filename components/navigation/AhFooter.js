import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";

export default function AhFooter() {
  return (
    <footer
      className="footer mt-auto text-white pt-5"
      style={{ backgroundColor: "#666666" }}
    >
      <Container>
        <Row className="justify-content-center text-center text-md-start">
          <Col xs={12} md={3}>
            <ul className="list-unstyled">
              <li>
                <Link href="/about-us">
                  à propos de nous
                </Link>
              </li>
              <li>
                <Link href="/nous-contacter">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link href="/">
                  FAQ
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={3}>
            <ul className="list-unstyled">
              <li>
                <Link href="/">
                  S&apos;inscrire
                </Link>
              </li>
              <li>
                <Link href="/">
                  Devenir hôte
                </Link>
              </li>
              <li>
                <Link href="/legal-terms">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={3}>
            <ul className="list-unstyled">
              <li>
                <Link href="/">
                  Paiements
                </Link>
              </li>
              <li>
                <Link href="/">
                  Nos partenaires
                </Link>
              </li>
              <li>
                <Link href="/">
                  Cookies
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="text-center mt-4">
          <p>
            <span className="border-top border-light">
              Copyright &copy; 2023 AtypikHouse
            </span>
          </p>
        </Row>
      </Container>
    </footer>
  );
}
