import GoogleMapReact from "google-map-react";
import Image from "next/image";
import React from "react";
import styles from "../../styles/components/map/AhMap.module.css";

const Marker = () => <div className={styles.marker}></div>;

const AhMap = ({ address, apiKey }) => {
  const defaultParams = {
    defaultZoom: 8,
    notFoundZoom: 6,
  };

  let coordonates = {
    lat: address.latitude ? parseFloat(address.latitude) : 46,
    lng: address.longitude ? parseFloat(address.longitude) : 1,
  };

  return (
    <>
      {address && 
        <div style={{ height: "50vh", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: apiKey ?? "",
            }}
            defaultCenter={coordonates}
            defaultZoom={
              address.latitude && address.latitude
                ? defaultParams.defaultZoom
                : defaultParams.notFoundZoom
            }
          >
            <Marker lat={coordonates.lat} lng={coordonates.lng}></Marker>
          </GoogleMapReact>
        </div>
      
    }
    </>
  );
};

export default AhMap;
