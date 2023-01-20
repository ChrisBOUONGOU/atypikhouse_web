/* eslint-disable react-hooks/rules-of-hooks */
import { Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import * as Fields from "./FormFields";
import AhButton from "../../AhButton";
import nextClient from "../../../../lib/front/api/nextClient";
import { URI_BACKOFFICE_PERSIST } from "../../../../lib/front/api/constants";
import { useRouter } from "next/router";
import { URL_BACKOFFICE_MANAGE_DISPLAY } from "../../../../lib/front/web/constants";
import { isObject } from "../../../../lib/back/BackofficeService";
import AhLink from "../../AhLink";

export default function AhForm({ entityUrl, entityData = null, fields }) {
  if (!fields) return null;

  const { handleSubmit, setValue, ...methods } = useForm();

  const router = useRouter();

  const onSubmit = async (values) => {
    const uri = `${URI_BACKOFFICE_PERSIST}/${entityUrl}`;

    const payload = buildFormData(values, entityData);
    const result = await nextClient.postFile(uri, payload);
    if (result && result.data && result.data.id) {
      router.push(
        `${URL_BACKOFFICE_MANAGE_DISPLAY}${entityUrl}/${result.data.id}`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({ fieldType, ...field }, index) => {
          const Field = Fields[fieldType];

          if (!Field) return null;

          if (entityData && fieldType != "FormFile") {
            setValue(field.name, entityData[field.name]);
          }

          return <Field key={index} {...field} />;
        })}

        <AhButton type="submit">Sauvegarder</AhButton>
        <AhLink href="/backoffice" className="ms-2" variant="secondary">
          Annuler
        </AhLink>
      </Form>
    </FormProvider>
  );
}

function buildFormData(values, entityData) {
  let payload = new FormData();

  let normalFields = {};

  const keys = Object.keys(values);

  keys.forEach((key) => {
    // if content is not a primitif type or an array type then it's a file
    if (isObject(values[key]) && !Array.isArray(values[key])) {
      payload.append(key, values[key][0]);
    } else {
      normalFields = { ...normalFields, [key]: values[key] };
    }
  });

  // append ID if entityData not null (update mode)
  if (entityData && entityData.id) {
    normalFields = { ...normalFields, id: entityData.id };
  }

  // Fix issue with Type Conversion in Server side
  // FormData Allows only string values
  // Convert fields to JSON and parse json on server side
  // to get correct type
  payload.append("ahFields", JSON.stringify(normalFields));

  return payload;
}
