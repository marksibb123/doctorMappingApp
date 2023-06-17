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
    zoom: 10,
  };

  const [selectedGp, setSelectedGp] = useState<any | undefined>(undefined);

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
      alert("Geolocation is not supported by your browser.");
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
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {gps && (
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyAkMDHxwIxN_S9g1S1KzfUW4ZjEIq6uq5Q",
              }}
              defaultCenter={defaultLocation}
              defaultZoom={defaultMapParams.zoom}
            >
              {console.log("LOCATION", gps)}
              <UserIcon lat={defaultLocation.lat} lng={defaultLocation.lng} />
              {gps.map((gp: any) => (
                // due to several GPs being located in close area (medical centres typically), some are stacked
                <GPMapIcon
                  gp={gp}
                  lat={gp.location.lat}
                  lng={gp.location.lng}
                  text={gp.name}
                  isSelected={gp === selectedGp}
                ></GPMapIcon>
              ))}
            </GoogleMapReact>
          )}
        </div>
        {gps && <GPList gps={gps} selectGp={setSelectedGp} />}
      </div>
    </>
  );
};

interface GPListProps {
  gps: any[];
  selectGp: (gp: any) => void;
}

const GPList: React.FC<GPListProps> = ({ gps, selectGp }) => (
  <div
    style={{
      flex: 1,
      maxHeight: "100vh",
      overflow: "auto",
      backgroundColor: "#f5f5f5",
      padding: "1rem",
      boxShadow: "0 0 10px rgba(0,0,0,0.15)",
    }}
  >
    <h2>GPS Locations</h2>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      {gps.map((gp: any, index: number) => (
        <button key={index} onClick={() => selectGp(gp)}>
          {gp.name}
        </button>
      ))}
    </div>
  </div>
);

const GPMapIcon = ({ gp, isSelected }: any) => {
  return (
    <FontAwesomeIcon
      icon={faUserMd}
      size="2x"
      className={styles.mapIcon}
      color={isSelected ? "red" : undefined}
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
