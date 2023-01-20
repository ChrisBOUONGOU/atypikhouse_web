/* eslint-disable react/jsx-key */
import { Container } from "react-bootstrap";
import CustomerLayout from "../components/layout/CustomerLayout";
import OffersList from "../components/offer/OffersList";
import AhPagination from "../components/widgets/AhPagination";
import { getOffers } from "../lib/back/OfferService";
import Head from "next/head";

export default function OffersListingPage(props) {
  return (
    <CustomerLayout>
      <Head>
        <title>Offres Locations - AtypikHouse</title>
        <meta
          property="og:title"
          content="Offres Locations - AtypikHouse"
          key="title"
        />
      </Head>
      <Container>
        <h1 className="mt-5 mb-2">Liste des offres disponibles</h1>
      </Container>
      <OffersList offers={props.offers}></OffersList>
      <AhPagination total={props.totalItems}></AhPagination>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const pageNumber = context.query.page;
  const offersData = await getOffers(pageNumber);

  return {
    props: {
      offers: offersData.offers,
      totalItems: offersData.totalItems,
    },
  };
}
