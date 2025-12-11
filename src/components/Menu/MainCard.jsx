import React from "react";
import image from "../../assets/Images/main.png";
function MainCard() {
  return (
    <div className="px-6">
      <div className="relative w-full">
        <img className="object-cover w-full h-64" src={image} alt="Main" />
        <div className="absolute inset-0 bg-black opacity-45"></div>
      </div>
    </div>
  );
}
export default MainCard;
