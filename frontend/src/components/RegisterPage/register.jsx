import React from "react";
import {
  Button,
  Radio,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import login_img from "../../assets/login2.png";
import axios from "axios";

function Register({user, setUser}) {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmed, setPasswordConfirmed] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [role, setRole] = React.useState("consumer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === passwordConfirmed) {
      try {
        const res = await axios.post("http://localhost:8888/user/auth/register/", {
            name: name,
            email: email,
            password: password,
            passwordConfirmed: passwordConfirmed,
            phoneNumber: phoneNumber,
            role: role
        });
        console.log(res);
        if (res.status === 200) {
            navigate('/');
            setUser(email);
        } else {
            alert(res.data.message);
        }
      } catch(error) {
            alert(error.response.data.message);
      }
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4}}>
      <Paper elevation={3} sx={{ maxWidth: 1000, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
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
              alt="Register Visual"
              sx={{ width: "100%", borderRadius: 2 }}
            />
          </Grid>

          {/* Right section with registration form */}
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                Sign Up
              </Typography>

              {/* Role Selection */}
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <Typography variant="body1">
                  Register As a...
                </Typography>
                <RadioGroup
                  row
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <FormControlLabel
                    value="consumer"
                    control={<Radio />}
                    label="consumer"
                  />
                  <FormControlLabel
                    value="provider"
                    control={<Radio />}
                    label="provider"
                  />
                </RadioGroup>
              </FormControl>

              {/* Name Field */}
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Phone Number Field */}
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              {/* Email Field */}
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password Field */}
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Confirm Password Field */}
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={passwordConfirmed}
                onChange={(e) => setPasswordConfirmed(e.target.value)}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
              >
                Create Account
              </Button>

              {/* Have an Account? Button */}
              <Button
                onClick={() => navigate("/login")}
                size="small"
                fullWidth
                sx={{ mt: 2, textTransform: "none" }}
              >
                Already have an account? Sign In
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Register;