import "../styles/globals.css";
import "../styles/calendar.css";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "../components/security/AuthGuard";
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }
  return (
    <SessionProvider session={session}>
      <AuthGuard requireRole={Component.requireRole}>
        <Component {...pageProps} />
      </AuthGuard>
    </SessionProvider>
  );
}

export default MyApp;
