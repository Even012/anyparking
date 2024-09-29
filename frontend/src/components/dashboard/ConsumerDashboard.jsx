import React from 'react';
import { Box, Typography, Button} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import moment from 'moment';

export default function ConsumerDashboard() {
  
    const [bookings, setBookings] = React.useState([]);   
    const [refresh, setRefresh] = React.useState(false); 

    const token = localStorage.getItem("token");

    const handleDeleteBooking = async (bookingId) => {
      console.log(bookingId);
      try {
        const res = await axios.delete(`http://localhost:8888/bookings/${bookingId}`, { 
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        setRefresh((prev) => !prev);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.error);  // Set error message if server responds with an error
        } else {
          console.log('An error occurred while fetching the bookings.');
        }
      } 
    }

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
      }, [token, refresh]); 


    const card = (booking) => (
        <React.Fragment>
        <CardContent>
        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, fontWeight: 'bold' }}>
            {booking.name}
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{booking.email}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Start time: {moment(booking.startTime).format('dddd, MMMM Do YYYY, h:mm:ss A')} 
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            End time: {moment(booking.endTime).format('dddd, MMMM Do YYYY, h:mm:ss A')}
        </Typography>
        {new Date(booking.endTime )> new Date() && 
        <Box sx={{mt: 1}}>
          <Button sx={{mr: 2}}>update</Button>
          <Button color='error' onClick={() => handleDeleteBooking(booking._id)}>cancel</Button>

        </Box>
        
        }

        </CardContent>
    </React.Fragment>
    );

  return (
    <Box sx={{flexGrow: 1, p: 4}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h4" sx={{fontWeight: 'bold'}}> My Bookings </Typography>

        </Box>

        <Box sx={{py: 2}}>
            <Typography variant="h6"> Existing Bookings </Typography>
            <Box sx={{ py: 1, display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {bookings.filter(booking => new Date(booking.endTime )> new Date()) ? bookings.filter(booking => new Date(booking.endTime) > new Date()).map((booking) => (<Card key={booking._id} variant="outlined" sx={{minWidth: '200px', minHeight: '200px', mx: 1}}>{card(booking)}</Card>)) : <></>}
            </Box>   
        </Box>

        <Box sx={{py: 2}}>
            <Typography variant="h6"> Expired Bookings </Typography>
            <Box sx={{ py: 1, display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
            {bookings.filter(booking => new Date(booking.endTime ) < new Date()) ? bookings.filter(booking => new Date(booking.endTime) < new Date()).map((booking) => (<Card key={booking._id} variant="outlined" sx={{minWidth: '200px', minHeight: '200px', mx: 1}}>{card(booking)}</Card>)) : <></>}
            </Box>   
        </Box>

    </Box>
  )
}
