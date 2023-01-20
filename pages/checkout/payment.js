/* eslint-disable react/jsx-key */
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AhAdressForm from "../../components/billingAddress/AhAddressForm";
import CustomerLayout from "../../components/layout/CustomerLayout";
import AhCheckbox from "../../components/widgets/AhCheckbox";
import { getCurrentReservationForRecap } from "../../lib/back/BookingService";
import { sessionStorageService } from "../../lib/common/clientStorageService";
import styles from "../../styles/components/PaymentPage.module.css";

export default function PaymentPage(props) {
  const [billingAddress, setBillingAddress] = useState(null);
  const [edit, setEdit] = useState(false);
  const [cguAccepted, setCguAccepted] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    // this effect use setState and should be excuted once
    setBillingAddress(getBillingAddress());
  }, []);

  const getBillingAddress = () => {
    if (window) {
      return sessionStorageService.get("billingAddress");
    }
    return null;
  };

  const saveBillingAddress = (formData) => {
    sessionStorageService.set("billingAddress", formData);
    setBillingAddress(formData);
    setEdit(false);
    return true;
  };

  const currentReservation = JSON.parse(props.reservation);
  return (
    <CustomerLayout>
      <Container className={`${styles.mainContainer}`}>
        <h3>Page de paiement</h3>
        <Row className={`gx-1 gy-1`}>
          <Col lg={7} md={12}>
            <div className={`${styles.box}`}>
              <h4 className="mb-4">Adresse de Facturation</h4>
              {billingAddress && !edit ? (
                <div>
                  <div className={styles.recapBold}>
                    {billingAddress.firstName} {billingAddress.lastName}
                  </div>
                  <div>
                    {Array.of(
                      billingAddress.address,
                      billingAddress.city,
                      billingAddress.codePostal
                    ).join(", ")}
                  </div>
                  <div>{billingAddress.email}</div>
                  <div>{billingAddress.phone} </div>
                  <button
                    onClick={() => setEdit(!edit)}
                    type="button"
                    className="btn btn-dark mb-4 mt-2"
                  >
                    Éditer
                  </button>
                  <br />
                </div>
              ) : (
                <AhAdressForm
                  preFillData={edit ? billingAddress : {}}
                  onValidate={saveBillingAddress}
                />
              )}
            </div>
          </Col>
          <Col lg={5} md={12}>
            <div className={`${styles.box} ${styles.boxRecap}`}>
              {/* Order Summary */}
              <h4>Récapitulatif </h4>
              <Container className="mt-4 mb-4">
                <Row className="mt-2">
                  <Col>
                    <span className={styles.recapLabel}>Arrivée</span>
                    <span className={styles.recapBold}>
                      {currentReservation.fromDate}
                    </span>
                    <span className={styles.recapTime}>À partir de 16h00 </span>
                  </Col>
                  <Col>
                    <span className={styles.floatRight}>
                      <span className={styles.recapLabel}>Départ</span>
                      <span className={styles.recapBold}>
                        {currentReservation.toDate}
                      </span>
                      <span className={styles.recapTime}>
                        Jusqu&apos;à 11h00
                      </span>
                    </span>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <span>Durée totale du séjour :</span>
                  <span className={styles.recapBold}>
                    {currentReservation.TotalLengthOfStay} nuits
                  </span>
                </Row>
                <hr />

                <Row className="mt-2">
                  <Col>
                    <span>{currentReservation.amounts.unitPrice.label} :</span>
                  </Col>
                  <Col>
                    <span className={styles.floatRight}>
                      {currentReservation.amounts.unitPrice.value}
                      {currentReservation.currency}
                    </span>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col>
                    <span>{currentReservation.amounts.totalPrice.label} :</span>
                  </Col>
                  <Col>
                    <span className={styles.floatRight}>
                      {currentReservation.amounts.totalPrice.value}{" "}
                      {currentReservation.currency}
                    </span>
                  </Col>
                </Row>
                <hr />
                <Row className="mt-2">
                  <AhCheckbox
                    name="terms"
                    id="allterms"
                    value="allterms"
                    onChange={() => setCguAccepted(!cguAccepted)}
                  >
                    <div className={`${styles.cguCheckboxLabel}`}>
                      Je confirme avoir pris connaissance et accepter{" "}
                      <Link href="/legal-terms" className={`text-primary ${styles.termsLink}`}>
                       
                          les Conditions générales de vente{" "}
                      
                      </Link>
                      et{" "}
                      <Link href="/legal-terms" className={`text-primary ${styles.termsLink}`}>
                      
                          Conditions générales d&rsquo;utilisation.
                    
                      </Link>
                    </div>
                  </AhCheckbox>
                </Row>
              </Container>
              <Row className="mt-2">
                {billingAddress != null && cguAccepted ? (
                  <form
                    id="paypal-button-form"
                    className="d-flex justify-content-center"
                    action="/api/payment"
                    method="post"
                  >
                    <button
                      className={`w-50 d-flex justify-content-center ${styles.paypalButton}`}
                      type="submit"
                    >
                      <div className="paypal-image-container">
                        <Image
                          src="/images/paypal/PP_logo_h_150x38.png"
                          alt="PayPal"
                          width={98}
                          height={25}
                        />
                      </div>
                    </button>
                  </form>
                ) : (
                  <div className="d-flex justify-content-center">
                    <button
                      className={`w-50 d-flex justify-content-center ${styles.paypalButton} ${styles.disabled}`}
                    >
                      <div className="paypal-image-container">
                        <Image
                          src="/images/paypal/PP_logo_h_150x38.png"
                          alt="PayPal"
                          width={98}
                          height={25}
                        />
                      </div>
                    </button>
                  </div>
                )}
              </Row>
              <Row>
                <div
                  className={`d-flex justify-content-center ${styles.securePayement}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="12"
                    stroke="#989898"
                    fill="#989898"
                    className="bi bi-lock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                  </svg>
                  <span>Paiement 100% sécurisé</span>
                </div>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/", //redirect user to homepage
        permanent: false,
      },
    };
  }
  const currentUserReservation = await getCurrentReservationForRecap(session);
  if (!currentUserReservation) {
    return {
      redirect: {
        destination: "/", //redirect user to homepage
        permanent: false,
      },
    };
  }
  return {
    props: {
      reservation: JSON.stringify(currentUserReservation),
    },
  };
}
