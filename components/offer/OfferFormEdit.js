import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Col,
  Form,
  ListGroup,
  Modal,
  Nav,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import * as Yup from "yup";
import AhButton from "../widgets/AhButton";
import nextClient from "../../lib/front/api/nextClient";
import { URI_OFFER_UPDATE } from "../../lib/front/api/constants";
import {
  buildDynamicPropFields,
  deleteHighlight,
  deleteMedia,
  getCitiesByRegion,
  getOfferById,
} from "../../lib/front/offer/OfferCreate";
import { getIdFromIRI } from "../../lib/common/Util";
import OfferFormMediaUpload from "./OfferFormMediaUpload";

export default function OfferFormEdit({
  offerType,
  regions,
  equipments,
  offerData,
  offerAddress,
  offerEquipments,
  citiesOfOfferRegion,
  offerDynamicPropertyValues,
  offerTypeDynamicProperties,
}) {
  const validationSchema = getValidationSchema();
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors } = formState;

  const [citiesFormData, setCitiesFormData] = useState(null);
  const [offerDetail, setOfferDetail] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    // Resume
    setValue("offerType", offerDetail.offerType);
    setValue("title", offerDetail.title);
    setValue("summary", offerDetail.summary);
    setValue("description", offerDetail.description);

    // Caracteristics
    setValue("capacity", offerDetail.capacity);
    setValue("nbBeds", offerDetail.nbBeds);
    setValue("unitPrice", offerDetail.unitPrice);

    // Caracteristics -- Dynamic Props
    if (offerDynamicPropertyValues) {
      offerDynamicPropertyValues.forEach((dpv) => {
        setValue("dp_" + getIdFromIRI(dpv.dynamicProperty), dpv.value);
      });
    }

    // Equipments
    setValue(
      "equipments",
      offerEquipments.map((eq) => "" + eq.id)
    );

    // Address
    setValue("add_city", "/api/cities/" + offerAddress.city.id);
    setValue("add_line1", offerAddress.line1);
    setValue("add_postalCode", offerAddress.postalCode);
  }, []);

  if (!offerDetail && offerData) {
    setOfferDetail(offerData);
    return;
  }

  // Prefill Cities options by Cities of offerDetail Region
  if (!citiesFormData && citiesOfOfferRegion) {
    setCitiesFormData(citiesOfOfferRegion);
  }

  let reloadOfferState = async () => {
    const updatedOfferDetail = await getOfferById(offerDetail.id);
    if (updatedOfferDetail) {
      setOfferDetail(updatedOfferDetail);
    }
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

  async function onSubmit(formData) {
    let dynamicPropertyValues = [];
    let address = {};

    // dynamic properties
    if (offerTypeDynamicProperties) {
      offerTypeDynamicProperties.forEach((element) => {
        // Update existing DPV with its id
        const dpv = offerDynamicPropertyValues.find(
          (dpv) =>
            dpv.dynamicProperty == `/api/dynamic_properties/${element.id}`
        );
        if (dpv && dpv.id) {
          let pair = {
            //dynamicProperty: `/api/dynamic_properties/${element.id}`,
            value: `${formData["dp_" + element.id]}`,
            id: `/api/dynamic_property_values/${dpv.id}`,
          };

          dynamicPropertyValues.push(pair);
        } else {
          // DynamicPropValue never saved before
          // ==> DynamicProp created after offerDetail creation
          // save new entry for DynamicPropValue
          let pair = {
            dynamicProperty: `/api/dynamic_properties/${element.id}`,
            value: `${formData["dp_" + element.id]}`,
          };

          dynamicPropertyValues.push(pair);
        }

        delete formData["dp_" + element.id];
      });
    }

    // address
    for ([key, value] of Object.entries(formData)) {
      if (key.startsWith("add_")) {
        key = key.replace("add_", "");
        address[key] = value;
        delete formData["add_" + key];
      }
    }
    address.id = "/api/addresses/" + offerDetail.address.id;

    // Highlights
    const highlights = offerDetail.highlights
      ? offerDetail.highlights.map((entry) => {
          entry.id = `/api/highlights/${entry.id}`;
          return entry;
        })
      : [];

    if (formData && formData.highlight) {
      const highlightEntry = {
        content: formData.highlight,
      };
      highlights.push(highlightEntry);
      delete formData.highlight;
    }

    formData = {
      ...formData,
      dynamicPropertyValues: dynamicPropertyValues,
      address: address,
      id: offerDetail.id,
      highlights: highlights,
    };

    // send form data
    const result = await nextClient.post(URI_OFFER_UPDATE, formData);
    if (result && result.data && result.data.id) {
      setShowSuccessModal(true);
      await reloadOfferState();
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Tab.Container id="offer-creation-form" defaultActiveKey="infos">
          <Row>
            <Col md={3} className="mt-3">
              <Nav className="flex-column ahNav">
                <Nav.Item>
                  <Nav.Link eventKey="infos">Résumé</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="properties">Caractéristiques</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="equipments">Equipements</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="address">Adresse</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="photos">Photos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="highlights">Points forts</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col md={9} className="mt-xs-3 mt-3 mb-5">
              <Tab.Content>
                <Tab.Pane eventKey="infos">
                  <Form.Group className="mb-3">
                    <Form.Label>Type de l&apos;offre</Form.Label>
                    <Form.Select
                      disabled
                      {...register("offerType")}
                      className={`${errors.offerType ? "is-invalid" : ""}`}
                    >
                      <option value={offerDetail.offerType}>
                        {offerType.name}
                      </option>
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
                    <div className="invalid-feedback">
                      {errors.title?.message}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Décrire l&apos;offre en quelques mots
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      {...register("summary")}
                      className={`${errors.summary ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors.summary?.message}
                    </div>
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
                  <div className="d-grid">
                    <AhButton type="submit" className="btn-lg mb-5">
                      Sauvegarder
                    </AhButton>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="properties">
                  <Form.Group className="mb-3">
                    <Form.Label>Capacité</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      {...register("capacity")}
                      className={`${errors.capacity ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors.capacity?.message}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nombre de lits</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      {...register("nbBeds")}
                      className={`${errors.nbBeds ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors.nbBeds?.message}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Prix par nuit</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="1"
                      {...register("unitPrice")}
                      className={`${errors.unitPrice ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors.unitPrice?.message}
                    </div>
                  </Form.Group>

                  {offerTypeDynamicProperties &&
                    buildDynamicPropFields(
                      offerTypeDynamicProperties,
                      register
                    )}
                  <div className="d-grid">
                    <AhButton type="submit" className="btn-lg mb-5">
                      Sauvegarder
                    </AhButton>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="equipments">
                  {" "}
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
                  <div className="d-grid">
                    <AhButton type="submit" className="btn-lg mb-5">
                      Sauvegarder
                    </AhButton>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="address">
                  <Form.Group className="mb-3">
                    <Form.Label>Pays</Form.Label>
                    <Form.Control disabled type="text" value="France" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Region</Form.Label>
                    <Form.Select
                      onChange={onSelectRegion}
                      defaultValue={offerAddress.city.region.id}
                    >
                      {regions.map((region, index) => {
                        return (
                          <option key={index} value={region.id}>
                            {region.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <div className="invalid-feedback">
                      {errors.region?.message}
                    </div>
                  </Form.Group>

                  {citiesFormData && (
                    <Form.Group className="mb-3">
                      <Form.Label>Ville</Form.Label>
                      <Form.Select {...register("add_city")}>
                        {citiesFormData.map((city, index) => {
                          return (
                            <option
                              key={index}
                              value={`/api/cities/${city.id}`}
                            >
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
                      Sauvegarder
                    </AhButton>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="photos">
                  <Row>
                    {offerDetail.media &&
                      offerDetail.media.map((offerMedia, index) => {
                        return (
                          <Col key={index} md={4} className="mb-4 text-center">
                            <div
                              className="position-relative img-thumbnail w-50 d-inline-block"
                              style={{ height: 150 }}
                            >
                              <Image
                                src={offerMedia.url}
                                alt={`photo de ${offerDetail.title}`}
                                layout="fill"
                                objectFit="cover"
                              ></Image>
                            </div>
                            <div>
                              <AhButton
                                onClick={async () => {
                                  const deleted = await deleteMedia(
                                    offerMedia.id
                                  );
                                  if (deleted) await reloadOfferState();
                                }}
                                variant="secondary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-trash-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                </svg>
                              </AhButton>
                            </div>
                          </Col>
                        );
                      })}
                  </Row>
                  <div className="d-grid">
                    <AhButton
                      className="btn-lg mb-5"
                      onClick={() => setShowUploadModal(true)}
                    >
                      Upload
                    </AhButton>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="highlights">
                  <ListGroup variant="info" className="mb-5 mt-4">
                    {offerDetail.highlights &&
                      offerDetail.highlights.map((offerHighlight, index) => {
                        return (
                          <ListGroup.Item key={index}>
                            <AhButton
                              onClick={async () => {
                                const deleted = await deleteHighlight(
                                  offerHighlight.id
                                );
                                if (deleted) await reloadOfferState();
                              }}
                              variant="secondary"
                              className="me-4 btn-sm"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                              </svg>
                            </AhButton>
                            {offerHighlight.content}
                          </ListGroup.Item>
                        );
                      })}
                  </ListGroup>

                  <Form.Group className="mb-3">
                    <Form.Label>Contenu</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("highlight")}
                      className={`${errors.highlight ? "is-invalid" : ""}`}
                    />
                    <div className="invalid-feedback">
                      {errors.highlight?.message}
                    </div>
                  </Form.Group>
                  <div className="d-grid">
                    <AhButton type="submit" className="btn-lg mb-5">
                      Sauvegarder
                    </AhButton>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Form>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Changement sauvegardé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-success">
            Vos changements sont bien pris en compte.
          </p>
        </Modal.Body>
      </Modal>

      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Photos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OfferFormMediaUpload
            offer={offerDetail}
            reloadOfferState={reloadOfferState}
            setShowUploadModal={setShowUploadModal}
          ></OfferFormMediaUpload>
        </Modal.Body>
      </Modal>
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
      .matches(
        /^([A-zÀ-ÿ\s\-']+)$/,
        "Seule les caractères alphabétiques sont autorisés"
      ),
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
    highlight: Yup.string()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .nullable()
      .min(10, "La description doit contenir au moins 10 caractères")
      .max(100, "La description doit contenir au maximum 100 caractères"),
  });
  return validationSchema;
}
