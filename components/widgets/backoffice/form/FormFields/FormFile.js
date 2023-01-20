import { Form } from "react-bootstrap";
import { useFormContext } from "react-hook-form";

export default function FormFile(props) {
  const { register } = useFormContext();

  return (
    <Form.Group className="mb-3">
      {props.label && (
        <Form.Label htmlFor={props.name}>{props.label}</Form.Label>
      )}

      <Form.Control type="file" id={props.name} {...register(props.name)} />
    </Form.Group>
  );
}
