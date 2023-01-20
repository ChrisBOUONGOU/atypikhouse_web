import { Form } from "react-bootstrap";
import {
  URI_CITIES_BY_REGION,
  URI_DYNAMIC_PROP_BY_CATEGORY,
  URI_OFFER_BY_ID,
  URI_OFFER_HIGHLIGHT_DELETE,
  URI_OFFER_MEDIA_DELETE,
} from "../api/constants";
import nextClient from "../api/nextClient";

export function buildDynamicPropFields(dynamicPropFormData, register) {
  return dynamicPropFormData.map((dynamicProp, index) => {
    if (dynamicProp.type === "NUMERICAL") {
      return (
        <Form.Group className="mb-3" key={index}>
          <Form.Label>{dynamicProp.name}</Form.Label>
          <Form.Control
            type="number"
            {...register(`dp_${dynamicProp.id}`)}
            // className={`${errors.title ? "is-invalid" : ""}`}
          />
          {/*<div className="invalid-feedback">
                {errors.title?.message}
                </div>*/}
        </Form.Group>
      );
    }
    if (dynamicProp.type === "TEXT") {
      return (
        <Form.Group className="mb-3" key={index}>
          <Form.Label>{dynamicProp.name}</Form.Label>
          <Form.Control type="text" {...register(`dp_${dynamicProp.id}`)} />
        </Form.Group>
      );
    }

    if (dynamicProp.type === "BINARY") {
      return (
        <Form.Group className="mb-3" key={index}>
          <Form.Label>{dynamicProp.name}</Form.Label>
          <Form.Check type="switch" {...register(`dp_${dynamicProp.id}`)} />
        </Form.Group>
      );
    }
  });
}

export async function getDynamicPropertiesForOfferType(offerTypeId) {
  if (offerTypeId) {
    const uri = URI_DYNAMIC_PROP_BY_CATEGORY.replace("{otid}", offerTypeId);
    const dynamicPropertiesResult = await nextClient.get(uri);
    return dynamicPropertiesResult;
  }
  return null;
}

export async function getCitiesByRegion(regionId) {
  if (regionId) {
    return await nextClient.get(`${URI_CITIES_BY_REGION}${regionId}`);
  }
  return null;
}

export async function deleteMedia(mediaId) {
  const result = await nextClient.get(`${URI_OFFER_MEDIA_DELETE}${mediaId}`);
  if (result && result.data) {
    return true;
  }
  return false;
}

export async function deleteHighlight(highlightId) {
  const result = await nextClient.get(
    `${URI_OFFER_HIGHLIGHT_DELETE}${highlightId}`
  );
  if (result && result.data) {
    return true;
  }
  return false;
}

export async function getOfferById(offerId) {
  if (offerId) {
    const result = await nextClient.get(`${URI_OFFER_BY_ID}${offerId}`);
    if (result && result.data && result.data.id) {
      return result.data;
    }
  }
  return null;
}
