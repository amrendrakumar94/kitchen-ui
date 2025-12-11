import React from "react";

function Filter() {
  return (
    <div className="flex flex-col w-full md:w-1/6 p-4 mt-2 md:ml-12">
      <h2 className="text-lg font-semibold mb-4">Filter By</h2>
      <div className="space-y-2">
        <div>
          <label className="block">
            Price Range
            <select className="block w-full mt-1">
              <option>Low to High</option>
              <option>High to Low</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            Spiciness Level
            <select className="block w-full mt-1">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Filter;
