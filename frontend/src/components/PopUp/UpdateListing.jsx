import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const UpdateListingDialog = ({ open, onClose, listing }) => {
  // State to hold the updated listing data
  const [listingData, setListingData] = useState({
    title: '',
    address: '',
    pricePerHour: null,
    pricePerDay: null,
    thumbnail: "https://gumtreeau-res.cloudinary.com/image/private/t_$_s-l400/gumtree/9f6bfdcc-274f-4b4f-8ba2-b6c909d59171.jpg", // Default image path
    metadata: {
      host_email: '',
      availableFrom: null,
      availableUntil: null,
      coordinates: null
    },
  });

  // Populate the dialog with existing listing details when it opens
  useEffect(() => {
    if (listing) {
      setListingData({
        title: listing.title,
        address: listing.address,
        pricePerHour: listing.pricePerHour,
        pricePerDay: listing.pricePerDay,
        thumbnail: listing.thumbnail || "https://gumtreeau-res.cloudinary.com/image/private/t_$_s-l400/gumtree/9f6bfdcc-274f-4b4f-8ba2-b6c909d59171.jpg",
        metadata: {
          host_email: listing.metadata.host_email,
          availableFrom: listing.metadata.availableFrom,
          availableUntil: listing.metadata.availableUntil,
          coordinates: listing.metadata.coordinates
        },
      });
    }
  }, [listing]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setListingData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle metadata field changes (nested in metadata object)
  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setListingData((prevData) => ({
      ...prevData,
      metadata: {
        ...prevData.metadata,
        [name]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log(listingData);  // Call parent function to handle the update
    try {
        const  token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:8888/listings/${listing._id}/update`, listingData,{ 
            headers: {Authorization: `Bearer ${token}` } 
        });

        if(res.status === 200) {
            console.log("listing updated!")
        } 
        onClose();

    } catch(error) {
        console.log(error.response.data.error);
    }
    onClose();  // Close the dialog
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Update Listing</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {/* Title */}
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            variant="outlined"
            value={listingData.title}
            onChange={handleChange}
          />

          {/* Address */}
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            variant="outlined"
            value={listingData.address}
            onChange={handleChange}
          />

          {/* Price Per Hour */}
          <TextField
            label="Price Per Hour"
            name="pricePerHour"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={listingData.pricePerHour}
            onChange={handleChange}
          />

          {/* Price Per Day */}
          <TextField
            label="Price Per Day"
            name="pricePerDay"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={listingData.pricePerDay}
            onChange={handleChange}
          />

          {/* Available From */}
          <TextField
            label="Available From"
            name="availableFrom"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={listingData.metadata.availableFrom?.split('T')[0] || ''}
            onChange={handleMetadataChange}
          />

          {/* Available Until */}
          <TextField
            label="Available Until"
            name="availableUntil"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={listingData.metadata.availableUntil?.split('T')[0] || ''}
            onChange={handleMetadataChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateListingDialog;