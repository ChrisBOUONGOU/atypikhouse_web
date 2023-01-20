import { signIn } from "next-auth/react";
import { Nav } from "react-bootstrap";

export default function AhSigninButton({ btnClassName }) {
  const login = () => {
    signIn();
  };

  return (
    <Nav.Link id="signin" className={btnClassName} href="#" onClick={login}>
      Se connecter
    </Nav.Link>
  );
}
