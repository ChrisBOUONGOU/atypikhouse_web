import Image from "next/image";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import AhSignoutButton from "./AhSignoutButton";

export default function AhOwnerNavbar() {
  return (
    <Navbar className="flex-shrink-0" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Image
            src="/images/site/logo.png"
            width={140}
            height={70}
            alt="AtypikHouse logo"
          ></Image>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Link href="/owner/offer/create">
              <Nav.Link>Mettre en location</Nav.Link>
            </Link>
            <AhSignoutButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
