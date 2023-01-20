import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "react-bootstrap";
import * as Yup from "yup";
import { URI_CUSTOMERS, URI_OWNERS } from "../../lib/front/api/constants";
import AhButton from "../widgets/AhButton";
import nextClient from "../../lib/front/api/nextClient";
import AhSigninButton from "../navigation/AhSigninButton";

export default function RegisterForm({ isOwner }) {
  const validationSchema = getValidationSchema();
  const formOptions = { resolver: yupResolver(validationSchema) };

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState, setError } =
    useForm(formOptions);
  const { errors } = formState;
  const postURL = isOwner ? URI_OWNERS : URI_CUSTOMERS;

  async function onSubmit(data) {
    // send form data
    const result = await nextClient.post(postURL, data);

    if (result && result.data && result.data.id) {
      setDisplayError(false);
      setDisplaySuccess(true);
      return;
    }

    setDisplaySuccess(false);

    if (result && result.error && result.error.email) {
      setError("email", { type: "custom", message: result.error.email });
      return;
    }

    setDisplayError(true);
  }

  return (
    <>
      <Form
        id="register-from"
        onSubmit={handleSubmit(onSubmit)}
        className={displaySuccess ? "d-none" : "d-block"}
      >
        <Form.Group className="mb-3">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            {...register("firstName")}
            className={`${errors.firstName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            {...register("lastName")}
            className={`${errors.lastName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            {...register("email")}
            className={`${errors.email ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            name="password"
            {...register("password")}
            className={`${errors.password ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirmation de mot de passe</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            {...register("confirmPassword")}
            className={`${errors.confirmPassword ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">
            {errors.confirmPassword?.message}
          </div>
        </Form.Group>

        <div className={displayError ? "d-block" : "d-none"}>
          <p className="text-center mt-3 text-danger">
            Une erreur est survenue, veuillez revérifier vos informations ou
            ressayer plus tard.
          </p>
        </div>

        <div className="d-grid">
          <AhButton type="submit" className="btn-lg">
            S&apos;inscrire
          </AhButton>
          {/*<button
              type="button"
              onClick={() => reset()}
              className="btn btn-secondary"
            >
              Reinitialiser
            </button>*/}
        </div>
      </Form>
      <div className={displaySuccess ? "d-block" : "d-none"}>
        <p id="signUpSuccessMessage" className="text-center mt-5 text-success">
          Félicitations votre compte a été créé!
        </p>
        <div className="d-flex justify-content-center">
          <AhSigninButton btnClassName="btn-md btn btn-dark w-50 text-white" />
        </div>
      </div>
    </>
  );
}

function getValidationSchema() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Le prénom est obligatoire")
      .matches(/^([A-zÀ-ÿ\s\-']+)$/, "Format invalide")
      .min(3, "Le prénom doit contenir au moins 3 caractères")
      .max(100, "Le prénom ne peut pas dépasser 100 caractères"),
    lastName: Yup.string()
      .required("Le nom est obligatoire")
      .matches(/^([A-zÀ-ÿ\s\-']+)$/, "Format invalide")
      .min(3, "Le nom doit contenir au moins 3 caractères")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    email: Yup.string()
      .required("L'adresse email est invalide")
      .email("Email invalide"),
    password: Yup.string()
      .min(6, "Le mot de passe doit être >= 6 caractères")
      .required("Le mot de passe est requis"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "La confirmation de mot de passe est incorrecte"
      )
      .required("La confirmation du mot de passe est obligatoire"),
  });
  return validationSchema;
}
