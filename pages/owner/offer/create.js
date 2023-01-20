import { Container } from "react-bootstrap";
import CustomerLayout from "../../../components/layout/CustomerLayout";
import Head from "next/head";
import OfferForm from "../../../components/offer/OfferForm";
import { getAllCategories } from "../../../lib/back/CategoryService";
import { getCountryRegions } from "../../../lib/back/AddressService";
import { getEquipments } from "../../../lib/back/EquipmentService";
import OwnerLayout from "../../../components/layout/OwnerLayout";

export default function CreateOffer(props) {
  return (
    <OwnerLayout>
      <Head>
        <title>Ajouter Offre - AtypikHouse</title>
        <meta
          property="og:title"
          content="Ajouter Offre - AtypikHouse"
          key="title"
        />
      </Head>
      <Container>
        <h1 className="mt-5">Ajouter une offre</h1>
        <OfferForm
          offerTypes={props.categories}
          regions={props.regions}
          equipments={props.equipments}
        ></OfferForm>
      </Container>
    </OwnerLayout>
  );
}

export async function getServerSideProps(context) {
  const categories = await getAllCategories();
  const regions = await getCountryRegions("France");
  const equipments = await getEquipments();
  return {
    props: {
      categories,
      regions,
      equipments,
    },
  };
}

CreateOffer.requireRole = ["ROLE_OWNER"];
