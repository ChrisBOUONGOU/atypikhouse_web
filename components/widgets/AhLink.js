/* eslint-disable react/jsx-key */
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function AhLink({ href, children, variant, className }) {
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
    <Link href={href}>
      <Button variant={style} className={className}>
        {children}
      </Button>
    </Link>
  );
}
