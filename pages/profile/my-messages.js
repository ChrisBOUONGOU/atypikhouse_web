/* eslint-disable react/jsx-key */
import { getSession } from "next-auth/react";
import { Col, Container, Row } from "react-bootstrap";
import CustomerLayout from "../../components/layout/CustomerLayout";
import { getUser } from "../../lib/back/UserService";
import ProfileNav from "../../components/profile/ProfileNav";

export default function MyReservations(props) {
  return (
    <CustomerLayout>
      <Container className="mt-5">
        <h1>Mes messages</h1>
        <Row className="justify-content-md-between">
          <Col lg={3} className="order-lg-2">
            <ProfileNav source="messages" />
          </Col>
          <Col lg={9} className="mt-5 order-lg-1"></Col>
        </Row>
      </Container>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const user = await getUser(session);

  return {
    props: {
      user,
    },
  };
}

MyReservations.requireRole = ["ROLE_USER"];
