import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 
import axios from 'axios';

const CreateListing = ({ open, setOpen}) => {
  const locationIqAccessToken = 'pk.dadad7861429156330de883f13d575ee';
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const [listingData, setListingData] = useState({
    title: '',
    address: '',
    price: null,
    thumbnail: "https://gumtreeau-res.cloudinary.com/image/private/t_$_s-l400/gumtree/9f6bfdcc-274f-4b4f-8ba2-b6c909d59171.jpg", // Default image path
    metadata: {
      host_email: user,
      availableFrom: null,
      availableUntil: null,
      coordinates: null
    },
  });

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${locationIqAccessToken}&q=${encodeURIComponent(address)}&format=json`
      );
      
      // Assuming the first result is the most relevant
      const { lat, lon } = response.data[0];
      return [lon, lat];  // Return coordinates as [longitude, latitude]
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null; // Handle the error appropriately
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    if (listingData.address) {
      // Fetch coordinates only when submitting the form
      const coordinates = await fetchCoordinates(listingData.address);

      // If coordinates are successfully fetched, update the metadata coordinates
      if (coordinates) {
        setListingData((prevData) => ({
          ...prevData,
          metadata: {
            ...prevData.metadata,
            coordinates: coordinates, // Update with fetched coordinates
          },
        }));
        try {
            console.log(token);
            const res = await axios.post("http://localhost:8888/listings/new", listingData,{ 
                headers: {Authorization: `Bearer ${token}` } 
            });
    
            if(res.status === 200) {
                console.log("new listing created!")
            } 
            setOpen(false);  // Close the dialog after submission
    
        } catch(error) {
            console.log(error.response.data.error);
        }
      }
      console.log('Listing data:', listingData);
    }

  };

  // Handle form input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setListingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  return (
      <Dialog open={open} onClose={() => { setOpen(false); }} fullWidth maxWidth="sm">
        <DialogTitle>Create a New Listing</DialogTitle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DialogContent>
            <Grid container spacing={2}>
                {/* Title Input */}
                <Grid item xs={12}>
                <TextField
                    name="title"
                    label="Listing Title"
                    fullWidth
                    variant="outlined"
                    value={listingData.title}
                    onChange={handleChange}
                />
                </Grid>

                {/* Address Input */}
                <Grid item xs={12}>
                <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    variant="outlined"
                    value={listingData.address}
                    onChange={ handleChange }
                />
                </Grid>

                {/* Price Input */}
                <Grid item xs={12}>
                <TextField
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={listingData.price}
                    onChange={handleChange}
                />
                </Grid>

                {/* Available From Date */}
                <Grid item xs={12} sm={6}>
                    <DatePicker
                    label="Available From"
                    value={listingData.availableFrom}  // Controlled value (null initially)
                    onChange={(newValue) => {
                        setListingData((prevData) => ({
                            ...prevData,
                            metadata: {
                              ...prevData.metadata,  // Spread the current metadata so other fields are not lost
                              availableFrom: newValue,  // Dynamically update the specific field (availableFrom or availableUntil)
                            },
                          }));
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Grid>

                {/* Available Until Date */}
                <Grid item xs={12} sm={6}>
                    <DatePicker
                    label="Available Until"
                    value={listingData.availableUntil}  // Controlled value (null initially)
                    onChange={(newValue) => {
                        setListingData((prevData) => ({
                            ...prevData,
                            metadata: {
                              ...prevData.metadata,  // Spread the current metadata so other fields are not lost
                              availableUntil: newValue,  // Dynamically update the specific field (availableFrom or availableUntil)
                            },
                        }));
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Grid>
            </Grid>
            </DialogContent>
        </LocalizationProvider>

        <DialogActions>
          <Button onClick={ () => {setOpen(false); }} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default CreateListing;