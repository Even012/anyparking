import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import CreateVehicle from '../PopUp/CreateVehicle';
import axios from 'axios';

const UserVehicle = () => {
  // State for user's vehicles, assuming user can have more than one vehicle
  const [vehicles, setVehicles] = useState([]);
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const fetchListings = async () => {
        try {
            const res = await axios.get("http://localhost:8888/user/vehicles", { 
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res.data);
            if (res.status === 200) {
                setVehicles(res.data);  
            } else {
                console.log(res);  // Additional logging
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);  
            } else {
                console.log('An error occurred while fetching the listings.');
            }
        }
    };
    fetchListings();
  }, [token, open]); 


  const vehicleCard = (vehicle) => (
    <Card key={vehicle._id} sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Vehicle Make */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              <strong>Make:</strong> {vehicle.make}
            </Typography>
        </Box>

        {/* Vehicle Model */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              <strong>Model:</strong> {vehicle.model}
            </Typography>
        </Box>

        {/* Vehicle Year */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              <strong>Year:</strong> {vehicle.year}
            </Typography>
        </Box>

        {/* License Plate */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              <strong>License Plate:</strong> {vehicle.licensePlate}
            </Typography>
        </Box>
        {/* COLOUR */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              <strong>Color:</strong> {vehicle.color}
            </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
  );

  return (
    <Box sx={{ mt: 2, flexGrow: 1, px: 4}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4" gutterBottom>
            My Vehicles
        </Typography>
        <Button onClick={() => {setOpen(true);}}>add</Button>

      </Box>
      {vehicles && vehicles.map((vehicle) => vehicleCard(vehicle) )}
      <CreateVehicle open={open} handleClose={() => {setOpen(false);}}/>
    </Box>
  );
};

export default UserVehicle;