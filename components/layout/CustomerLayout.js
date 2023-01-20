import Head from "next/head";
import AhFooter from "../navigation/AhFooter";
import AhNavbar from "../navigation/AhNavbar";

export default function CustomerLayout({ children }) {
  return (
    <>
      <Head>
        <title>AtypikHouse</title>
        <meta property="og:title" content="AtypikHouse" key="title" />  
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
       
      </Head>
      <div className="wrap d-flex flex-column">
      	<AhNavbar />
        <main className="flex-shrink-0">{children}</main>
        <AhFooter></AhFooter>
      </div>
    </>
  );
}
