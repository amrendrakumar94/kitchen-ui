import React from "react";
import MainCard from "./MainCard";
import Filter from "./Filter";
import ProductList from "./ProductList";
import SpecialtiesComponent from "./SpecialtiesSection";

function Menu() {
  return (
    <>
      <div className="mt-20">
        <MainCard />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <Filter className="md:w-1/4" />
        <ProductList className="md:w-3/4" />
      </div>
      <div>
        <SpecialtiesComponent />
      </div>
    </>
  );
}

export default Menu;
