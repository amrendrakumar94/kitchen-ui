import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import image from "../../assets/Images/main.png";
function SignUp() {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
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
        history("/login");
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 mt-10 px-28 h-fit" id="sign_up_page">
        <div className="border border-gray-600 shadow">
          <img
            src={image}
            alt="Background"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="border border-gray-600 shadow px-16 py-40">
          <div className="flex justify-center">
            <h5 className="font-bold text-4xl">Sign Up</h5>
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-">Enter your details to start ordering</p>
          </div>
          <div className="flex justify-center mt-6">
            <form onSubmit={handleSubmit}>
              <div className="mt-2 flex justify-between gap-3">
                <TextField
                  variant="standard"
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  fullWidth
                  className=""
                />
                <TextField
                  variant="standard"
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  fullWidth
                  className=""
                />
              </div>
              <div className="mt-2">
                <TextField
                  variant="standard"
                  label="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  className=""
                />
              </div>
              <div className="mt-2">
                <TextField
                  variant="standard"
                  label="password"
                  name="password"
                  type="password"
                  value={formData.password1}
                  onChange={handleChange}
                  fullWidth
                  className=""
                />
              </div>

              <div className="flex mt-2 justify-between gap-3">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember me"
                />
                <Button
                  type="button"
                  variant="text"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "8px",
                  }}
                >
                  Forgot your password? Reset it here
                </Button>
              </div>

              <div className="flex justify-center mt-8">
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
              <div className="flex justify-center mt-4">
                <NavLink
                  type="button"
                  to="/login"
                  variant="text"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "8px",
                  }}
                >
                  Already Account? Sign In
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
