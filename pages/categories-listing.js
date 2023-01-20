/* eslint-disable react/jsx-key */
import { Container } from "react-bootstrap";
import CategoriesList from "../components/category/CategoriesList";
import CustomerLayout from "../components/layout/CustomerLayout";
import { getCategories, getTrending } from "../lib/back/CategoryService";
import Head from "next/head";
import AhPagination from "../components/widgets/AhPagination";

export default function CategoriesListingPage(props) {
  return (
    <CustomerLayout>
      <Head>
        <title>Collections Offres - AtypikHouse</title>
        <meta
          property="og:title"
          content="Collections Offres - AtypikHouse"
          key="title"
        />
      </Head>
      <Container>
        <h1 className="mt-5 mb-2">
          {props.isTrending ? "Nos Collections Trending" : "Nos Collections"}
        </h1>
      </Container>
      <CategoriesList categories={props.categories}></CategoriesList>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  let categories;
  if (context.query.trending) {
    categories = await getTrending();
  } else {
    categories = await getCategories();
  }

  return {
    props: {
      categories,
      isTrending: context.query.trending || false,
    },
  };
}
