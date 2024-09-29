import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const ConsumerProfile = () => {
  const username = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  // State for form values
  const [formValues, setFormValues] = useState({
    name: null,
    phone: null,
    address: null,
    cardNumber: null, // Default masked card number
    expiryDate: null, // Default expiry date
    cvv: null // Default masked CVV
  });

  // State to track which fields are editable
  const [editableFields, setEditableFields] = useState({
    name: false,
    phone: false,
    address: false,
    cardNumber: false,
    expiryDate: false,
    cvv: false
  });

  useEffect(()=>{
    const fetchdata = async () => {
      try {
        const res = await axios.get(`http://localhost:8888/user/details`, { 
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        const userDetail = res.data;
        // set formValues using userDetail
        setFormValues({
          name: userDetail.name || '',
          phone: userDetail.phone || '',
          address: userDetail.address || '',
          cardNumber: userDetail.cardNumber || '', // Show only the last 4 digits
          expiryDate: userDetail.expiryDate || '',
          cvv: '***' // Masked CVV for security
        });
      } catch(error) {
        console.log(error.response ? error.response.data : error.message);
      }
    }

    fetchdata();
  }, [token])

  // Handle input change for form values
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Toggle the edit state for a specific field
  const toggleEdit = async (field) => {
    if (editableFields[field]) {
      console.log(`Updated ${field}:`, formValues[field]);
      // Add logic here to submit the updated data to your backend API
      try {
        const response = await axios.put(`http://localhost:8888/user/details`, formValues, { 
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log('User details updated:', response.data);
      } catch (error) {
        console.error('Error updating user details:', error.response ? error.response.data : error.message);
      }
    }
    setEditableFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <Box
      component="form"
      sx={{
        flexGrow: 1, 
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        mt: 5,
      }}
    >
      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        username: {username}
      </Typography>

      {/* Name Field */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {editableFields.name ? (
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            fullWidth
            value={formValues.name}
            onChange={handleChange}
          />
        ) : (
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <strong>Name:</strong> {formValues.name ? formValues.name : "Not provided"}
          </Typography>
        )}
        <IconButton
          onClick={() => toggleEdit('name')}
          sx={{ ml: 1 }}
          color={editableFields.name ? 'primary' : 'default'}
        >
          {editableFields.name ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>


      {/* Phone Field */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {editableFields.phone ? (
          <TextField
            label="Phone Number"
            type="tel"
            variant="outlined"
            name="phone"
            fullWidth
            value={formValues.phone}
            onChange={handleChange}
          />
        ) : (
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <strong>Phone:</strong> {formValues.phone ? formValues.phone : "Not provided"}
          </Typography>
        )}
        <IconButton
          onClick={() => toggleEdit('phone')}
          sx={{ ml: 1 }}
          color={editableFields.phone ? 'primary' : 'default'}
        >
          {editableFields.phone ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* Address Field */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {editableFields.address ? (
          <TextField
            label="Address"
            variant="outlined"
            name="address"
            fullWidth
            multiline
            rows={3}
            value={formValues.address}
            onChange={handleChange}
          />
        ) : (
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <strong>Address:</strong> {formValues.address ? formValues.address : "Not provided"}
          </Typography>
        )}
        <IconButton
          onClick={() => toggleEdit('address')}
          sx={{ ml: 1 }}
          color={editableFields.address ? 'primary' : 'default'}
        >
          {editableFields.address ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* Card Number Field */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {editableFields.cardNumber ? (
          <TextField
            label="Card Number"
            variant="outlined"
            name="cardNumber"
            fullWidth
            placeholder='**** **** **** 1234'
            value={formValues.cardNumber}
            onChange={handleChange}
            inputProps={{ maxLength: 19 }} // Limit to 19 characters (including spaces)
          />
        ) : (
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <strong>Card Number:</strong> {formValues.cardNumber ? formValues.cardNumber : "Not provided"}
          </Typography>
        )}
        <IconButton
          onClick={() => toggleEdit('cardNumber')}
          sx={{ ml: 1 }}
          color={editableFields.cardNumber ? 'primary' : 'default'}
        >
          {editableFields.cardNumber ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* Expiry Date and CVV in one line */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* Expiry Date Field */}
        <Box sx={{ flex: 1 }}>
          {editableFields.expiryDate ? (
            <TextField
              label="Expiry Date"
              variant="outlined"
              name="expiryDate"
              fullWidth
              placeholder="e.g. 04/21"
              value={formValues.expiryDate}
              onChange={handleChange}
              inputProps={{ maxLength: 5 }} // Limit to 5 characters (MM/YY)
            />
          ) : (
            <Typography variant="body1">
              <strong>Expiry Date:</strong> {formValues.expiryDate ? formValues.expiryDate : "Not provided"}
            </Typography>
          )}
        </Box>

        {/* CVV Field */}
        <Box sx={{ flex: 1 }}>
          {editableFields.cvv ? (
            <TextField
              label="CVV"
              variant="outlined"
              name="cvv"
              fullWidth
              value={formValues.cvv}
              placeholder="e.g. ***"
              onChange={handleChange}
              inputProps={{ maxLength: 3 }} // Limit to 3 characters
              type="password" // Mask the CVV
            />
          ) : (
            <Typography variant="body1">
              <strong>CVV:</strong> {formValues.cvv ? formValues.cvv : "Not provided"}
            </Typography>
          )}
        </Box>

        {/* Save/Edit Icons for both Expiry and CVV */}
        <IconButton
          onClick={() => {
            toggleEdit('expiryDate');
            toggleEdit('cvv');
          }}
          sx={{ ml: 1 }}
          color={
            editableFields.expiryDate || editableFields.cvv ? 'primary' : 'default'
          }
        >
          {editableFields.expiryDate || editableFields.cvv ? (
            <SaveIcon />
          ) : (
            <EditIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ConsumerProfile;