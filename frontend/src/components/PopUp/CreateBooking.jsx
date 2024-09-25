import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, duration } from '@mui/material';
import axios from 'axios';

const ListingDetailsDialog = ({ open, onClose, listing }) => {

  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    date: '',
    duration: '',
    address: listing.address
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      address: listing.address, // Update address in state when the prop changes
    }));
  }, [listing.address]);

  const handleBookingSubmit = async () => {
    console.log('Booking Details:', bookingDetails);
    if(bookingDetails.name && bookingDetails.date && duration) {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post("http://localhost:8888/bookings/new", bookingDetails, { 
                headers: {Authorization: `Bearer ${token}` } 
            });
    
            if(res.status === 200) {
                console.log("new listing created!")
            } 
            onClose();    // Close the dialog after submission
    
        } catch(error) {
            console.log(error.response.data.error);
        }

    } else {
        alert("Please fill all fields!")
    }

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Listing Details</DialogTitle>
      <DialogContent>
        {/* Display listing details */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box
            component="img"
            sx={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '8px',
              mr: 2,
            }}
            alt="Listing thumbnail"
            src={listing.thumbnail}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {listing.title}
            </Typography>
            <Typography>{listing.address}</Typography>
            <Typography>
              Price: $<Box component="span" sx={{ fontWeight: 'bold' }}>{listing.price}</Box>/h
            </Typography>
          </Box>
        </Box>

        {/* Additional listing description */}
        <Box mt={2}>
          <Typography variant="body1">Description:</Typography>
          <Typography variant="body2" color="text.secondary">
            {listing.description || 'No description available'}
          </Typography>
        </Box>

        {/* Booking Form */}
        <Box mt={3}>
          <Typography variant="h6">Book this listing</Typography>
          <TextField
            label="Your Name"
            name="name"
            fullWidth
            margin="normal"
            value={bookingDetails.name}
            onChange={handleChange}
          />
          <TextField
            label="Date"
            type="date"
            name="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={bookingDetails.date}
            onChange={handleChange}
          />
          <TextField
            label="Duration (hours)"
            name="duration"
            fullWidth
            margin="normal"
            value={bookingDetails.duration}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleBookingSubmit} variant="contained" color="primary">
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListingDetailsDialog;