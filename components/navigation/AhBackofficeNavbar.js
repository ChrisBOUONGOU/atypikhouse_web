import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Container, Nav, Navbar } from "react-bootstrap";
import AhSignoutButton from "./AhSignoutButton";
import AhSigninButton from "./AhSigninButton";

export default function AhNavbar() {
  const { status } = useSession();

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
            {status === "unauthenticated" ? (
              <AhSigninButton />
            ) : (
              <>
                <Link href="/admin/profile">
                  <Nav.Link>Profile</Nav.Link>
                </Link>
                <AhSignoutButton />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
