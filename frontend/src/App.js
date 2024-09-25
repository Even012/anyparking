import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Login from './components/LoginPage/login';
import Register from './components/RegisterPage/register';
import VisitorLandingPage from './components/landingpage';
import VisitorDashboard from './components/Dashboard/VisitorDashboard'

import ConsumerBrowse from './components/Dashboard/ConsumerBrowse';
import ConsumerDashboard from './components/Dashboard/ConsumerDashboard';
import ProviderDashboard from './components/Dashboard/ProviderDashboard';
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

  
  return (
    <ThemeProvider theme={theme}> 
    <Router>
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column'}}>
      
      <NavBar/>


      <Routes>
        <Route path="/" element={<VisitorLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<VisitorDashboard />} />
        <Route path="/consumer/browse" element={<ConsumerBrowse />} />
        <Route path="/consumer/booking" element={<ConsumerDashboard />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      </Routes>

      
      <Footer />
    </Box>

    </Router>
    </ThemeProvider> 
  );
}

export default App;
