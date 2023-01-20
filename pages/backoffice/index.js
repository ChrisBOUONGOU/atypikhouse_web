import { Container, Table } from "react-bootstrap";
import BackofficeLayout from "../../components/layout/BackofficeLayout";
import AhLink from "../../components/widgets/AhLink";
import { MANAGED_ENTITIES } from "../../lib/back/api/constants";
import { URL_BACKOFFICE_MANAGE_DISPLAY } from "../../lib/front/web/constants";

export default function BackofficeIndex(props) {
  return (
    <BackofficeLayout>
      <Container>
        <h1>Bienvenue au backoffice</h1>
        <p>
          Dans cet espace vous pouvez administrer l&apos;ensemble des données de
          la plateforme.
        </p>
        <Table>
          <thead>
            <th>Nom table</th>
            <th>Action</th>
          </thead>
          <tbody>
            {props.entities.map((entity, idx) => {
              return (
                <tr key={idx}>
                  <td>{entity.name}</td>
                  <td>
                    <AhLink
                      className="me-2 mb-1"
                      href={`${URL_BACKOFFICE_MANAGE_DISPLAY}${entity.url}`}
                    >
                      Lister
                    </AhLink>
                    {entity.isInsertable && (
                      <AhLink
                        variant="secondary"
                        className="me-2 mb-1"
                        href={`${URL_BACKOFFICE_MANAGE_DISPLAY}${entity.url}/create`}
                      >
                        Ajouter
                      </AhLink>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </BackofficeLayout>
  );
}

export async function getServerSideProps(context) {
  const entities = MANAGED_ENTITIES;

  return {
    props: {
      entities,
    },
  };
}

BackofficeIndex.requireRole = ["ROLE_ADMIN", "ROLE_MODERATOR"];
