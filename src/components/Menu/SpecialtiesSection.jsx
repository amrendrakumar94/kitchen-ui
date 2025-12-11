import { Typography } from "@mui/material";
import React from "react";
function SpecialtiesComponent() {
  return (
    <div className="container bg-gray-100 mx-auto flex flex-col md:flex-row items-center justify-between px-28 py-8">
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Discover our specialties</h2>
        <Typography style={{ color: "#616161", textWrap: true }}>
          Explore a world of flavors with our exquisite dishes. From appetizers
          to desserts, we offer a diverse menu made with fresh, locally sourced
          ingredients. Indulge in a culinary journey with us today!
        </Typography>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center">
          <img
            src={"Iced Tea.jpg"}
            alt={"Tea"}
            className="w-full h-full object-cover rounded-t-lg"
            style={{ minHeight: "200px", maxHeight: "200px" }}
          />
          <div className="p-4 flex flex-col items-center">
            <Typography
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "6px",
                fontFamily: "unset",
              }}
            >
              Iced Tea
            </Typography>
            <Typography
              style={{ color: "#616161", padding: "2px", fontSize: "15px" }}
            >
              Refreshing and Sweetened
            </Typography>
            <Typography style={{ color: "#616161", padding: "6px" }}>
              &#8377;15
            </Typography>
            <button className="border border-gray-400  px-4 py-1 rounded-full hover:bg-gray-100  transition duration-300 shadow">
              Add
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center">
          <img
            src={"Gourmet Coffee.jpg"}
            alt={"Tea"}
            className="w-full h-full object-cover rounded-t-lg"
            style={{ minHeight: "200px", maxHeight: "200px" }}
          />
          <div className="p-4 flex flex-col items-center">
            <Typography
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "6px",
                fontFamily: "unset",
              }}
            >
              Gourmet Coffee
            </Typography>
            <Typography
              style={{ color: "#616161", padding: "2px", fontSize: "15px" }}
            >
              Rich and Aromatic Blend
            </Typography>
            <Typography style={{ color: "#616161", padding: "6px" }}>
              &#8377;40
            </Typography>
            <button className="border border-gray-400  px-4 py-1 rounded-full hover:bg-gray-100  transition duration-300 shadow">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecialtiesComponent;
