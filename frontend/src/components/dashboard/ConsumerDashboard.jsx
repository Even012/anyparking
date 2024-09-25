import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';

export default function ConsumerDashboard() {
  
    const [bookings, setBookings] = React.useState(null);   

    const token = localStorage.getItem("token");

    React.useEffect(() => {
        const fetchBookings = async () => {
          try {
            const res = await axios.get("http://localhost:8888/bookings/all", { 
              headers: { Authorization: `Bearer ${token}` }
            });
    
            if (res.status === 200) {
              setBookings(res.data);  // Store the bookings in the state, should filter out my listing in real case ***
            }
          } catch (error) {
            if (error.response) {
              console.log(error.response.data.error);  // Set error message if server responds with an error
            } else {
              console.log('An error occurred while fetching the bookings.');
            }
          }
        };
    
        fetchBookings();
      }, [token]); 


    const card = (booking) => (
        <React.Fragment>
        <CardContent>
        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, fontWeight: 'bold' }}>
            {booking.name}
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{booking.date}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Duration: {booking.duration} h
        </Typography>
        </CardContent>
        <CardActions>
        <Button size="small">Learn More</Button>
        </CardActions>
    </React.Fragment>
    );

  return (
    <Box sx={{flexGrow: 1, p: 4}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h4" sx={{fontWeight: 'bold'}}> My Bookings </Typography>

        </Box>

        <Box sx={{py: 2}}>
            <Typography variant="h6"> Public Bookings </Typography>
            <Box sx={{ py: 1, display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {bookings ? bookings.map((booking) => (<Card key={booking._id} variant="outlined" sx={{minWidth: '200px', minHeight: '200px', mx: 1}}>{card(booking)}</Card>)) : <></>}
            </Box>   
        </Box>

        <Box sx={{py: 2}}>
            <Typography variant="h6"> Private Bookings </Typography>
            <Box sx={{ py: 1, display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
            </Box>   
        </Box>

    </Box>
  )
}
