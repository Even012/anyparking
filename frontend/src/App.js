import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Login from './components/LoginPage/login';
import Register from './components/RegisterPage/register';
import VisitorLandingPage from './components/landingpage';
import Footer from './components/footer';



function App() {
  return (
    <Router>
    <Box className='flex flex-col min-h-screen'>
      
      <NavBar />

      <Box
        component="main"
        sx={{
          flexGrow: 1, // This makes the main content expand to fill the remaining space
        }}
      >
        <Routes>
          <Route path="/" element={<VisitorLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
      
      <Footer />
    </Box>

    </Router>
  );
}

export default App;
