import GoogleMapReact from "google-map-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useEffectAsync } from "./hooks/useEffectAsync";
import { faUserMd, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as styles from "./GPMap.module.css";

export const GPMap = () => {
  const [defaultLocation, setDefaultLocation] = useState({
    lat: 55.8627026,
    lng: -4.2460259,
  });

  const defaultMapParams = {
    center: defaultLocation,
    zoom: 13,
  };

  const [gps, setGps] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDefaultLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffectAsync(async () => {
    const gpsResponse = await fetch(
      `http://localhost:3000/gps?lat=${defaultLocation.lat}&lng=${defaultLocation.lng}`
    );
    const gpsRaw = await gpsResponse.json();
    setGps(gpsRaw);
  }, [defaultLocation]);
  
  return (
    <>
      {gps && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAsAAL3BMBo8LL6WxoV4prixwkr6sq7wrQ" }}
          defaultCenter={defaultLocation}
          defaultZoom={defaultMapParams.zoom}
        >
        {console.log('LOCATION', defaultLocation)}
          <UserIcon
            lat={defaultLocation.lat}
            lng={defaultLocation.lng}
          />
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

const UserIcon = ({ lat, lng }: { lat: number; lng: number }) => {
  return (
    <FontAwesomeIcon
      icon={faUser}
      size="2x"
      className={styles.mapIcon}
      color="lightblue"
    ></FontAwesomeIcon>
  );
};
