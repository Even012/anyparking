import './App.css';
import { useState } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Login from './components/LoginPage/login';
import Register from './components/RegisterPage/register';
import VisitorLandingPage from './components/landingpage';
import VisitorDashboard from './components/Dashboard/VisitorDashboard'

import Map from './components/Map/Map';

import ConsumerDashboard from './components/Dashboard/ConsumerDashboard';
import Footer from './components/footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  typography: {
    fontFamily: 'Quicksand, sans-serif',  // Use the Quicksand font
    fontSize: 14,  // Default font size for body text (in pixels)

    body1: {
      fontSize: '1rem',  // Font size for body1 (paragraph text)
    },
    button: {
      fontSize: '1rem',  // Font size for buttons
      fontWeight: 'bold',
    },
  },
});

function App() {
  const [user, setUser] = useState(null); // set Email when login/register
  const [token, setToken] = useState(null); // set Email when login/register
  
  return (
    <ThemeProvider theme={theme}> 
    <Router>
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column'}}>
      
      <NavBar token={token} user={user} setUser={setUser}/>


      <Routes>
        <Route path="/" element={<VisitorLandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} setToken={setToken}/>} />
        <Route path="/register" element={<Register setUser={setUser} setToken={setToken}/>} />
        <Route path="/browse" element={<VisitorDashboard />} />
        <Route path="/map" element={<Map />} />


        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
      </Routes>

      
      <Footer />
    </Box>

    </Router>
    </ThemeProvider> 
  );
}

export default App;
