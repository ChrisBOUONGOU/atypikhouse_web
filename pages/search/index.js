/* eslint-disable react/jsx-key */

import { Col, Container, Row } from "react-bootstrap";
import CustomerLayout from "../../components/layout/CustomerLayout";
import OffersList from "../../components/offer/OffersList";
import SectionSearch from "../../components/search/SectionSearch";
import AhPagination from "../../components/widgets/AhPagination";
import { getOffersBy } from "../../lib/back/OfferService";
import Head from "next/head";

export default function SearchPage(props) {
  return (
    <CustomerLayout>
      <Head>
        <title>Recherche Locations - AtypikHouse</title>
        <meta
          property="og:title"
          content="Recherche Locations - AtypikHouse"
          key="title"
        />
      </Head>
      <SectionSearch></SectionSearch>
      {props.offers && props.offers.length ? (
        <>
          <Container>
            <h3>Résulat de recherche</h3>
          </Container>
          <OffersList offers={props.offers}></OffersList>
          <AhPagination total={props.totalItems}></AhPagination>
        </>
      ) : (
        <Container>
          <p id="emptyOfferResult">Aucun Résultat trouvé.</p>
        </Container>
      )}
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const offersData = await getOffersBy(context.query);
  return {
    props: {
      offers: offersData.offers,
      totalItems: offersData.totalItems,
    },
  };
}
