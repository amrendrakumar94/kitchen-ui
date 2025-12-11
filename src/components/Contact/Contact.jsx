import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Map from "../Map/Map.jsx";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("http://localhost:8082/sign-in-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="w-full flex justify-center mt-44">
      <div>
        <div className="border-gray-500 shadow-md max-h-80 max-w-fit rounded-md p-10">
          <div className="mb-4">
            <label className="font-bold text-3xl">Restaurant Information</label>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-8 md:gap-8">
              <div>
                <div className="mb-6">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      fill="#000000"
                      height="12px"
                      width="12px"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 511.639 511.639"
                      xml:space="preserve"
                    >
                      <g>
                        <g>
                          <path d="M504.982,376.258h-0.021c-19.435-36.715-81.472-73.813-88.725-78.059c-14.4-8.213-29.696-10.731-42.987-6.997    c-10.411,2.88-18.944,9.301-24.768,18.624c-8.107,9.664-18.155,21.035-20.309,22.933c-16.512,11.221-26.944,10.133-41.28-4.224    L183.083,224.748c-14.336-14.357-15.403-24.768-4.757-40.533c2.411-2.859,13.824-12.949,23.488-21.056    c9.323-5.824,15.723-14.357,18.624-24.768c3.691-13.333,1.195-28.587-7.125-43.221c-4.117-7.019-41.216-69.077-77.952-88.512    C113.153-5.076,86.315-1.044,68.566,16.727L45.633,39.639C4.203,81.068-46.229,169.644,81.43,297.324L214.315,430.21    c61.141,61.141,113.301,81.429,155.627,81.429c46.059,0,80.448-24.043,102.037-45.632l22.912-22.912    C512.662,425.324,516.715,398.466,504.982,376.258z" />
                        </g>
                      </g>
                    </svg>
                    <p className="text-gray-700" style={{ marginLeft: "5px" }}>
                      Phone:
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-900">+123 456 7890</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-900">+123 456 7890</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#000000"
                      width="20px"
                      height="20px"
                      viewBox="0 0 32 32"
                    >
                      <path d="M25.497 6.503l.001-.003-.004.005L3.5 15.901l11.112 1.489 1.487 11.11 9.396-21.992.005-.006z" />
                    </svg>
                    <p className="text-gray-700" style={{ marginLeft: "5px" }}>
                      Location:
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-900">123 Main Street</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-10">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      fill="#000000"
                      height="12px"
                      width="12px"
                      version="1.1"
                      id="Icons"
                      viewBox="0 0 32 32"
                      xml:space="preserve"
                    >
                      <path d="M30,9.9C30,9.9,30,9.8,30,9.9c0-0.2-0.1-0.3-0.1-0.4c0,0,0,0,0,0c0,0,0,0,0,0c-0.1-0.1-0.1-0.2-0.2-0.3c0,0,0,0,0,0  c0,0,0,0,0,0l-13-9c-0.3-0.2-0.8-0.2-1.1,0l-13,9c0,0,0,0,0,0c0,0,0,0,0,0C2.3,9.3,2.2,9.4,2.2,9.4c0,0,0,0,0,0c0,0,0,0,0,0  C2.1,9.6,2,9.7,2,9.8c0,0,0,0,0,0.1c0,0,0,0.1,0,0.1v13c0,2.8,2.2,5,5,5h18c2.8,0,5-2.2,5-5V10C30,10,30,9.9,30,9.9z M16,2.2  L27.2,10L16,16.8L4.8,10L16,2.2z" />
                    </svg>
                    <p className="text-gray-700" style={{ marginLeft: "5px" }}>
                      Email:
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-900">info@tastybites.co</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15px"
                      height="15px"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z"
                        fill="#000000"
                        stroke="#000000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p className="text-gray-700" style={{ marginLeft: "5px" }}>
                      Social Media:
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900">info@tastybites.co</p>
                    <p className="text-gray-900">info@tastybites.co</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-400 min-h-44 max-w-full mt-4">
          <Map />
        </div>
      </div>
      <div className="bg-purple-700 border-gray-500 shadow-md max-h-fit max-w-96 rounded-xl  ml-10">
        <div>
          <div className="p-5">
            <div className="">
              <label className="text-white text-2xl font-bold">
                Get In Touch
              </label>
            </div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex justify-between mb-4 gap-1 ">
                <TextField
                  variant="standard"
                  label="First Name"
                  name="firstName"
                  rows={1}
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    style: { color: "white", fontSize: "10px", padding: "5px" },
                  }}
                  InputProps={{ style: { color: "white" } }}
                />
                <TextField
                  variant="standard"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "10px", padding: "5px" },
                  }}
                  fullWidth
                  InputProps={{ style: { color: "white" } }}
                />
              </div>
              <div className="mb-4">
                <TextField
                  variant="standard"
                  label="Your E-mail Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputLabelProps={{
                    style: { color: "white", fontSize: "10px", padding: "5px" },
                  }}
                  fullWidth
                  InputProps={{ style: { color: "white" } }}
                />
              </div>
              <div className="mb-4">
                <label className="text-white">Your Message</label>
              </div>
              <div className="mb-4">
                <TextField
                  variant="standard"
                  label="Type your message here..."
                  value={formData.message}
                  name="message"
                  onChange={handleChange}
                  className=""
                  fullWidth
                  multiline
                  rows={4}
                  style={{
                    color: "white",
                    boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "13px",
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      height: "140px",
                      color: "white",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "white",
                      fontSize: "11px",
                      padding: "10px",
                    },
                  }}
                />
              </div>
              <div className="flex justify-center p-5">
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "20px",
                    height: "30px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    textTransform: "none",
                    paddingTop: "8px",
                  }}
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
