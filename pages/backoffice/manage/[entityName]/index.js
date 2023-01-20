import { Container } from "react-bootstrap";
import GenericEntityList from "../../../../components/backoffice/GenericEntityList";
import BackofficeLayout from "../../../../components/layout/BackofficeLayout";
import {
  getTableData,
  isEntityEditable,
  isEntityManaged,
  isEntityRemovable,
} from "../../../../lib/back/BackofficeService";
import AhPagination from "../../../../components/widgets/AhPagination";
import { URL_BACKOFFICE_PAGE } from "../../../../lib/front/web/constants";
import AhLink from "../../../../components/widgets/AhLink";

export default function EntityManagePage(props) {
  return (
    <BackofficeLayout>
      <Container>
        <h1>
          Administration de la table <i>{props.entityName}</i>
          <hr />
        </h1>
      </Container>

      {props.entityData ? (
        <>
          <Container fluid>
            <GenericEntityList
              entityName={props.entityName}
              entityData={props.entityData}
              isEditable={props.isEntityEditable}
              isRemovable={props.isEntityRemovable}
            />
          </Container>
          <Container>
            <div className="mt-4 mb-4">
              <AhPagination total={props.entityData.totalItems}></AhPagination>
            </div>
          </Container>
        </>
      ) : (
        <Container>
          <p>La table ne contient actuellement aucun enregistrement.</p>
        </Container>
      )}
      <Container>
        <div className="text-center">
          <AhLink href="/backoffice" className="mb-2" variant="secondary">
            Retour Home
          </AhLink>
        </div>
      </Container>
    </BackofficeLayout>
  );
}

export async function getServerSideProps(context) {
  const pageNumber = context.query.page;
  const entityUrl = context.params.entityName;

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

  const backofficeEditable = isEntityEditable(entityUrl);
  const backOfficeRemovable = isEntityRemovable(entityUrl);

  const entityData = await getTableData(entityUrl, pageNumber);

  return {
    props: {
      entityData,
      entityName: entityUrl,
      isEntityEditable: backofficeEditable,
      isEntityRemovable: backOfficeRemovable,
    },
  };
}

EntityManagePage.requireRole = ["ROLE_ADMIN", "ROLE_MODERATOR"];
