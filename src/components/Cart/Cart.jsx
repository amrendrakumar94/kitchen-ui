import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    marginBottom: 2,
    maxWidth: "600px",
  },
  media: {
    width: 150,
    height: 150,
    objectFit: "cover",
  },
  content: {
    flex: "1 0 auto",
    padding: "10px",
  },
}));

const btnStyle = {
  border: "1.5px solid #CBD5E0",
  width: "5px",
  borderRadius: "100px",
  color: "black",
  marginTop: "1px",
};

function Cart() {
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();

  const cartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      height="300"
      width="300"
      viewBox="0 0 512 512"
      className="opacity-35"
    >
      <circle fill="#B5F1F4" cx="256" cy="256" r="256" />
      <path
        fill="#4CDBC4"
        d="M85.333,154.953l115.702,115.7h-61.973l2.327,104.579l135.982,135.871  c128.166-10.595,229.535-115.595,234.422-245.298l-92.022-92.022c0,0-122.092,100.767-133.384,110.085L143.682,141.162  L85.333,154.953z"
      />
      <path
        fill="#FC6F58"
        d="M347.395,328.139H136.266V173.783h283.507l-44.835,134.504  C370.986,320.141,359.891,328.139,347.395,328.139z"
      />
      <path
        fill="#F1543F"
        d="M270.941,173.783v154.355h76.452c12.497,0,23.592-7.997,27.543-19.853l44.835-134.504h-148.83  V173.783z"
      />
      <path
        fill="#324A5E"
        d="M323.105,353.864c-11.816,0-21.745,7.977-24.764,18.83h-59.614  c-3.017-10.854-12.948-18.83-24.764-18.83s-21.745,7.977-24.764,18.83h-20.509c-13.79,0-25.007-11.219-25.007-25.009V141.162H85.333  v13.791h44.556v192.734c0,21.394,17.405,38.8,38.798,38.8h20.511c3.017,10.854,12.948,18.83,24.764,18.83s21.745-7.977,24.764-18.83  h59.614c3.017,10.854,12.948,18.83,24.764,18.83c14.208,0,25.726-11.517,25.726-25.726  C348.831,365.384,337.313,353.864,323.105,353.864z"
      />
      <path
        fill="#2B3B4E"
        d="M323.105,353.864c-11.816,0-21.745,7.977-24.764,18.83h-27.4v13.791h27.4  c3.017,10.854,12.948,18.83,24.764,18.83c14.208,0,25.726-11.517,25.726-25.726C348.831,365.384,337.313,353.864,323.105,353.864z"
      />
    </svg>
  );

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const userId = loggedInUser ? loggedInUser.id : 0;
    if (userId > 0) {
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:8082/get-dish-details-by-user-id/${userId}`
        );
        const data = await response.json();
        setItems(data);
        setUser(loggedInUser);
      };
      fetchData();
    } else {
      navigate("/login");
    }
  }, [refresh]);

  const handleIncrement = async (dishId) => {
    try {
      const response = await fetch(
        `http://localhost:8082/increment-cart-item/${user.id}/${dishId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setRefresh(!refresh);
      } else {
        console.error("Failed to increment item from cart.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDecrement = async (dishId) => {
    try {
      const response = await fetch(
        `http://localhost:8082/decrement-cart-item/${user.id}/${dishId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setRefresh(!refresh);
      } else {
        console.error("Failed to decrement item from cart.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeItem = async (dishId) => {
    try {
      const response = await fetch(
        `http://localhost:8082/remove-cart-item/${user.id}/${dishId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setRefresh(!refresh);
        console.log("Item removed from cart successfully.");
      } else {
        console.error("Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const totalPrice = items.reduce(
      (acc, item) => acc + item.dishDetail.price * item.count,
      0
    );
    setTotal(totalPrice);
  }, [items]);

  const handleOrder = async () => {
    try {
      let dish_ids =
        items && items.length > 0
          ? items.map((cartItem) => cartItem.dishDetail.id).join(",")
          : "";
      const orderData = {
        user_id: user.id,
        address: "Bangalore",
        order_ids: dish_ids,
      };
      const response = await fetch("http://localhost:8082/save-order-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Grid container style={{ marginTop: "100px", padding: "40px" }}>
        <Grid item xs={12} md={5} lg={5}>
          {items && items.length > 0 ? (
            items.map((cartItem) => (
              <Card
                key={cartItem.dishDetail.id}
                style={{ marginBottom: "10px", display: "flex" }}
              >
                <CardMedia
                  className={classes.media}
                  image={cartItem.dishDetail.image}
                  title={cartItem.dishDetail.name}
                />
                <CardContent className={classes.content}>
                  <Typography variant="h5" component="h2">
                    {cartItem.dishDetail.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{ marginTop: "5px" }}
                  >
                    {cartItem.dishDetail.description}
                  </Typography>
                  <div style={{ marginTop: "2px" }}>
                    <Button
                      style={btnStyle}
                      onClick={() => handleDecrement(cartItem.dishDetail.id)}
                    >
                      -
                    </Button>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="span"
                      style={{ margin: "0 10px" }}
                    >
                      {cartItem.count}
                    </Typography>
                    <Button
                      style={btnStyle}
                      onClick={() => handleIncrement(cartItem.dishDetail.id)}
                    >
                      +
                    </Button>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      component="span"
                    >
                      &#8377; {cartItem.dishDetail.price * cartItem.count}
                    </Typography>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => removeItem(cartItem.dishDetail.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="h3">Your cart is empty</Typography>
            </div>
          )}
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          style={{ padding: "9px", background: "", marginLeft: "200px" }}
        >
          <div className="">
            <Typography variant="h6">Total:&#8377;{total}</Typography>
            <Typography variant="body1">Offer: {/* Offer value */}</Typography>
            <Typography variant="body1">
              Discount: {/* Discount value */}
            </Typography>
          </div>
        </Grid>
      </Grid>
      <div className="flex justify-end px-96 ">
        <Button
          type="button"
          variant="contained"
          onClick={() => {
            handleOrder();
          }}
        >
          Order
        </Button>
      </div>
    </div>
  );
}

export default Cart;
