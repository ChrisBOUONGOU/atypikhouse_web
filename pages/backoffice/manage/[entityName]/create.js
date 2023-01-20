import { getSession } from "next-auth/react";
import { Container } from "react-bootstrap";
import BackofficeLayout from "../../../../components/layout/BackofficeLayout";
import AhForm from "../../../../components/widgets/backoffice/form/AhForm";
import {
  getEntityFieldsDefinition,
  isEntityManaged,
} from "../../../../lib/back/BackofficeService";
import { URL_BACKOFFICE_PAGE } from "../../../../lib/front/web/constants";

export default function EntityManagePage(props) {
  return (
    <BackofficeLayout>
      <Container>
        <h1>
          Backoffice - Administration de la table <i>{props.entityUrl}</i>
        </h1>
        <hr />
        <AhForm entityUrl={props.entityUrl} fields={props.entityFields} />
      </Container>
    </BackofficeLayout>
  );
}

export async function getServerSideProps(context) {
  const entityUrl = context.params.entityName;
  const session = await getSession(context);

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

  const entityFields = await getEntityFieldsDefinition(entityUrl, session);

  return {
    props: {
      entityUrl,
      entityFields,
    },
  };
}

EntityManagePage.requireRole = ["ROLE_ADMIN", "ROLE_MODERATOR"];
