import React, { useCallback, useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const cuisineTypes = [
  { name: "Mediterranean", id: 1 },
  { name: "American", id: 2 },
  { name: "Italian", id: 3 },
  { name: "Punjabi", id: 4 },
  { name: "South Indian", id: 5 },
  { name: "All", id: 6 },
];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cuisineType, setcuisineType] = useState("All");
  const navigate = useNavigate();

  const handleCuisineType = (type) => {
    setcuisineType(type);
  };

  const addToCart = async (productId) => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (productId > 0 && userData != null) {
      try {
        const response = await fetch("http://localhost:8082/add-to-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.id,
            itemId: productId,
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Failed to add item to cart. Please try again later."
          );
        } else {
          const responseData = await response.json();
          setCartItems(responseData);
          console.log("Item added to cart successfully.");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      console.error("Invalid productId or missing user data.");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : 0;
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8082/get-all-products/${userId}/${cuisineType}`
      );
      const data = await response.json();
      setProducts(data.dishDetails);
      setCartItems(data.dishIds);
    };
    fetchData();
  }, [cuisineType]);

  return (
    <div className="bg-white ml-10 mt-4 p-10 h-fit">
      <div className="flex flex-wrap justify-center md:justify-start space-x-2 md:space-x-4 mt-2 md:mt-0 gap-x-8">
        {cuisineTypes.map((cuisine) => (
          <button
            key={cuisine.id}
            className={`${
              cuisineType === cuisine.name ? "text-orange-700" : "text-gray-700"
            } hover:text-orange-700  py-1 px-6 rounded-full border border-gray-400 shadow-lg`}
            onClick={() => handleCuisineType(cuisine.name)}
          >
            {cuisine.name}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-12 xl:gap-y-14">
          {products.map((product) => (
            <div
              key={product.id}
              className="shadow-lg rounded-lg group relative flex flex-col"
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-lg"
                  style={{ minHeight: "200px", maxHeight: "200px" }}
                />
              </div>
              <div className="flex-grow flex flex-col justify-between items-center p-4">
                <div className="mt-2">
                  <h3 className="text-sm text-gray-700">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </h3>
                </div>
                <div className="mt-2">
                  <Typography
                    style={{
                      color: "#616161",
                      marginBottom: "2px",
                      fontSize: "12px",
                      fontFamily: "unset",
                      textAlign: "center",
                    }}
                  >
                    {product.description}
                  </Typography>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <p className="text-gray-700 mb-2">&#8377;{product.price}</p>
                  {cartItems.includes(product.id) ? (
                    <Button
                      style={{
                        border: "1.5px solid #CBD5E0",
                        padding: "4px 16px",
                        color: "black",
                        borderRadius: "9999px",
                        transition: "background-color 0.3s, color 0.3s",
                        "&:hover": {
                          backgroundColor: "#E2E8F0",
                          color: "#FFF",
                        },
                      }}
                      onClick={() => navigate("/cart")}
                    >
                      Go to Cart
                    </Button>
                  ) : (
                    <Button
                      style={{
                        border: "1.5px solid #CBD5E0",
                        padding: "4px 16px",
                        borderRadius: "9999px",
                        color: "black",
                        transition: "background-color 0.3s, color 0.3s",
                        "&:hover": {
                          backgroundColor: "#E2E8F0",
                          color: "#FFF",
                        },
                      }}
                      onClick={() => addToCart(product.id)}
                    >
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
