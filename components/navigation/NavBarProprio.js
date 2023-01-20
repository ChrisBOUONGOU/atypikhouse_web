import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container, Modal, Nav, Navbar } from "react-bootstrap";
import RegisterForm from "../register/RegisterForm";
import AhSignoutButton from "./AhSignoutButton";

export default function NavBarProprio() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const { status } = useSession();

  const handleCloseCustomerRegister = () => setShowRegisterModal(false);
  const handleShowCustomerRegisterModal = () => {
    setIsOwner(false);
    setShowRegisterModal(true);
  };
  const handleShowOwnerRegisterModal = () => {
    setIsOwner(true);
    setShowRegisterModal(true);
  };

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
            <Link href="#">
              <Nav.Link>Locations</Nav.Link>
            </Link>
            {status === "unauthenticated" ? (
              <>
                <Nav.Link href="#">
                  champ
                </Nav.Link>
                <AhSignoutButton formClassName="nav-link" renderAsText={true} />
                <Nav.Link href="#">
                  champ 
                </Nav.Link>
              </>
            ) : (
              <>
                <Link href="#">
                  <Nav.Link>champ</Nav.Link>
                </Link>
                <AhSignoutButton formClassName="nav-link" renderAsText={true} />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
       
    </Navbar>
  );
}
