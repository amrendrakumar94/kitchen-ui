import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
function Map() {
  const [api, setApi] = useState("");
  useEffect(() => {
    setApi("AIzaSyDQme5LJSE3K_acIY-YMzSYbVfVoYH9fc8");
  }, []);
  return (
    <div className="rounded-xl">
      <LoadScript googleMapsApiKey={api}>
        <GoogleMap
          mapContainerStyle={{
            height: "30vh",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
          }}
          zoom={20}
          center={{
            lat: 12.992611686404144,
            lng: 77.70329206614369,
          }}
        />
      </LoadScript>
    </div>
  );
}
export default Map;
