import { Container } from "react-bootstrap";
import CustomerLayout from "../../../../components/layout/CustomerLayout";
import Head from "next/head";
import { getCategory } from "../../../../lib/back/CategoryService";
import {
  getAddressById,
  getCitiesByRegion,
  getCountryRegions,
} from "../../../../lib/back/AddressService";
import {
  getEquipments,
  getEquipmentsFor,
} from "../../../../lib/back/EquipmentService";
import OfferFormEdit from "../../../../components/offer/OfferFormEdit";
import { getOfferDetailById } from "../../../../lib/back/OfferService";
import { getDynamicPropertValuesFor } from "../../../../lib/back/DynamicPropertyValueService";
import { getIdFromIRI } from "../../../../lib/common/Util";
import { getDynamicPropertiesByCategory } from "../../../../lib/back/DynamicPropertyService";
import OwnerLayout from "../../../../components/layout/OwnerLayout";

export default function UpdateOffer(props) {
  return (
    <OwnerLayout>
      <Head>
        <title>Détail Offre - AtypikHouse</title>
        <meta
          property="og:title"
          content="Détail Offre - AtypikHouse"
          key="title"
        />
      </Head>
      <Container>
        <h1 className="mt-5">
          Détail de l&apos;offre &lt;{props.offer.title}&gt;
        </h1>
        <OfferFormEdit
          offerType={props.offerType}
          regions={props.regions}
          equipments={props.equipments}
          offerData={props.offer}
          offerAddress={props.offerAddress}
          offerEquipments={props.offerEquipments}
          offerDynamicPropertyValues={props.offerDynamicPropertyValues}
          citiesOfOfferRegion={props.citiesOfOfferRegion}
          offerTypeDynamicProperties={props.offerTypeDynamicProperties}
        ></OfferFormEdit>
      </Container>
    </OwnerLayout>
  );
}

export async function getServerSideProps(context) {
  const offerId = context.query.oid;
  const offer = await getOfferDetailById(offerId);

  if (!offer || !offer.id) {
    return {
      notFound: true,
    };
  }

  const regions = await getCountryRegions("France");
  const equipments = await getEquipments();

  let offerEquipments = [];
  if (offer && offer.id && offer.address.id) {
    offerEquipments = await getEquipmentsFor(offer.id);
  }

  let offerAddress = null;
  if (offer && offer.id && offer.address.id) {
    offerAddress = await getAddressById(offer.address.id);
  }

  const offerType = await getCategory(getIdFromIRI(offer.offerType));

  let offerTypeDynamicProperties = [];
  if (offerType && offerType.id) {
    offerTypeDynamicProperties = await getDynamicPropertiesByCategory(
      offerType.id
    );
  }

  let citiesOfOfferRegion = null;

  if (
    offerAddress &&
    offerAddress.city &&
    offerAddress.city.region &&
    offerAddress.city.region.id
  ) {
    citiesOfOfferRegion = await getCitiesByRegion(offerAddress.city.region.id);
  }

  let offerDynamicPropertyValues = [];
  if (offer && offer.id && offer.dynamicPropertyValues.length > 0) {
    offerDynamicPropertyValues = await getDynamicPropertValuesFor(offerId);
  }

  return {
    props: {
      offerType,
      regions,
      equipments,
      offer,
      offerAddress,
      offerEquipments,
      offerDynamicPropertyValues,
      citiesOfOfferRegion,
      offerTypeDynamicProperties,
    },
  };
}

UpdateOffer.requireRole = ["ROLE_OWNER"];
