import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { NavLink, useNavigate } from "react-router-dom";
import Order from "./Order";

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

function Account() {
  let options;
  const [selectedOption, setSelectedOption] = useState("Personal Information");
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option == "Login") {
      navigate("/login");
    }
    if (option == "Logout") {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData ? userData.id : 0;
    if (userData) {
      setUser(userData);
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:8082/get-order-details/${userId}`
        );
        const data = await response.json();
        setOrderDetails(data);
      };
      fetchData();
    }
  }, []);

  if (user) {
    options = ["Personal Information", "Order", "Logout"];
  } else {
    options = ["Personal Information", "Order", "Login"];
  }

  const iconMap = {
    "Personal Information": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="6" r="4" fill="#1C274C" />
        <path
          d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
          fill="#1C274C"
        />
      </svg>
    ),
    Order: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        width="22px"
        height="22px"
        viewBox="12 0 100 100"
        enable-background="new 0 0 100 100"
        xml:space="preserve"
      >
        <g>
          <path d="M39,32h22c1.1,0,2-0.9,2-2v-4c0-3.3-2.7-6-6-6H43c-3.3,0-6,2.7-6,6v4C37,31.1,37.9,32,39,32z" />
        </g>
        <path d="M72,25h-2c-0.6,0-1,0.4-1,1v4c0,4.4-3.6,8-8,8H39c-4.4,0-8-3.6-8-8v-4c0-0.6-0.4-1-1-1h-2c-3.3,0-6,2.7-6,6  v43c0,3.3,2.7,6,6,6h44c3.3,0,6-2.7,6-6V31C78,27.7,75.3,25,72,25z M66.8,49L47.6,68.2c-0.5,0.5-1.1,0.8-1.8,0.8  c-0.7,0-1.4-0.3-1.9-0.8L33.2,57.5c-0.5-0.5-0.5-1.1,0-1.6l2.1-2.1c0.5-0.5,1.1-0.5,1.6,0l8.8,8.8l17.3-17.3c0.5-0.5,1.1-0.5,1.6,0  l2.1,2.1C67.2,47.9,67.2,48.6,66.8,49z" />
      </svg>
    ),
    Logout: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18px"
        height="18px"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z"
          fill="#323232"
        />
        <path
          d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z"
          fill="#323232"
        />
      </svg>
    ),
  };
  return (
    <div className="mt-20 bg-slate-100">
      <div className="flex h-full w-full">
        <div className="py-32 px-10 bg-white shadow-lg rounded">
          <div className="font-bold text-center">
            <h2>Hello {user && user.name}</h2>
          </div>
          <List>
            {options.map((text, index) => (
              <ListItem
                button
                key={text}
                onClick={() => handleOptionSelect(text)}
              >
                <ListItemIcon>{iconMap[text]}</ListItemIcon>
                <ListItemText
                  primary={text}
                  className={`font-bold block py-2 pr-4 pl-3 duration-200 ${
                    selectedOption === text
                      ? "text-orange-700"
                      : "text-gray-700"
                  } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`}
                />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="ml-40 p-10">
          {selectedOption && (
            <Typography variant="h5" gutterBottom>
              {selectedOption}
            </Typography>
          )}
          {user && selectedOption == "Personal Information" && (
            <div>
              <form>
                <div className="mt-2 flex space-x-5">
                  <label>Name</label>
                  <TextField
                    variant="standard"
                    label=""
                    name="name"
                    InputProps={{ disableUnderline: true, disabled: true }}
                    value={user.name}
                    fullWidth
                    className=""
                  />
                </div>
                <div className="mt-2 flex space-x-5">
                  <div>Email:</div>
                  <TextField
                    variant="standard"
                    label=""
                    name="email"
                    value={user.email}
                    InputProps={{ disableUnderline: true, disabled: true }}
                    fullWidth
                    className=""
                  />
                </div>
                <div className="hidden flex justify-center mt-8">
                  <Button
                    style={{
                      borderRadius: "13px",
                      backgroundColor: "#7827ed",
                      width: "200px",
                      height: "30px",
                    }}
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          )}

          {user && selectedOption == "Order" && (
            <div>
              {orderDetails.map((orderDetail) => (
                <ListItem>
                  <Card
                    key={orderDetail.id}
                    style={{ marginBottom: "10px", display: "flex" }}
                  >
                    <Order
                      dishIds={orderDetail.orderIds}
                      date={orderDetail.createDate}
                    />
                  </Card>
                </ListItem>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Account;
