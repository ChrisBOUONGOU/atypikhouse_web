/* eslint-disable react/jsx-key */
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import styles from "../../styles/widgets/AhOfferCard.module.css";
import { AddToFavoritesIcon, RemoveFavoritesIcon } from "./AhFavoriteHeart";
import nextClient from "../../lib/front/api/nextClient";

export default function AhOfferCard({ offer, favoriteId, onRemoveFav }) {
  let offerImage, offerAlt;

  const [favId, setFavId] = useState(favoriteId);
  const { status } = useSession();

  if (Array.isArray(offer.media) && offer.media.length) {
    offerImage = offer.media[0].url;
    offerAlt = offer.media[0].alt;
  }

  const addToFav = async (offerId) => {
    if (status === "unauthenticated") {
      location.href = "/api/auth/signin";
      return;
    }
    const newFavId = await nextClient.post("/api/favorites/add", { offerId });
    setFavId(newFavId.favId);
  };

  const removeFromFav = async (fid) => {
    await nextClient.delete(`/api/favorites/remove?fid=${fid}`);
    if (onRemoveFav) onRemoveFav();
    setFavId(null);
  };

  return (
    <div className={`ah-offer-card ${styles.animationEffect} ${styles.cardContainer}`}>
      {favId ? (
        <span
          onClick={() => removeFromFav(favId)}
          className={`remove-from-favorites ${styles.favorites} ${styles.removeFromFavorites}`}
        >
          <RemoveFavoritesIcon></RemoveFavoritesIcon>
        </span>
      ) : (
        <span
          onClick={() => addToFav(offer.id)}
          className={`add-to-favorites ${styles.favorites} ${styles.addToFavorites}`}
        >
          <AddToFavoritesIcon></AddToFavoritesIcon>
        </span>
      )}
      <div className={styles.unitPriceWrapper}>
        <span className={styles.unitPrice}>{offer.unitPrice}</span>€/nuit
      </div>
      <div>
        <Card className={styles.card}>
          <Link href={`/offers/${offer.id}`}>
           
              <Card.Img
                src={offerImage}
                alt={offerAlt}
                variant="top"
                height="200px"
              />
           
          </Link>
          <Card.Body>
            {offer.address && offer.address.city && offer.address.city.name && (
              <Link href={`/search?location=${offer.address.city.name}`}>
               
                  <Card.Subtitle className={styles.cropTextTitle}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#82358ccc"
                      className="bi bi-geo-alt-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    </svg>
                    <span className={styles.city}>
                      {offer.address.city.name}
                    </span>
                  </Card.Subtitle>
               
              </Link>
            )}

            <Link href={`/offers/${offer.id}`}>
             
                <Card.Title className={styles.cropTextTitle}>
                  {offer.title}
                </Card.Title>
             
            </Link>
            <Link href={`/offers/${offer.id}`}>
             
                <Card.Text>
                  <span className={styles.offerOption}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.997 18h-11.995l-.002-.623c0-1.259.1-1.986 1.588-2.33 1.684-.389 3.344-.736 2.545-2.209-2.366-4.363-.674-6.838 1.866-6.838 2.491 0 4.226 2.383 1.866 6.839-.775 1.464.826 1.812 2.545 2.209 1.49.344 1.589 1.072 1.589 2.333l-.002.619zm4.811-2.214c-1.29-.298-2.49-.559-1.909-1.657 1.769-3.342.469-5.129-1.4-5.129-1.265 0-2.248.817-2.248 2.324 0 3.903 2.268 1.77 2.246 6.676h4.501l.002-.463c0-.946-.074-1.493-1.192-1.751zm-22.806 2.214h4.501c-.021-4.906 2.246-2.772 2.246-6.676 0-1.507-.983-2.324-2.248-2.324-1.869 0-3.169 1.787-1.399 5.129.581 1.099-.619 1.359-1.909 1.657-1.119.258-1.193.805-1.193 1.751l.002.463z" />
                    </svg>
                    {offer.capacity == 1
                      ? `${offer.capacity} Personne`
                      : `${offer.capacity} Personnes`}
                  </span>
                  <span className={styles.offerOption}>
                    <svg
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 19v-7h-23v-7h-1v14h1v-2h22v2h1zm-20-12c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm19 4c0-1.657-1.343-3-3-3h-13v3h16z" />
                    </svg>
                    {offer.nbBeds == 1
                      ? `${offer.nbBeds} Lit`
                      : `${offer.nbBeds} Lits`}
                  </span>
                </Card.Text>
                <Card.Text className={styles.cropTextSummary}>
                  {offer.summary}
                </Card.Text>
            
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
