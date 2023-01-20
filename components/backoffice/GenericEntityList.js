import { useRouter } from "next/router";
import { Table } from "react-bootstrap";
import nextClient from "../../lib/front/api/nextClient";
import styles from "../../styles/components/backoffice/GenericEntityList.module.css";
import AhButton from "../widgets/AhButton";
import AhLink from "../widgets/AhLink";

export default function GenericEntityList(props) {
  const router = useRouter();
  let deleteEntry = async (entityName, id) => {
    const uri = `/api/backoffice/entity/delete/${entityName}?id=${id}`;
    const result = await nextClient.get(uri);
    if (result && result.data && result.data.id) {
      router.reload();
    }
  };

  return props.entityData ? (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          {props.entityData.entityColumnNames.map((columnName, idx) => {
            return <th key={idx}>{columnName}</th>;
          })}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {props.entityData.entityRecords.map((entityRecord, idx) => {
          return (
            <tr key={idx}>
              {props.entityData.entityColumnNames.map((columnName, idxC) => {
                return (
                  <td key={idxC}>
                    <p className={`${styles.cropText}`}>
                      {JSON.stringify(entityRecord[columnName])}
                    </p>
                  </td>
                );
              })}
              <td>
                <AhLink
                  href={`/backoffice/manage/${props.entityName}/${entityRecord["id"]}`}
                  className="mb-2 me-1"
                >
                  Detail
                </AhLink>
                {props.isEditable ? (
                  <AhLink
                    href={`/backoffice/manage/${props.entityName}/${entityRecord["id"]}/edit`}
                    variant="secondary"
                    className="mb-2 me-1"
                  >
                    Editer
                  </AhLink>
                ) : null}
                {props.isRemovable ? (
                  <AhButton
                    onClick={async () => {
                      await deleteEntry(props.entityName, entityRecord["id"]);
                    }}
                    variant="danger"
                    className="mb-2"
                  >
                    Supprimer
                  </AhButton>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  ) : null;
}
