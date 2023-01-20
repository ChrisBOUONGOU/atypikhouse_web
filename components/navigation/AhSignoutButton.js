import { signOut } from "next-auth/react";
import router from "next/router";
import { Nav } from "react-bootstrap";

export default function AhSignoutButton() {
  const logoutUser = async () => {
    // logut from nextjs
    //const data = await signOut({ redirect: false, callbackUrl: "/logout" });
    signOut();
    // logout also from Keycloak
    //router.push(data.url);
  };

  return (
    <Nav.Link id="signout" href="#" onClick={logoutUser}>
      Se déconnecter
    </Nav.Link>
  );
}
