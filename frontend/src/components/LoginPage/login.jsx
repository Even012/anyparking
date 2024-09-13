import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AlertContext from "../CustomAlert/AlertContext";
import { Typography, Button, TextField, Box } from "@mui/material";
import login_img from '../../assets/login2.png';

function Login(props) {
  const navigate = useNavigate();
  const userEmail = props.userEmail;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { customAlert } = React.useContext(AlertContext);

  /* CHECK user login status, if has login redirect to main page */
  React.useEffect(() => {
    if (props.userEmail) {
      console.log("token:", userEmail);
      customAlert("You have logged in.");
      navigate("/");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginresponse = await axios.post("http://localhost:8000/login/", {
        email: email,
        password: password,
      });
      const logindata = loginresponse.data;

      if (logindata === "User Logged in successfully") {
        // store the email in local storage
        console.log(logindata);
        console.log(email);
        localStorage.setItem("UserEmail", email);
        props.setUserEmail(email);

        const response = await axios.post(
          "http://localhost:8000/user/byemail/",
          {
            email: email,
          }
        );

        console.log(JSON.parse(response.data)[0].fields.name);
        console.log(JSON.parse(response.data)[0].fields.user_type);
        console.log(JSON.parse(response.data)[0].pk);

        const allParkingResponse = await axios.get(
          "http://localhost:8000/parking/all/"
        );
        localStorage.setItem("allParkings", allParkingResponse.data);

        localStorage.setItem(
          "UserName",
          JSON.parse(response.data)[0].fields.name
        );
        localStorage.setItem(
          "UserType",
          JSON.parse(response.data)[0].fields.user_type
        );
        localStorage.setItem("UserId", JSON.parse(response.data)[0].pk);

        setMessage(
          <p className="loginsuccess">
            Welcome, you are logged in successfully! <br></br>
          </p>
        );
        setTimeout(() => {
          navigate("/");
        }, 2000); // After logged in successfully, user will be redirected to dashboard
      } else {
        setMessage(<p className="loginfail">Invalid Credentials</p>);
      }
    } catch (error) {
      console.error("Error message:", error);
      setMessage(<p className="loginfail">Invalid Credentials</p>);
    }
  };

  return (
    <>
      <Box className="flex">
        {/* left seciton */}
        <Box className="w-1/2">
          <Box>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              AnyParking
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              Simplify your parking needs.
            </Typography>
          </Box>
          <img src={login_img} alt="Login Visual" />
        </Box>

        {/* right section */}
        <Box className="w-1/2">
          <form onSubmit={handleSubmit}>
            <Box className="form-box">
              <h1>Welcome to AnyParking!</h1>
              <TextField
                type="text"
                autoFocus
                value={email}
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                type="password"
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" size="lg" sx={{ width: "100%" }}>
                <b>LOGIN</b>
              </Button>
              {message && <Box>{message}</Box>}
              <Link
                to="/otp"
                className="link"
                state={{ from: "login", body: {} }}
              >
                Forgot Password?
              </Link>
              <Link className="link" to="/register">
                New Member? Sign Up
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default Login;
