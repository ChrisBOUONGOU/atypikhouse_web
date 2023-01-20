/* eslint-disable react/jsx-key */
import Moment from "moment";
import { extendMoment } from "moment-range";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import CustomerLayout from "../../components/layout/CustomerLayout";
import AhMap from "../../components/map/AhMap";
import OfferAddressSummary from "../../components/offer/OfferAddressSummary";
import OfferHighlights from "../../components/offer/OfferHighlights";
import AhButton from "../../components/widgets/AhButton";
import AhCaroussel from "../../components/widgets/AhCaroussel";
import AhModal from "../../components/widgets/AhModal";
import AhPagination from "../../components/widgets/AhPagination";
import { getAddressById } from "../../lib/back/AddressService";
import { COOGLE_MAPS_API_KEY } from "../../lib/back/api/constants";
import {
  bookRangeForOffer,
  getBookedDatesForOffer,
  getCurrentUserReservationForOffer
} from "../../lib/back/BookingService";
import { getCategoryForOffer } from "../../lib/back/CategoryService";
import {
  getCurrentUserCommentForOffer,
  getOfferCommentsByOfferId
} from "../../lib/back/OfferCommentService";
import { getOfferById } from "../../lib/back/OfferService";
import {
  compareDates,
  getDaysBetween,
  parseDate
} from "../../lib/common/DateService";
import nextClient from "../../lib/front/api/nextClient";
import styles from "../../styles/components/OfferPage.module.css";

const moment = extendMoment(Moment);

