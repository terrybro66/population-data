import React from "react";
import styles from "./InfoCard.module.css";

const InfoCard = ({ name, population }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>{name}</h1>
          <div className={styles.container2}>
            <div clasName={styles.key}>City</div>
            <div className={styles.value}>London</div>
          </div>
          <div className={styles.container2}>
            <div clasName={styles.key}>Population</div>
            <div className={styles.value}>{population}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoCard;
