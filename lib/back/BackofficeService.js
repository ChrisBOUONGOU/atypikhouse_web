import apiPlatformClient from "./api/apiPlatformClient";
import {
  MANAGED_ENTITIES,
  MANAGED_ENTITIES_BASE_URL,
  URI_CATEGORIES,
  DYNAMIC_PROPERTIES_TABLE_NAME,
  OFFER_TYPE_TABLE_NAME,
  USER_TABLE_NAME,
} from "./api/constants";

export async function getTableData(entityURI, pageNumber = 1) {
  const uri = `${MANAGED_ENTITIES_BASE_URL}${entityURI}?page=${pageNumber}`;
  const result = await apiPlatformClient.get(uri, {
    accept: "application/ld+json",
  });

  if (
    result &&
    Array.isArray(result["hydra:member"]) &&
    result["hydra:member"].length
  ) {
    const entityData = createEntityData(result);
    return entityData;
  }

  return null;
}

function createEntityData(result) {
  const entityColumns = getColumnsNamesFromEntity(result["hydra:member"][0]);
  return {
    entityColumnNames: entityColumns,
    entityRecords: result["hydra:member"],
    totalItems: result["hydra:totalItems"],
  };
}

function getColumnsNamesFromEntity(entity) {
  let keys = Object.keys(entity);
  // ignore special hydra attributes (start with '@' like '@id')
  const entityColumnNames = keys.filter((key) => !key.startsWith("@"));
  return entityColumnNames;
}

export function isEntityManaged(entityUrl) {
  const value = MANAGED_ENTITIES.find((v) => v.url == entityUrl);
  return value != undefined && value != null;
}

export function isEntityEditable(entityUrl) {
  const entity = MANAGED_ENTITIES.find((v) => v.url == entityUrl);
  return entity && entity.isEditable;
}

export function isEntityRemovable(entityUrl) {
  const entity = MANAGED_ENTITIES.find((v) => v.url == entityUrl);
  return entity && entity.isRemovable;
}

export async function getEntityFieldsDefinition(entityUrl, session) {
  const entity = MANAGED_ENTITIES.find((v) => v.url == entityUrl);
  // Generic Implemetation
  if (entity && entity.fields) {
    return entity.fields;
  }
  // Special Implentation
  if (entity && !entity.fields) {
    return await getFieldsForSpecialEntity(entityUrl, session);
  }
  return null;
}

export async function getEntityDataById(entityURI, entityId) {
  const uri = `${MANAGED_ENTITIES_BASE_URL}${entityURI}/${entityId}`;
  const entityData = await apiPlatformClient.get(uri);
  return entityData;
}

// is not a primitive value
export function isObject(value) {
  return typeof value === "object" && value !== null;
}

export async function persistEntity(entityUrl, entity) {
  // id is provided => update mode
  if (entity && entity.id) {
    const uri = `${MANAGED_ENTITIES_BASE_URL}${entityUrl}/${entity.id}`;
    const result = apiPlatformClient.put(uri, { payload: entity });
    return result;
  }

  // no id provided => create mode
  if (entity && !entity.id) {
    const uri = `${MANAGED_ENTITIES_BASE_URL}${entityUrl}`;
    const result = await apiPlatformClient.post(uri, { payload: entity });
    return result;
  }
}

export async function removeEntity(entityUrl, id) {
  if (entityUrl && id) {
    const uri = `${MANAGED_ENTITIES_BASE_URL}${entityUrl}/${id}`;
    await apiPlatformClient.delete(uri);
  }
}

async function getFieldsForSpecialEntity(entityUrl, session) {
  switch (entityUrl) {
    case DYNAMIC_PROPERTIES_TABLE_NAME:
      return await getDynamicPropertiesFieldsDefinition();
    case USER_TABLE_NAME:
      return await getUserFieldsDefinition(session);
    default:
      break;
  }
  return null;
}

async function getDynamicPropertiesFieldsDefinition() {
  const categories = await apiPlatformClient.get(URI_CATEGORIES);
  const categoriesOptions = categories.map((cat) => {
    return {
      value: `${MANAGED_ENTITIES_BASE_URL}${OFFER_TYPE_TABLE_NAME}/${cat.id}`,
      displayValue: cat.name,
    };
  });

  let definition = [
    { fieldType: "FormInput", name: "name", label: "Nom propriété dynamique" },
    { fieldType: "FormBoolean", name: "isMandatory", label: "Obligatoire" },
    {
      fieldType: "FormSelect",
      name: "type",
      label: "Type de la valeur",
      selectOptions: [
        { value: "TEXT", displayValue: "Texte" },
        { value: "NUMERICAL", displayValue: "Numérique" },
        { value: "BINARY", displayValue: "Booléenne" },
      ],
    },
    {
      fieldType: "FormSelect",
      name: "offerType",
      label: "Collection",
      selectOptions: categoriesOptions,
    },
  ];
  return definition;
}

async function getUserFieldsDefinition(session) {
  const isAdmin = session.userRoles.includes("ROLE_ADMIN");
  let definition = [
    { fieldType: "FormInput", name: "firstName", label: "Prénom" },
    { fieldType: "FormInput", name: "lastName", label: "Nom" },
    { fieldType: "FormInput", name: "email", label: "Email" },
  ];

  if (isAdmin) {
    definition.push({
      fieldType: "FormSelectMultiple",
      name: "roles",
      label: "Role",
      selectOptions: [
        { value: "ROLE_USER", displayValue: "Client" },
        { value: "ROLE_OWNER", displayValue: "Propriétaire" },
        { value: "ROLE_ADMIN", displayValue: "Administrateur" },
        { value: "ROLE_MODERATOR", displayValue: "Modérateur" },
      ],
    });
  }

  return definition;
}
