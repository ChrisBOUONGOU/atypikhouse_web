import { Container, Row } from "react-bootstrap";
import CustomerLayout from "../../components/layout/CustomerLayout";
import legalTerms from "./legalTerms.json";

export default function cguTermsPage(props) {
  const legalTermsArray = [legalTerms.cgu, legalTerms.cgv];
  return (
    <CustomerLayout>
      <Container className="mt-4 mb-4 ">
        <h2 className="mb-4">Politique de confidentialité</h2>
        {legalTermsArray.map((term, index) => {
          return (
            <>
              <Row key={index}>
                <h4>{term.title}</h4>
                {term.values.map((value, index) => {
                  return (
                    <div key={index}>
                      <h5>{value.title}</h5>
                      {value.content.map((paragraph, index) => {
                        return <p key={index}>{paragraph}</p>;
                      })}
                    </div>
                  );
                })}
              </Row>
            </>
          );
        })}
      </Container>
    </CustomerLayout>
  );
}
