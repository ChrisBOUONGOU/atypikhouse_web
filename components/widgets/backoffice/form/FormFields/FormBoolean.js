import { Form } from "react-bootstrap";
import { useFormContext } from "react-hook-form";

export default function FormBoolean(props) {
  const { register } = useFormContext();

  return (
    <Form.Group className="mb-3">
      {props.label && (
        <Form.Label htmlFor={props.name}>{props.label}</Form.Label>
      )}

      <Form.Check type="switch" id={props.name} {...register(props.name)} />
    </Form.Group>
  );
}
