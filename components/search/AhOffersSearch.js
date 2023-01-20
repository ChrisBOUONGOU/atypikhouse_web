import { useState } from "react";
import { Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AhButton from "../widgets/AhButton";

import styles from "../../styles/components/AhOffersSearch.module.css";
import Calendar from "react-calendar";
import moment from "moment";
import { useRouter } from "next/router";
import { URL_SEARCH_PAGE } from "../../lib/front/web/constants";

export default function AhOffersSearch(props) {
  const router = useRouter();

  const validationSchema = getValidationSchema();
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors } = formState;

  const minSearchDate = moment(new Date()).add(1, "days").toDate();
  const maxSearchDate = moment(new Date()).add(18, "months").toDate();

  const [showSearchCalendar, setShowSearchCalendar] = useState(false);

  let onSearchDateChange = (values) => {
    const startDate = moment(values[0]).format("YYYY-MM-DD");
    const endDate = moment(values[1]).format("YYYY-MM-DD");

    setValue("checkIn", startDate);
    setValue("checkOut", endDate);

    hideSearchCalendar();
  };

  let displaySearchCalendar = () => {
    setShowSearchCalendar(true);
  };

  let hideSearchCalendar = () => {
    setShowSearchCalendar(false);
  };

  async function onSubmit(data) {
    const checkInDate = data.checkIn
      ? moment(data.checkIn).format("YYYY-MM-DD")
      : "";
    const checkOutDate = data.checkOut
      ? moment(data.checkOut).format("YYYY-MM-DD")
      : "";

    let parsedData = {
      ...data,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    };

    router.push({ pathname: URL_SEARCH_PAGE, query: parsedData });
    return false;
  }

  return (
    <Container>
      <div className={`rounded-3 py-4 ${styles.bgWhite}`}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="justify-content-center">
            <Col xl={3}>
              <InputGroup size="lg" className="mb-4">
                <InputGroup.Text
                  className={`${styles.iconColor} ${styles.inputIcon}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-geo-alt-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Destination"
                  name="location"
                  {...register("location")}
                  className={`${
                    errors.location
                      ? `is-invalid ${styles.formControl}`
                      : `${styles.formControl}`
                  }`}
                />
              </InputGroup>
            </Col>

            <Col xl={4}>
              <Row>
                <Col sm={6}>
                  <InputGroup size="lg" className="mb-4">
                    <InputGroup.Text
                      className={`${styles.iconColor} ${styles.inputIcon}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-calendar3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      </svg>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Arrivée"
                      name="checkIn"
                      {...register("checkIn")}
                      className={`${
                        errors.checkIn
                          ? `is-invalid ${styles.formControl}`
                          : `${styles.formControl}`
                      }`}
                      onFocus={displaySearchCalendar}
                    />
                  </InputGroup>
                </Col>

                <Col sm={6}>
                  <InputGroup size="lg" className="mb-4 mb-xl-0">
                    <InputGroup.Text
                      className={`${styles.iconColor} ${styles.inputIcon}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-calendar3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      </svg>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Départ"
                      name="checkOut"
                      {...register("checkOut")}
                      className={`${
                        errors.checkOut
                          ? `is-invalid ${styles.formControl}`
                          : `${styles.formControl}`
                      }`}
                      onFocus={displaySearchCalendar}
                    />
                  </InputGroup>
                </Col>

                <Col sm={6}>
                  {showSearchCalendar ? (
                    <Calendar
                      //tileDisabled={dayInCalendarDisabled}
                      onChange={onSearchDateChange}
                      selectRange={true}
                      minDate={minSearchDate}
                      maxDate={maxSearchDate}
                      className={styles.searchCalendar}
                    />
                  ) : null}
                  <InputGroup size="lg" className="mb-4 mb-xl-0">
                    <InputGroup.Text
                      className={`${styles.iconColor} ${styles.inputIcon}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-currency-euro"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936c0-.11 0-.219.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.617 6.617 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z" />
                      </svg>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="prix min"
                      name="priceMin"
                      {...register("priceMin")}
                      className={`${
                        errors.priceMin
                          ? `is-invalid ${styles.formControl}`
                          : `${styles.formControl}`
                      }`}
                    />
                  </InputGroup>
                </Col>

                <Col sm={6}>
                  <InputGroup size="lg" className="mb-4 mb-xl-0">
                    <InputGroup.Text
                      className={`${styles.iconColor} ${styles.inputIcon}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-currency-euro"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936c0-.11 0-.219.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.617 6.617 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z" />
                      </svg>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="prix max"
                      name="priceMax"
                      {...register("priceMax")}
                      className={`${
                        errors.priceMax
                          ? `is-invalid ${styles.formControl}`
                          : `${styles.formControl}`
                      }`}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Col>

            <Col xl={3}>
              <InputGroup size="lg" className="mb-5 mb-xl-0">
                <InputGroup.Text
                  className={`${styles.iconColor} ${styles.inputIcon}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Nb de visiteurs"
                  name="guests"
                  {...register("guests")}
                  className={`${
                    errors.guests
                      ? `is-invalid ${styles.formControl}`
                      : `${styles.formControl}`
                  }`}
                />
              </InputGroup>
            </Col>

            <Col xl={1}>
              <AhButton
                type="submit"
                className={`${styles.iconColor} d-none d-xl-block`}
                variant="light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </AhButton>
              <AhButton
                type="submit"
                className={`search-btn btn-lg d-xl-none w-100`}
                variant="light"
              >
                <Row>
                  <Col xs={2}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </Col>
                  <Col xs={8}>
                    <span className="text-center">Rechercher</span>
                  </Col>
                </Row>
              </AhButton>
            </Col>
          </Row>
        </Form>
        {formState.isValid ? (
          <></>
        ) : (
          <Row className="fs-6 justify-content-center mt-2">
            <Col lg={11} className="bg-white">
              {errors.location ? (
                <div className="text-muted">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill text-danger"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </span>{" "}
                  {errors.location?.message}
                </div>
              ) : null}
              {errors.checkIn ? (
                <div className="text-muted">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill text-danger"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </span>{" "}
                  {errors.checkIn?.message}
                </div>
              ) : null}
              {errors.checkOut ? (
                <div className="text-muted">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill text-danger"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </span>{" "}
                  {errors.checkOut?.message}
                </div>
              ) : null}
              {errors.priceMin ? (
                <div className="text-muted">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill text-danger"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </span>{" "}
                  {errors.priceMin?.message}
                </div>
              ) : null}
              {errors.priceMax ? (
                <div className="text-muted">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill text-danger"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </span>{" "}
                  {errors.priceMax?.message}
                </div>
              ) : null}
              {errors.guests ? (
                <div className="text-muted">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill text-danger"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </span>{" "}
                  {errors.guests?.message}
                </div>
              ) : null}
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
}

function getValidationSchema() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    location: Yup.string().required(
      "Entrer une destination pour commencer la recherche"
    ),
    checkIn: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Entrer une date d'arrivée valide"),
    checkOut: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Entrer une date de départ valide"),
    priceMin: Yup.number()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Entrer un prix minimum valide"),
    priceMax: Yup.number()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Entrer un prix maximum valide"),
    guests: Yup.number()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Entrer un nombre valide de visiteurs"),
  });
  return validationSchema;
}
