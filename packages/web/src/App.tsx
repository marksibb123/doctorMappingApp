import { GPMap } from "./GPMap";
import * as styles from "./App.module.css";
import React from "react";

export function App() {
  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.brand}>
          <a href="#">GP Search</a>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <GPMap></GPMap>
      </div>
    </>
  );
}
