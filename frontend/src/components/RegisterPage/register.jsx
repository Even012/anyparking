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
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import login_img from "../../assets/login2.png";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmed, setPasswordConfirmed] = React.useState("");
  const [role, setRole] = React.useState("consumer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === passwordConfirmed) {
      try {
        const res = await axios.post("http://localhost:8888/user/auth/register/", {
            email: email,
            password: password,
            passwordConfirmed: passwordConfirmed,
            role: role
        });
        console.log(res);
        if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", email);
            localStorage.setItem("role", role);
            if(role === 'consumer') {
              navigate("/consumer/dashboard");
            } else {
              navigate("/provider/dashboard");
            }
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
              alt="Register Visual"
              sx={{ width: "100%", borderRadius: 2, p: 2}}
            />
          </Grid>

          {/* Right section with registration form */}
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: {xs: 0, md: 1},
                justifyContent: "center",
                padding: 2
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Sign Up
              </Typography>

              {/* Role Selection */}
              <FormControl component="fieldset" >
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
    </Container>
  );
}

export default Register;