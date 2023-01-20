import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Tab, Tabs } from "react-bootstrap";
import * as Yup from "yup";
import AhButton from "../widgets/AhButton";
import nextClient from "../../lib/front/api/nextClient";
import {
  IRI_OFFER_TYPES,
  URI_OFFER_CREATE,
} from "../../lib/front/api/constants";
import {
  buildDynamicPropFields,
  getCitiesByRegion,
  getDynamicPropertiesForOfferType,
} from "../../lib/front/offer/OfferCreate";
import router from "next/router";
import { getIdFromIRI } from "../../lib/common/Util";

export default function OfferForm({ offerTypes, regions, equipments }) {
  const validationSchema = getValidationSchema();
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [dynamicPropFormData, setDynamicPropFormData] = useState(null);
  const [citiesFormData, setCitiesFormData] = useState(null);

  let onSelectOfferType = async (event) => {
    if (!event || !event.target || !event.target.value) {
      setDynamicPropFormData(null);
      return;
    }

    // event.target.value => contains OfferType IRI (/api/offer_types/:id)
    const offerTypeId = getIdFromIRI(event.target.value);

    const dynamicPropertiesResult = await getDynamicPropertiesForOfferType(
      offerTypeId
    );

    if (
      dynamicPropertiesResult &&
      Array.isArray(dynamicPropertiesResult.data) &&
      dynamicPropertiesResult.data.length > 0
    ) {
      setDynamicPropFormData(dynamicPropertiesResult.data);
      return;
    }

    setDynamicPropFormData(null);
  };

  let onSelectRegion = async (event) => {
    if (!event || !event.target || !event.target.value) {
      setCitiesFormData(null);
      return;
    }
    const cities = await getCitiesByRegion(event.target.value);
    if (cities && Array.isArray(cities.data) && cities.data.length > 0) {
      setCitiesFormData(cities.data);
    } else {
      setCitiesFormData(null);
    }
  };

  async function onSubmit(data) {
    let dynamicPropertyValues = [];
    let address = {};

    // dynamic properties
    if (dynamicPropFormData) {
      dynamicPropFormData.forEach((element) => {
        let pair = {
          dynamicProperty: `/api/dynamic_properties/${element.id}`,
          value: `${data["dp_" + element.id]}`,
        };

        dynamicPropertyValues.push(pair);

        delete data["dp_" + element.id];
      });
    }

    // address
    for ([key, value] of Object.entries(data)) {
      if (key.includes("add_")) {
        key = key.replace("add_", "");
        address[key] = value;
        delete data["add_" + key];
      }
    }

    data = {
      ...data,
      dynamicPropertyValues: dynamicPropertyValues,
      address: address,
    };
    // send form data
    nextClient.post(URI_OFFER_CREATE, data).then((result) => {
      if (result && result.data && result.data.id) {
        router.push(`/owner/offer/detail/${result.data.id}`);
      }
    });
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Tabs
          defaultActiveKey="infos"
          id="offer-creation-form"
          className="mb-3 mt-3 ahNav"
        >
          <Tab eventKey="infos" title="Résumé">
            <Form.Group className="mb-3">
              <Form.Label>Type de l&apos;offre</Form.Label>
              <Form.Select
                {...register("offerType", {
                  onChange: onSelectOfferType,
                })}
                className={`${errors.offerType ? "is-invalid" : ""}`}
              >
                <option value="">Selectionner</option>
                {offerTypes.map((option, index) => {
                  return (
                    <option
                      key={index}
                      value={`${IRI_OFFER_TYPES}${option.id}`}
                    >
                      {option.name}
                    </option>
                  );
                })}
              </Form.Select>
              <div className="invalid-feedback">
                {errors.offerType?.message}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                {...register("title")}
                className={`${errors.title ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.title?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Décrire l&apos;offre en quelques mots</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                {...register("summary")}
                className={`${errors.summary ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.summary?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                {...register("description")}
                className={`${errors.description ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors.description?.message}
              </div>
            </Form.Group>
          </Tab>
          <Tab eventKey="properties" title="Caractéristique">
            <Form.Group className="mb-3">
              <Form.Label>Capacité</Form.Label>
              <Form.Control
                type="number"
                {...register("capacity")}
                className={`${errors.capacity ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.capacity?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre de lits</Form.Label>
              <Form.Control
                type="number"
                {...register("nbBeds")}
                className={`${errors.nbBeds ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.nbBeds?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix par nuit</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                {...register("unitPrice")}
                className={`${errors.unitPrice ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors.unitPrice?.message}
              </div>
            </Form.Group>

            {dynamicPropFormData &&
              buildDynamicPropFields(dynamicPropFormData, register)}
          </Tab>
          <Tab eventKey="equipments" title="Les equipements">
            {Array.isArray(equipments) &&
              equipments.length > 0 &&
              equipments[0].id && (
                <Form.Group className="mb-3">
                  <Form.Label>Equipements</Form.Label>
                  <Form.Select multiple {...register("equipments")}>
                    {equipments.map((equipment, index) => {
                      return (
                        <option key={index} value={equipment.id}>
                          {equipment.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <div className="invalid-feedback">
                    {errors.region?.message}
                  </div>
                </Form.Group>
              )}
          </Tab>
          <Tab eventKey="address" title="Adresse">
            <Form.Group className="mb-3">
              <Form.Label>Pays</Form.Label>
              <Form.Control disabled type="text" value="France" />
              <div className="invalid-feedback">{errors.address?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Region</Form.Label>
              <Form.Select onChange={onSelectRegion}>
                <option value="">Selectionner</option>
                {regions.map((region, index) => {
                  return (
                    <option key={index} value={region.id}>
                      {region.name}
                    </option>
                  );
                })}
              </Form.Select>
              <div className="invalid-feedback">{errors.region?.message}</div>
            </Form.Group>

            {citiesFormData && (
              <Form.Group className="mb-3">
                <Form.Label>Ville</Form.Label>
                <Form.Select {...register("add_city")}>
                  <option value="">Selectionner</option>
                  {citiesFormData.map((city, index) => {
                    return (
                      <option key={index} value={`/api/cities/${city.id}`}>
                        {city.name}
                      </option>
                    );
                  })}
                </Form.Select>
                <div className="invalid-feedback">
                  {errors.add_city?.message}
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                {...register("add_line1")}
                className={`${errors.add_line1 ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors.add_line1?.message}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Code postale</Form.Label>
              <Form.Control
                type="text"
                {...register("add_postalCode")}
                className={`${errors.add_postalCode ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">
                {errors.add_postalCode?.message}
              </div>
            </Form.Group>
            <div className="d-grid">
              <AhButton type="submit" className="btn-lg mb-5">
                Créer
              </AhButton>
            </div>
          </Tab>
        </Tabs>
      </Form>
    </>
  );
}

function getValidationSchema() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Le titre est obligatoire")
      .min(10, "Le titre doit contenir au moins 10 caractères")
      .max(50, "Le titre doit contenir au maximum 50 caractères")
      .matches(/^([A-zÀ-ÿ\s\-']+)$/, "Seule les caractères alphabétiques sont autorisés"),
    summary: Yup.string()
      .required("Le résumé est obligatoire")
      .min(40, "Le résumé doit contenir au moins 40 caractères")
      .max(500, "Le résumé doit contenir au maximum 500 caractères"),
    description: Yup.string()
      .required("La description est obligatoire")
      .min(80, "La description doit contenir au moins 80 caractères")
      .max(2500, "La description doit contenir au maximum 2500 caractères"),
    capacity: Yup.number()
      .typeError("Le nombre de visiteurs doit être >= 1 personnes")
      .min(1, "Le nombre de visiteurs doit être >= 1 personnes")
      .required("Le nombre de visiteurs est requis"),
    nbBeds: Yup.number()
      .typeError("Le nombre de lits doit être >= 1")
      .min(1, "Le nombre de lits doit être >= 1")
      .required("Le nombre de lits est requis"),
    unitPrice: Yup.number()
      .typeError("Le prix par nuit doit être >= 1")
      .min(1, "Le prix par nuit doit être >= 1")
      .required("Le prix par nuit est requis"),
    offerType: Yup.string().required(
      "La collection de l'offre est obligatoire"
    ),
    add_city: Yup.string().required("La ville est obligatoire"),
    add_line1: Yup.string()
      .required("L'adresse' de l'offre est obligatoire")
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(60, "L'adresse doit contenir au maximum 60 caractères")
      .matches(/^([A-zÀ-ÿ0-9\s\-']+)$/, "Format invalide"),
    add_postalCode: Yup.string()
      .required("Le code postale est obligatoire")
      .matches(/^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/, "Format invalide"),
  });
  return validationSchema;
}
