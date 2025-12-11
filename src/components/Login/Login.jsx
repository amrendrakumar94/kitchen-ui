import { React, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import image from "../../assets/Images/main.png";
function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
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
    try {
      const response = await fetch("http://localhost:8082/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
          navigate("/");
        } else {
          setMessage(data.message);
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="min-h-full min-w-full flex justify-center pt-28">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt="Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>{" "}
        {/* Semi-transparent overlay */}
      </div>
      <div className="z-10 rounded-2xl shadow-xl bg-white py-28 px-40">
        <div className="flex justify-center">
          <h5 className="font-bold text-4xl">Login</h5>
        </div>
        <div className="flex justify-center mt-4">
          <p className="text-">Enter your details to start ordering</p>
        </div>
        <div className="text-center text-red-700">{message}</div>
        <div className="flex justify-center mt-6">
          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <TextField
                variant="standard"
                label="Email"
                name="email"
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
                value={formData.password}
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
                to="/signup"
                variant="text"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "8px",
                }}
                onClick=""
              >
                New to our app? Sign up now!
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
