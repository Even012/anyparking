import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import login_img from "../../assets/login2.png";

function Login({setUser, setToken}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginresponse = await axios.post("http://localhost:8888/user/auth/login/", {
        email: email,
        password: password,
      });
      console.log(loginresponse.data.token);
      if (loginresponse.status === 200) {
        setUser(email);
        setToken(loginresponse.data.token);
        setMessage(
          <Typography color="success.main">
            Welcome, you are logged in successfully!
          </Typography>
        );
        setTimeout(() => {
          navigate("/");
        }, 2000); // After logged in successfully, user will be redirected to dashboard
      } else {
        setMessage(
          <Typography color="error.main">Invalid Credentials</Typography>
        );
      }
    } catch (error) {
      setMessage(
        <Typography color="error.main">Invalid Credentials</Typography>
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{flexGrow: 1, display: 'flex', alignItems: 'center'}}>
      <Paper elevation={3} sx={{ p: 2, m: 2, borderRadius: 6 }}>
        <Grid container spacing={2}>
          {/* Left section with image */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                AnyParking
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Simplify your parking needs.
              </Typography>
            </Box>
            <Box
              component="img"
              src={login_img}
              alt="Login Visual"
              sx={{ width: "100%", borderRadius: 2 }}
            />
          </Grid>

          {/* Right section with form */}
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: {xs: 1, md: 3},
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, mt: 2 }}>
                Welcome to AnyParking!
              </Typography>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Login
              </Button>
              {message && <Box mt={2} sx={{ textAlign: 'center' }}>{message}</Box>}

              {/* Links */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button to="/otp">
                  Forgot Password?
                </Button>
                <Button onClick={() => {navigate('/register');}}>
                  New Member? Sign Up
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Login;