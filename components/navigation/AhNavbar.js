import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container, Modal, Nav, Navbar } from "react-bootstrap";
import RegisterForm from "../register/RegisterForm";
import AhSigninButton from "./AhSigninButton";
import AhSignoutButton from "./AhSignoutButton";

export default function AhNavbar() {
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
        <Navbar.Brand id="logo" href="/">
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
            
              <Nav.Link href="/offers-listing">
              Locations
              </Nav.Link>
         
            {status === "unauthenticated" ? (
              <>
                <Nav.Link href="#" onClick={handleShowOwnerRegisterModal}>
                  Devenir hôte
                </Nav.Link>
                <AhSigninButton />
                <Nav.Link
                  id="sign-up"
                  href="#"
                  onClick={handleShowCustomerRegisterModal}
                >
                  Inscription
                </Nav.Link>
              </>
            ) : (
              <>
                <Link href="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </Link>
                <AhSignoutButton />
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Modal
        show={showRegisterModal}
        fullscreen="md-down"
        onHide={handleCloseCustomerRegister}
      >
        <Modal.Header closeButton>
          <Modal.Title>Inscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm isOwner={isOwner}></RegisterForm>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}
