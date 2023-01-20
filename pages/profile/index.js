/* eslint-disable react/jsx-key */
import { getSession } from "next-auth/react";
import { Col, Container, Row, Table } from "react-bootstrap";
import CustomerLayout from "../../components/layout/CustomerLayout";
import { getUser } from "../../lib/back/UserService";
import ProfileNav from "../../components/profile/ProfileNav";

export default function Profile(props) {
  return (
    <CustomerLayout>
      <Container className="mt-5">
        <h1>Profile</h1>
        <Row className="justify-content-md-between">
          <Col lg={3} className="order-lg-2">
            <ProfileNav />
          </Col>
          <Col lg={5} className="mt-5 order-lg-1">
            <Table hover>
              <tbody>
                <tr>
                  <td className="fw-bold">Email</td>
                  <td>{props.user.email}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Nom</td>
                  <td>{props.user.lastName}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Prénom</td>
                  <td>{props.user.firstName}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Date de naissance</td>
                  <td>{props.user.phoneNumber}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
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

Profile.requireRole = ["ROLE_USER"];
