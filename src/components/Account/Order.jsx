import {
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";

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

function Order({ dishIds, date }) {
  const classes = useStyles();
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderDate, setOrderDate] = useState("dd-mm-yyyy");

  function formatDate(dateObj) {
    const day = dateObj.date.toString().padStart(2, "0");
    const month = (dateObj.month + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = (dateObj.year + 1900).toString(); // Year is given as years since 1900

    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    if (dishIds) {
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:8082/get-dish-details-by-dish-ids/${dishIds}`
        );
        const data = await response.json();
        setOrderDetails(data);
        setOrderDate(formatDate(date));
      };
      fetchData();
    }
  }, []);

  return (
    <div>
      <Typography
        variant="body1"
        sx={{
          color: "tan",
          fontWeight: "bold",
          margin: "10px 0",
          marginLeft: "8px",
        }}
      >
        Ordered on {orderDate}
      </Typography>
      <List className="flex">
        {orderDetails &&
          orderDetails.map((orderDetail) => (
            <ListItem key={orderDetail.id}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  image={orderDetail.image}
                  title={orderDetail.name}
                />
                <CardContent className={classes.content}>
                  <Typography variant="h5">{orderDetail.name}</Typography>
                  <Typography variant="subtitle1">
                    Price: {orderDetail.price}
                  </Typography>
                  <Typography variant="subtitle1">
                    Quantity: {orderDetail.quantity}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
      </List>
    </div>
  );
}
export default Order;
