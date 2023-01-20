/* eslint-disable react/jsx-key */
import CustomerLayout from "../../components/layout/CustomerLayout";
import OffersList from "../../components/offer/OffersList";
import { getCategoryOffers } from "../../lib/back/OfferService";
import { getCategory } from "../../lib/back/CategoryService";
import { Container } from "react-bootstrap";

import styles from "../../styles/components/CategoryPage.module.css";
import AhPagination from "../../components/widgets/AhPagination";

export default function CategoryPage(props) {
  return (
    <CustomerLayout>
      <div
        className={`mb-5 ${styles.header} d-flex flex-column-reverse`}
        style={{
          backgroundImage: `url(${props.category.imageUrl})`,
        }}
      >
        <h1>{props.category.name}</h1>
      </div>
      <Container>
        <p className="text-center fs-4 mb-4">
          Découvrez les dernières offres de la catégorie {props.category.name}
        </p>
      </Container>
      <OffersList offers={props.offers}></OffersList>
      <AhPagination total={props.totalItems}></AhPagination>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const pageNumber = context.query.page;

  const cid = context.params.cid;
  const offersData = await getCategoryOffers(cid, pageNumber);
  const category = await getCategory(cid);

  return {
    props: {
      offers: offersData.offers,
      category,
      totalItems: offersData.totalItems,
    },
  };
}
