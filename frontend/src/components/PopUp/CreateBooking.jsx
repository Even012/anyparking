import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Radio, RadioGroup, FormControlLabel, FormControl} from '@mui/material';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';

const ListingDetailsDialog = ({ open, onClose, listing }) => {

  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingDetails, setBookingDetails] = useState({
    type: 'day',
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
    if(bookingDetails.date && bookingDetails.time && bookingDetails.duration) {


        const token = localStorage.getItem("token");
        const startTime = bookingDetails.type === 'hour' ? new Date(`${bookingDetails.date}T${bookingDetails.time}`) : new Date(`${bookingDetails.date}`); 
        const endTime = bookingDetails.type === 'hour' ? new Date(startTime.getTime() + bookingDetails.duration * 60 * 60 * 1000) : new Date(startTime.getTime() + bookingDetails.duration * 24 * 60 * 60 * 1000);
        
        
        if (startTime < new Date(listing.metadata.availableFrom) || endTime > new Date(listing.metadata.availableUntil) ) {
          alert("Watch out the availability and select a proper time slot!");
        } else {
          const bookingData = {
            name: listing.address,
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
          <Typography variant="body1">Availability:</Typography>
          <Typography variant="body2" color="text.secondary" sx={{fontWeight: 'bold'}}>
            {moment(listing.metadata.availableFrom).format('dddd, MMMM Do YYYY, h:mm:ss A')} - {moment(listing.metadata.availableUntil).format('dddd, MMMM Do YYYY, h:mm:ss A')}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
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