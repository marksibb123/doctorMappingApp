import GoogleMapReact from "google-map-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useEffectAsync } from "./hooks/useEffectAsync";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as styles from "./GPMap.module.css";

export const GPMap = () => {
  const defaultLocation = {
    lat: 55.8627026,
    lng: -4.2460259,
  };

  const defaultMapParams = {
    center: defaultLocation,
    zoom: 13,
  };

  const [gps, setGps] = useState<any | undefined>(undefined);

  useEffectAsync(async () => {
    const gpsResponse = await fetch(
      `http://localhost:3000/gps?lat=${defaultLocation.lat}&lng=${defaultLocation.lng}`
    );
    const gpsRaw = await gpsResponse.json();
    setGps(gpsRaw);
  }, []);

  return (
    <>
      {gps && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyC2CmhUmpXIxkcQubwX42E1GqlJ_YgcjtU" }}
          defaultCenter={defaultMapParams.center}
          defaultZoom={defaultMapParams.zoom}
        >
          {gps.map((gp: any) => (
            <GPMapIcon
              gp={gp}
              lat={gp.location.lat}
              lng={gp.location.lng}
              text={gp.name}
            ></GPMapIcon>
          ))}
        </GoogleMapReact>
      )}
    </>
  );
};

const GPMapIcon = ({ gp }: any) => {
  return (
    <FontAwesomeIcon
      icon={faUserMd}
      size="2x"
      className={styles.mapIcon}
    ></FontAwesomeIcon>
  );
};
