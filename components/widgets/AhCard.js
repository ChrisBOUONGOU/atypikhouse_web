/* eslint-disable react/jsx-key */
import Image from "next/image";
import Link from "next/link";
import React from "react";

import styles from "../../styles/widgets/AhCard.module.css";

export default function AhCard({ href, src, alt, style, children }) {
  const childrenStyled = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      className: `${child.props.className ? child.props.className : ""} ${
        styles.title
      }`,
    });
  });
  return (
    <Link href={href}>
     
        <div className={styles.card} style={style}>
          <Image src={src} alt={alt} layout="fill" objectFit="cover"></Image>
          {childrenStyled}
        </div>
   
    </Link>
  );
}
