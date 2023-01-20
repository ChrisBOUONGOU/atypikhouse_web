import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { getUserById } from "../../lib/back/UserService";
import OwnerLayout from "../../components/layout/OwnerLayout";
import AhLink from "../../components/widgets/AhLink";

export default function OwnerIndex(props) {
  return (
    <OwnerLayout>
      <Head>
        <title>AtypikHouse</title>
        <meta property="og:title" content="AtypikHouse" key="title" />
      </Head>
      <Container className="mb-5">
        <h1 className="mt-5">Espace Propriétaire</h1>
        <hr className="mb-5" />
        <div className="mb-5">
          <p>
            Bonjour {props.currentUser.firstName} {props.currentUser.lastName}
          </p>
          <br />
          <p>
            Vous êtes connecté en tant que propriétaire, dans cette espace vous
            mettre en location votre bien, le consulter, l&apos;éditer et
            consulter vos commandes.
          </p>
        </div>

        <div className="fs-5">
          <Row className="pb-3 pt-3 border-bottom justify-content-between">
            <Col md={5}>Je souhaite mettre en location mon bien</Col>
            <Col md={2}>
              <AhLink variant="secondary" href="/owner/offer/create">
                Continuer
              </AhLink>
            </Col>
          </Row>

          <Row className="pb-3 pt-3 border-bottom justify-content-between">
            <Col md={5}>Je souhaite consulter mes offres</Col>
            <Col md={2}>
              <AhLink variant="secondary" href="/owner/offers">
                Continuer
              </AhLink>
            </Col>
          </Row>

          <Row className="pb-3 pt-3 border-bottom justify-content-between">
            <Col md={5}>Je souhaite consulter mes commandes</Col>
            <Col md={2}>
              <AhLink variant="secondary" href="/owner/orders">
                Continuer
              </AhLink>
            </Col>
          </Row>
        </div>
      </Container>
    </OwnerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user || !session.user.id) {
    return {
      notFound: true,
    };
  }

  const user = await getUserById(session.user.id);

  return {
    props: {
      currentUser: user,
    },
  };
}

OwnerIndex.requireRole = ["ROLE_OWNER"];
