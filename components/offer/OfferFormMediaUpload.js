import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "react-bootstrap";
import * as Yup from "yup";
import AhButton from "../widgets/AhButton";
import nextClient from "../../lib/front/api/nextClient";
import { URI_OFFER_MEDIA_UPLOAD } from "../../lib/front/api/constants";
import { useState } from "react";

export default function OfferFormMediaUpload({
  offer,
  reloadOfferState,
  setShowUploadModal,
}) {
  const validationSchema = getValidationSchema();
  const formOptions = {
    resolver: yupResolver(validationSchema),
    shouldUnregister: true,
  };

  const [showUploadError, setShowUploadError] = useState(false);

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  let photosCount = 0;
  if (offer && offer.media && offer.media.length > 0) {
    photosCount = offer.media.length;
  }

  let onSubmit = async (data) => {
    setShowUploadError(false);
    const { formData, fileCount } = buildFormData(data);
    formData.append("offerId", offer.id);
    if (!fileCount) {
      console.log("no file to upload");
      return;
    }
    const result = await nextClient.postFile(URI_OFFER_MEDIA_UPLOAD, formData);
    if (result && Array.isArray(result.data)) {
      await reloadOfferState();
      setShowUploadModal(false);
    }
    if (result && result.error) {
      setShowUploadError(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-3">
        Vous avez droit à 9 photos au total.
        <br />
        La taille d&apos;une image ne doit pas dépasser 4mb.
      </p>
      {photosCount < 9 && (
        <Form.Group className="mb-3">
          <Form.Label>Photo 1</Form.Label>
          <Form.Control type="file" {...register("photo_1")} />
        </Form.Group>
      )}
      {photosCount < 8 && (
        <Form.Group className="mb-3">
          <Form.Label>Photo 2</Form.Label>
          <Form.Control type="file" {...register("photo_2")} />
        </Form.Group>
      )}
      {photosCount < 7 && (
        <Form.Group className="mb-3">
          <Form.Label>Photo 3</Form.Label>
          <Form.Control type="file" {...register("photo_3")} />
        </Form.Group>
      )}
      {showUploadError && (
        <p className="text-danger">
          Une erreur est survenue lors de l&apos;upload de vos images, pensez à
          vérifier la taille et le type des fichiers.
        </p>
      )}
      {photosCount < 9 && (
        <div className="d-grid">
          <AhButton type="submit" className="btn-lg mb-5">
            Upload
          </AhButton>
        </div>
      )}
    </Form>
  );
}

function getValidationSchema() {
  // form validation rules
  const validationSchema = Yup.object().shape({});
  return validationSchema;
}

function buildFormData(values) {
  const formData = new FormData();
  let fileCount = 0;
  for (const key in values) {
    if (values[key] && values[key].length) {
      formData.append(key, values[key][0]);
      fileCount++;
    }
  }

  return { formData: formData, fileCount: fileCount };
}
