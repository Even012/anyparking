import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, Typography, Rating } from '@mui/material';
import axios from 'axios';

const ReviewPopupCard = ({ open, handleClose, listingId }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const onSubmit = async () => {
    // Handle form submission
    console.log({ reviewText, rating });
    const reviewData = { reviewText, rating };
    const token = localStorage.getItem("token");
    try {
        const res = await axios.put(`http://localhost:8888/listings/${listingId}/review`, reviewData, 
            { headers: {Authorization: `Bearer ${token}` } }
        );
        console.log(res);
    } catch(error) {
        console.log(error);
    }


    setReviewText('');  // Clear the form after submission
    setRating(0);       // Reset the rating
    handleClose();      // Close the dialog
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">Submit Your Review</Typography>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
          <Typography variant="body1">Rate this listing:</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
          <TextField
            label="Your Review"
            multiline
            rows={4}
            variant="outlined"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewPopupCard;