import {  Container, Row } from "react-bootstrap";

export default function AhBackofficeFooter() {
  return (
    <footer
      className="footer mt-auto text-white pt-5"
      style={{ backgroundColor: "#666666" }}
    >
      <Container>
        <Row className="text-center mt-4">
          <p>
            <span className="border-top border-light">
              Copyright &copy; 2021 AtypikHouse
            </span>
          </p>
        </Row>
      </Container>
    </footer>
  );
}
