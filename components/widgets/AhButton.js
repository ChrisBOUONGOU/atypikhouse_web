/* eslint-disable react/jsx-key */
import { Button } from "react-bootstrap";

export default function AhButton({
  children,
  variant,
  className,
  type,
  onClick,
}) {
  let style = "dark";
  switch (variant) {
    case "primary":
      break;
    case "secondary":
      style = "outline-dark";
      break;
    case "light":
      style = "outline-light";
      break;
    case "danger":
      style = "danger";
      break;
    default:
      break;
  }
  return (
    <Button className={className} variant={style} type={type} onClick={onClick}>
      {children}
    </Button>
  );
}
