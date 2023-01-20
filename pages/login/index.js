import Head from "next/head";
import { getCsrfToken } from "next-auth/react";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomerLayout from "../../components/layout/CustomerLayout";
import AhButton from "../../components/widgets/AhButton";

export default function LoginPage({ csrfToken, error }) {
  return (
    <CustomerLayout>
      <Head>
        <title>Se Connecter - AtypikHouse</title>
        <meta
          property="og:title"
          content="Se Connecter - AtypikHouse"
          key="title"
        />
      </Head>
      <Container>
        <Row className="justify-content-center mt-5 mb-5">
          <Col md="8" lg="5" className="border p-5">
            <h1 className="text-center">Se connecter</h1>
            <Form
              method="post"
              action="/api/auth/callback/credentials"
              className={"d-block"}
            >
              <Form.Group className="mb-3">
                <Form.Label>Adresse email</Form.Label>
                <Form.Control type="text" name="email" id="login-email-field" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  id="login-password-field"
                />
              </Form.Group>

              <Form.Control
                type="hidden"
                name="csrfToken"
                defaultValue={csrfToken}
              />

              {error && (
                <p id="credentialError" className="text-center mt-3 text-danger">
                  Email ou Mot de passe incorrecte.
                </p>
              )}

              <div className="d-grid">
                <AhButton type="submit" className="btn-lg">
                  Se connecter
                </AhButton>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </CustomerLayout>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  // handle error message
  const error = context.query.error || false;

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      error,
    },
  };
}
