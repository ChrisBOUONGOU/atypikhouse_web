import { isObject } from "../../lib/back/BackofficeService";
import styles from "../../styles/components/backoffice/GenericEntityDetail.module.css";

export default function GenericEntityDetail(props) {
  if (!props.entityData) {
    return <p>Enregistrement introuvable</p>;
  }

  const formattedData = formatEntityData(props.entityData);
  return <dl className={`row ${styles.entityDetail}`}>{formattedData}</dl>;
}

function formatEntityData(entityData) {
  if (isObject(entityData)) {
    return Object.keys(entityData).map((key, idx) => {
      if (Array.isArray(entityData[key])) {
        return (
          <>
            <dt className="col-sm-3">{key}</dt>
            <dd className="col-sm-9">
              {entityData[key].length ? (
                <dl className="row">
                  {entityData[key].map((entry, idxE) =>
                    formatEntityData(entry)
                  )}
                </dl>
              ) : null}
            </dd>
          </>
        );
      }
      if (isObject(entityData[key])) {
        return (
          <>
            <dt className="col-sm-3">{key}</dt>
            <dd className="col-sm-9">
              <dl className="row">{formatEntityData(entityData[key])}</dl>
            </dd>
          </>
        );
      }
      return (
        <>
          <dt className="col-sm-3">{key}</dt>
          <dd className="col-sm-9">{"" + entityData[key]}</dd>
        </>
      );
    });
  }
  return <span>{entityData}</span>;
}