export default function OfferPage(props) {
  const router = useRouter();

  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(true);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [showRangeCalendar, setShowRangeCalendar] = useState(false);
  let [from, to] = JSON.parse(props.defaultDateRange);
  // Real selected start & end Date
  const [startDate, setStartDate] = useState(new Date(from));
  const [endDate, setEndDate] = useState(new Date(to));

  const [dateRange, setDateRange] = useState([startDate, endDate]);
  const [minStartDate, setMinStartDate] = useState(new Date(from));
  const [minEndDate, setMinEndDate] = useState(new Date(to));
  const [maxEndDate, setMaxEndDate] = useState(null);

  const [totalPrice, setTotalPrice] = useState();
  const [comment, setComment] = useState("");
  const [canComment, setCanComment] = useState(true);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const { status } = useSession();

  const bookOffer = async () => {
    await bookRangeForOffer(dateRange, props.offer);
    router.push("/checkout/payment");
  };

  const resetCalendar = () => {
    setMaxEndDate(null);
    setDateRange([new Date(from), new Date(to)]);
    setShowStartDateCalendar(true);
    setShowEndDateCalendar(false);
    setShowRangeCalendar(false);
  };

  const onClickDayOnRange = (date) => {
    resetCalendar();
    onSelectStartDate(date);
  };

  const findMaxEndDate = (fromDate) => {
    if (
      fromDate &&
      Array.isArray(rangeBookedDates) &&
      rangeBookedDates.length
    ) {
      let stopDate = null;
      let checkDate = moment(fromDate);
      let maxChecks = 90;
      do {
        maxChecks--;
        checkDate = checkDate.add(1, "days");
        stopDate = rangeBookedDates
          .map((momentRange) => momentRange.start)
          .find((sDate) => sDate.isAfter(checkDate));
      } while (!stopDate && maxChecks > 0);
      return stopDate ? stopDate.add(1, "days").toDate() : null;
    }
    return null;
  };

  const onSelectStartDate = (date) => {
    // setEndDate to next availble date
    setMaxEndDate(findMaxEndDate(date));
    setMinEndDate(moment(date).add(1, "days").toDate());
    setEndDate(moment(date).add(1, "days").toDate());
    setShowStartDateCalendar(false);
    setShowEndDateCalendar(true);
    setStartDate(date);
  };

  const onSelectEndDate = (selectedDate) => {
    const m = moment(selectedDate);
    m.set({ hour: 11, minute: 0, second: 0, millisecond: 0 });
    let date = m.toDate();
    setShowStartDateCalendar(false);
    setShowEndDateCalendar(false);
    setShowRangeCalendar(true);
    setEndDate(date);
    setDateRange([startDate, date]);
    setTotalPrice(calcTotalPrice(props.offer, startDate, date));
  };

  const calcTotalPrice = (offer, start, end) => {
    const nightsBetween = getDaysBetween(start, end);
    if (nightsBetween > 0) {
      return nightsBetween * offer.unitPrice;
    }
    return null;
  };

  const rangeBookedDates = (() => {
    // convert array of reservations to array of ranges
    let ranges = [];
    if (Array.isArray(props.bookedDates) && props.bookedDates.length) {
      props.bookedDates.forEach((reservation) => {
        const start = moment(reservation.startDate, "YYYY-MM-DD");
        const end = moment(reservation.endDate, "YYYY-MM-DD");
        const range = moment.range(start, end);
        ranges.push(range);
      });
    }
    return ranges;
  })();

  const isDateUnavailable = (currentDate, exclusionParams) => {
    if (Array.isArray(rangeBookedDates) && rangeBookedDates.length) {
      return rangeBookedDates.some((range) => {
        return range.contains(currentDate, exclusionParams);
      });
    }
    return false;
  };

  const isStartDateUnavailable = ({ activeStartDate, date, view }) => {
    return isDateUnavailable(date, { excludeEnd: true });
  };

  const isEndDateUnavailable = ({ activeStartDate, date, view }) => {
    return isDateUnavailable(date, { excludeStart: true });
  };

  const isRangeDateUnavailable = ({ activeStartDate, date, view }) => {
    const selectedRange = moment.range(startDate, endDate);
    if (selectedRange.contains(date)) return false;
    return isDateUnavailable(date, { excludeStart: true });
  };

  function preSelectedtileClassName({ date, view }) {
    // Add class to tiles in month view only
    if (view === "month" && moment(date).isSame(startDate)) {
      return "react-calendar__tile--selected";
    }
  }

  const onSubmitComment = async () => {
    if (canComment) {
      try {
        await nextClient.post("/api/comments/add", {
          offerId: props.offer.id,
          content: comment,
        });
        setCanComment(false);
        setShowCommentPopup(true);
      } catch (error) {
        setCanComment(true);
      }
    }
  };

  const onTextAreChange = (event) => {
    setComment(event.target.value);
  };

  const handleCloseCommentPopup = () => setShowCommentPopup(false);

  return (
    <CustomerLayout>
      <Head>
        <title>{props.offer.title} - AtypikHouse</title>
        <meta
          property="og:title"
          content={`${props.offer.title} - AtypikHouse`}
          key="title"
        />
      </Head>
      <div
        onClick={() => {
          setShowGalleryModal(true);
        }}
        className={`mb-5 ${styles.header} d-flex flex-column-reverse`}
        style={{
          backgroundImage: `url(${props.defaultImage})`,
        }}
      >
        <AhButton
          className={`bg-transparent ${styles.galleryButton}`}
          variant="light"
        >
          Gallerie
        </AhButton>
      </div>
      <AhModal toggleDisplay={setShowGalleryModal} show={showGalleryModal}>
        <AhCaroussel images={props.offer.media} />
      </AhModal>

      <Container>
        <Row className="mb-3">
          <Col lg={6} md={6}>
            <h3 className="mb-4">{props.offer.title}</h3>
            <span>
              <OfferAddressSummary address={props.address} />
            </span>
            <Row className="mt-3 mb-3">
              <p>{props.offer.summary}</p>
            </Row>

            <Row className="mt-3 mb-3">
              <h4 className="mb-4">Les points forts</h4>
              <div>
                <OfferHighlights highlights={props.offer.highlights} />
              </div>
            </Row>
            <Row className="mt-3 mb-3">
              <h4 className="mb-4">Plus de détails</h4>
              <p> {props.offer.description}</p>
            </Row>
          </Col>
          <Col lg={6} md={6}>
            <Container className={`${styles.bookingContainer} me-md-0`}>
              <h5>
                {props.offer.unitPrice} € par nuit
                {showRangeCalendar && totalPrice && ` (${totalPrice} €)`}
              </h5>
              <Row className={`${styles.CalendarSection}`}>
                <span className={`${styles.availableIcon}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calendar3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                    <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  </svg>
                </span>
                <h4 className={`${styles.availableTitle}`}>Diponibilité</h4>
                {showStartDateCalendar &&
                  !showEndDateCalendar &&
                  !showRangeCalendar && (
                    <Calendar
                      // todo set max date (1 year)
                      tileDisabled={isStartDateUnavailable}
                      onChange={onSelectStartDate}
                      value={startDate}
                      selectRange={false}
                      minDate={minStartDate}
                    />
                  )}
                {!showStartDateCalendar &&
                  showEndDateCalendar &&
                  !showRangeCalendar && (
                    <Calendar
                      tileDisabled={isEndDateUnavailable}
                      onChange={onSelectEndDate}
                      value={endDate}
                      selectRange={false}
                      minDate={minEndDate}
                      maxDate={maxEndDate}
                      tileClassName={preSelectedtileClassName}
                    />
                  )}
                {!showStartDateCalendar &&
                  !showEndDateCalendar &&
                  showRangeCalendar && (
                    <Calendar
                      tileDisabled={isRangeDateUnavailable}
                      onClickDay={onClickDayOnRange}
                      value={dateRange}
                      selectRange={true}
                      minDate={minStartDate}
                    />
                  )}
              </Row>
              <Row>
                {showRangeCalendar && status !== "unauthenticated" && (
                  <Button id="reserve" onClick={bookOffer} variant="dark">
                    Réserver
                  </Button>
                )}
                {!showRangeCalendar && status !== "unauthenticated" && (
                  <Button className="disabled" variant="dark">
                    Réserver
                  </Button>
                )}
                {status === "unauthenticated" && (
                  <Button className="disabled" variant="dark">
                    Connecter vous
                  </Button>
                )}
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="mt-3 mb-3">
              <h4 className="mb-4">Sur La carte</h4>
              <AhMap address={props.address} apiKey={props.mapsApiKey} />
            </Row>

            <Row className="mt-3 mb-3">
              <h4 className="mb-4">Commentaires</h4>
            </Row>
            {canComment && props.eligibleToComment && (
              <Row className="justify-content-center">
                <label htmlFor="comment">Ajouter un commentaire :</label>
                <textarea
                  onChange={onTextAreChange}
                  placeholder="10 caractères minimum"
                  className={styles.commentArea}
                  id="comment"
                  name="comment"
                  rows="5"
                  cols="33"
                />
                <div>
                  <AhButton onClick={onSubmitComment} value="envoyer">
                    Envoyer
                  </AhButton>
                </div>
              </Row>
            )}
            <Row className="mt-3 mb-3">
              {(!props.offerComments || props.offerComments.length === 0) && (
                <span>Aucun commentaire</span>
              )}
              {props.offerComments &&
                props.offerComments.map((comment, index) => {
                  return (
                    <div className={`mb-4 p-4 ${styles.comment}`} key={index}>
                      <h6 className="mb-4">
                        {comment.client.firstName} {comment.client.lastName}
                      </h6>
                      {comment.content}
                    </div>
                  );
                })}
              <AhPagination total={props.totalItems}></AhPagination>
            </Row>
            <Modal
              show={showCommentPopup}
              fullscreen="md-down"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              onHide={handleCloseCommentPopup}
            >
              <Modal.Header closeButton>
                <Modal.Title className="m-auto">
                  Merci pour votre commentaire
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <div>Votre commentaire sera affiché après vérification</div>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </Container>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const pageNumber = context.query.page;
  const session = await getSession(context);

  let imageNotFoundUrl = "/images/noimage-found.png";
  let offerId = context.params.offerId;
  let offer = await getOfferById(offerId);
  if (!offer) {
    return {
      notFound: true,
    };
  }
  let defaultImage =
    offer &&
    offer.media &&
    offer.media.length > 0 &&
    offer.media[0].url != null &&
    offer.media[0].url != undefined
      ? offer.media[0].url
      : imageNotFoundUrl;
  let category = await getCategoryForOffer(offer);
  let bookedDates = await getBookedDatesForOffer(offer);
  let address = await getAddressById(offer.address ? offer.address.id : null);
  let offerCommentsData = await getOfferCommentsByOfferId(offerId, pageNumber);

  const getDefaultStartDate = () => {
    const m = moment();
    m.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });
    let date = m.toDate();
    return date;
  };

  let eligibleToComment = false;
  let comments = await getCurrentUserCommentForOffer(offerId, session);
  if (comments && comments.length === 0) {
    const allReservations = await getCurrentUserReservationForOffer(
      session,
      offerId
    );
    console.log("allReservations : ", allReservations);
    for (let i = 0; i < allReservations.length; i++) {
      const reservation = allReservations[i];
      const startDate = parseDate(reservation.fromDate);
      if (compareDates(new Date(), startDate)) {
        eligibleToComment = true;
        break;
      }
    }
  }

  const getDefaultEndDate = () => {
    const m = moment().add(1, "days");
    m.set({ hour: 11, minute: 0, second: 0, millisecond: 0 });
    let date = m.toDate();
    return date;
  };

  let defaultDateRange = JSON.stringify([
    getDefaultStartDate(),
    getDefaultEndDate(),
  ]);
  return {
    props: {
      offer,
      defaultImage,
      category,
      defaultDateRange,
      bookedDates,
      address,
      eligibleToComment,
      offerComments: offerCommentsData.offerComments,
      totalItems: offerCommentsData.totalItems,
      mapsApiKey: COOGLE_MAPS_API_KEY,
    },
  };
}
