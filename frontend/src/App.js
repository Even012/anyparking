import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Login from './components/LoginPage/login';
import VisitorLandingPage from './components/landingpage';
import Footer from './components/footer';



function App() {
  return (
    <Router>
    <Box className='flex flex-col'>
      
      <NavBar />

      <Routes>
        <Route path="/" element={<VisitorLandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
      <Footer />
    </Box>

    </Router>
  );
}

export default App;
