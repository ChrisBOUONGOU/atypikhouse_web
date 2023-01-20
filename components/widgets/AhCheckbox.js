/* eslint-disable react/jsx-key */
import Image from "next/image";
import Link from "next/link";
import React from "react";

import styles from "../../styles/widgets/AhCheckbox.module.css";

export default function AhCheckbox({ children, name, id, value, onChange }) {
  return (
    <div className={`ah-check-box ${styles.AhCheckboxWrapper}`}>
      <div className={styles.inputCheckboxWrapper}>
        <input
          className={`${styles.checkboxInput}`}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
        />
        <label className={styles.customCheckbox} htmlFor={id}></label>
      </div>
      <label htmlFor={id}>{children}</label>
    </div>
  );
}
