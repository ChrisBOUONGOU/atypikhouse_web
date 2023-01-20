import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export default function AhAdressForm({ onValidate, preFillData }) {
    const validationSchema = getValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
  
    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;
  
    return (
      <form id="billing-address-form" onSubmit={handleSubmit(onValidate)}>
        <div className="form-row">
          <div className="form-group col-5">
            <label className="mt-2">Prénom</label>
            <input
              name="firstName"
              type="text"
              defaultValue={preFillData.firstName}
              {...register("firstName")}
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.firstName?.message}</div>
          </div>
          <div className="form-group col-5">
            <label className="mt-2">Nom</label>
            <input
              name="lastName"
              type="text"
              defaultValue={preFillData.lastName}
              {...register("lastName")}
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.lastName?.message}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col">
            <label>Email</label>
            <input
              name="email"
              type="text"
              defaultValue={preFillData.email}
              {...register("email")}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col">
            <label>Téléphone</label>
            <input
              name="phone"
              type="text"
              defaultValue={preFillData.phone}
              {...register("phone")}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.phone?.message}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col">
            <label>adresse</label>
            <input
              name="address"
              type="text"
              defaultValue={preFillData.address}
              {...register("address")}
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.address?.message}</div>
          </div>
          <div className=" form-group row">
            <div className="form-group col">
              <label>City</label>
              <input
                name="city"
                type="text"
                defaultValue={preFillData.city}
                {...register("city")}
                className={`form-control ${errors.city ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.city?.message}</div>
            </div>
            <div className="form-group col">
              <label>Code postal</label>
              <input
                name="codePostal"
                type="text"
                defaultValue={preFillData.codePostal}
                {...register("codePostal")}
                className={`form-control ${
                  errors.codePostal ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">{errors.codePostal?.message}</div>
            </div>
          </div>
        </div>
        <div className="form-group mt-4 ">
          <button type="submit" className="btn btn-primary ">
            Valider
          </button>
        </div>
      </form>
    );
  }
  
  function getValidationSchema() {
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    // form validation rules
    const validationSchema = Yup.object().shape({
      firstName: Yup.string().required("Le prénom est obligatoire"),
      lastName: Yup.string().required("Le nom est obligatoire"),
      email: Yup.string()
        .required("L'adresse email est invalide")
        .email("Email invalide"),
      phone: Yup.string().matches(
        phoneRegExp,
        "Le numéro du téléphone n'est valide"
      ),
      address: Yup.string().required("L'adresse est obligatoire"),
      city: Yup.string()
        .min(2, "La ville doit être > 2 caractères")
        .required("La ville est obligatoire"),
      codePostal: Yup.string()
        .min(3, "Le code poastal doit être > 3 caractères")
        .required("Le code postal est obligatoire"),
    });
    return validationSchema;
  }
  