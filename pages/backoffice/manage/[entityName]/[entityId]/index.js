import { Container } from "react-bootstrap";
import GenericEntityDetail from "../../../../../components/backoffice/GenericEntityDetail";
import BackofficeLayout from "../../../../../components/layout/BackofficeLayout";
import AhLink from "../../../../../components/widgets/AhLink";
import {
  getEntityDataById,
  isEntityManaged,
} from "../../../../../lib/back/BackofficeService";
import { URL_BACKOFFICE_PAGE } from "../../../../../lib/front/web/constants";

export default function EntityManagePage(props) {
  return (
    <BackofficeLayout>
      <Container>
        <h1>
          Backoffice - Administration de la table <i>{props.entityName}</i>
        </h1>
        <hr />
        <h2>Détail de l&apos;enregistrement ID : {props.entityData.id}</h2>
        <hr />
        <GenericEntityDetail
          entityData={props.entityData}
        ></GenericEntityDetail>
        <div className="text-center">
          <AhLink href={`/backoffice/manage/${props.entityName}`} className="mb-2" variant="secondary">
            Retour
          </AhLink>
        </div>
      </Container>
    </BackofficeLayout>
  );
}

export async function getServerSideProps(context) {
  const entityUrl = context.params.entityName;
  const entityId = context.params.entityId;

  // only managed entities can be displayed
  // not managed => redirect to Backoffice Home
  if (!isEntityManaged(entityUrl)) {
    return {
      redirect: {
        destination: URL_BACKOFFICE_PAGE,
        permanent: false,
      },
    };
  }

  const entityData = await getEntityDataById(entityUrl, entityId);

  return {
    props: {
      entityData,
      entityName: entityUrl,
    },
  };
}

EntityManagePage.requireRole = ["ROLE_ADMIN", "ROLE_MODERATOR"];
