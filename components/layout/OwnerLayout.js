import Head from "next/head";
import AhBackofficeNavbar from "../navigation/AhBackofficeNavbar";
import AhBackofficeFooter from "../navigation/AhBackofficeFooter";

export default function BackofficeLayout({ children }) {
  return (
    <>
      <Head>
        <title>AtypikHouse</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="wrap d-flex flex-column">
        <AhBackofficeNavbar />
        <main className="flex-shrink-0">{children}</main>
        <AhBackofficeFooter />
      </div>
    </>
  );
}
