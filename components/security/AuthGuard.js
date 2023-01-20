/* eslint-disable react/jsx-key */
import { useSession } from "next-auth/react";
import NotAuthorized from "./NotAuthorized";

export default function AuthGuard({ children, requireRole }) {
  const { data: session } = useSession();

  if (!requireRole) {
    return <>{children}</>;
  }

  if (session && Array.isArray(session.userRoles)) {
    const hasRole = requireRole.some((role) =>
      session.userRoles.includes(role)
    );
    if (hasRole) {
      return <>{children}</>;
    }
  }

  return <NotAuthorized></NotAuthorized>;
}
