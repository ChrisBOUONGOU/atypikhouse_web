import { Form } from "react-bootstrap";
import { useFormContext } from "react-hook-form";

export default function FormSelectMultiple(props) {
  const { register } = useFormContext();

  return (
    <Form.Group className="mb-3">
      {props.label && (
        <Form.Label htmlFor={props.name}>{props.label}</Form.Label>
      )}

      <Form.Select id={props.name} {...register(props.name)} multiple>
        {props.selectOptions &&
          props.selectOptions.map((option, index) => {
            return (
              <option key={index} value={option.value}>
                {option.displayValue}
              </option>
            );
          })}
      </Form.Select>
    </Form.Group>
  );
}
