import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Radio, RadioGroup, FormControlLabel, FormControl} from '@mui/material';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const ListingDetailsDialog = ({ open, onClose, listing }) => {

  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingDetails, setBookingDetails] = useState({
    type: 'day',
    name: '',
    date: new Date(), // Default to today's date
    time: new Date(),
    duration: '',
    listingId: listing._id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  // Handle changes for DatePicker and TimePicker
  const handleDateChange = (newDate) => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      date: newDate,
    }));
  };

  const handleTimeChange = (newTime) => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      time: newTime,
    }));
  };

  useEffect(() => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      listingId: listing._id, // Update address in state when the prop changes
    }));
  }, [listing._id]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      if (bookingDetails.type === 'hour') {
        total = bookingDetails.duration * listing.pricePerHour;
      } else if (bookingDetails.type === 'day') {
        total = bookingDetails.duration * listing.pricePerDay;
      }
      setTotalPrice(total.toFixed(2)); // Update total price
    };
    calculateTotalPrice(bookingDetails.type, bookingDetails.duration);
  }, [bookingDetails.duration, bookingDetails.type, listing])

  const handleBookingSubmit = async () => {
    if(bookingDetails.name && bookingDetails.date && bookingDetails.time && bookingDetails.duration) {
        const token = localStorage.getItem("token");
        const startTime = new Date(`${bookingDetails.date}T${bookingDetails.time}`); // Combine date and time into a full datetime
        const endTime = new Date(startTime.getTime() + bookingDetails.duration * 60 * 60 * 1000);
        const bookingData = {
          name: bookingDetails.name,
          startTime,
          endTime,
          listingId: bookingDetails.listingId
        };
        console.log(bookingData);
        try {
            const res = await axios.post("http://localhost:8888/bookings/new", bookingData, { 
                headers: {Authorization: `Bearer ${token}` } 
            });
    
            if(res.status === 200) {
                console.log("new listing created!")
            } 
            onClose();    // Close the dialog after submission
    
        } catch(error) {
            alert(error.response.data.error);
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
              flexShrink: 0,
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
              Price: $<Box component="span" sx={{ fontWeight: 'bold' }}>{listing.pricePerHour}</Box>/h   &nbsp;&nbsp;&nbsp;&nbsp;
              $<Box component="span" sx={{ fontWeight: 'bold' }}>{listing.pricePerDay}</Box>/day
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box mt={3}>
          <Typography variant="h6">Book this listing</Typography>
          {/* Booking Type Selection */}
          <FormControl>
            <RadioGroup row name="type" value={bookingDetails.type} onChange={handleChange}>
              <FormControlLabel value="hour" control={<Radio />} label="By Hour" />
              <FormControlLabel value="day" control={<Radio />} label="By Day" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Your Name"
            name="name"
            fullWidth
            margin="normal"
            value={bookingDetails.name}
            onChange={handleChange}
          />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <DatePicker
            label="Select Date"
            value={bookingDetails.date}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
              },
            }}
          />

        {/* Time Picker (only if booking by hour) */}
        {bookingDetails.type === 'hour' && (
          <TimePicker
            label="Select Time"
            value={bookingDetails.time}
            onChange={handleTimeChange}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
              },
            }}
          />
        )}


        </Box>
          <TextField
            label={bookingDetails.type === 'hour' ? "Duration (hours)" : "Duration (days)"}
            name="duration"
            fullWidth
            margin="normal"
            value={bookingDetails.duration}
            onChange={handleChange}
          />
        </Box>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Price: ${totalPrice}
          </Typography>
        </LocalizationProvider>
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