/* eslint-disable react/jsx-key */
import { Alert, Container } from "react-bootstrap";
import CustomerLayout from "../layout/CustomerLayout";
import Link from "next/link";

export default function NotAuthorized() {
  return (
    <CustomerLayout>
      <Container className="mt-5">
        <h1>Ouuups! Page inaccessible</h1>
        <Alert variant="light">
          Cette page n&apos;existe pas ou vous n&apos;avez pas le droit d&apos;y
          accéder.{" "}
          <Link href="/api/auth/signin">
            <Alert.Link>Se connecter</Alert.Link>
          </Link>{" "}
          ou{" "}
          <Link href="/">
            <Alert.Link>Retourner à la page d&apos;accueil</Alert.Link>
          </Link>
        </Alert>
      </Container>
    </CustomerLayout>
  );
}
