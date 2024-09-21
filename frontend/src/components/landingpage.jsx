// landingpage is for visitors only 
// other users(consumers/ providers / admin) have their own dashboard

import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';

const VisitorLandingPage = () => {
  return (
    <>
      {/* Main Content */}
      <Container className="text-center mt-10" sx={{flexGrow: 1}}>
        <Typography variant="h3" className="font-bold text-gray-900">
          Welcome to AnyParking
        </Typography>
        <Typography className="mt-4 text-gray-700">
          Find or rent a car space in minutes!
        </Typography>
        
        {/* Call to Action Buttons */}
        <Box className="mt-8">
          <Button href="/browse" variant="contained" sx={{mx: 2}}>
            Explore Available Parking
          </Button>
        </Box>
        
        {/* Explanation Section */}
        <Box className="mt-10">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Why Join Us?
          </Typography>
          <Typography className="text-gray-600">
            Rent out your parking space to earn extra income, or find the perfect parking spot for your car in a few clicks!
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default VisitorLandingPage;