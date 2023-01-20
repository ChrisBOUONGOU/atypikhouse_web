/* eslint-disable react/jsx-key */
import styles from "../../styles/components/offer/OfferHighlights.module.css";

export default function OfferHighlights({ highlights }) {
  function deleteOverflow(text, count) {
    if (text && count) {
      return text.slice(0, count) + (text.length > count ? "..." : "");
    }
    return "";
  }

  return (
    <>
      <ul className={styles.itemList}>
        {highlights &&
          highlights.map((h, index) => (
            <li className={styles.item} key={index}>
              {deleteOverflow(h.content, 60)}
            </li>
          ))}
      </ul>
    </>
  );
}
