/* eslint-disable react/jsx-key */

import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

export default function SocialMedia({ className, socialMedias }) {
  if (!socialMedias) {
    return <></>;
  }

  return (
    <Container>
      <Row xs="auto" className="justify-content-center fs-3 mb-3">
        <Col>Retrouvez nous sur les réseaux sociaux</Col>
      </Row>
      <Row className={`${className} justify-content-center mb-5`}>
        {socialMedias.map((socialMedia, index) => {
          return (
            <Col xs="auto">
              <Link href={socialMedia.url}>
                <Image
                  src={socialMedia.imageUrl}
                  alt={socialMedia.name}
                  width={30}
                  height={30}
                ></Image>
              </Link>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
