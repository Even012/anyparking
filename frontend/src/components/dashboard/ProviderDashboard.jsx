import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CreateListing from '../PopUp/CreateListing';
import axios from 'axios';
import UpdateListingDialog from '../PopUp/UpdateListing';

export default function ProviderDashboard() {
    const [open, setOpen] = React.useState(false);      // open the create-listing window
    const [openEdit, setOpenEdit] = React.useState(false);      // open the update-listing window
    const [listings, setListings] = React.useState(null);   
    const [selectedListing, setSelectedListing] = React.useState(null);
    const [refresh, setRefresh] = React.useState(false);

    const token = localStorage.getItem("token");

    React.useEffect(() => {
        const fetchListings = async () => {
          try {
            const res = await axios.get("http://localhost:8888/listings/all", { 
              headers: { Authorization: `Bearer ${token}` }
            });
    
            if (res.status === 200) {
              setListings(res.data);  // Store the listings in the state, should filter out my listing in real case ***
            }
          } catch (error) {
            if (error.response) {
              console.log(error.response.data.error);  // Set error message if server responds with an error
            } else {
              console.log('An error occurred while fetching the listings.');
            }
          }
        };
    
        fetchListings();
      }, [token, open, openEdit, refresh]); 

    const handleUnpublish = async (listingId) => {
      try {
        const res = await axios.put(`http://localhost:8888/listings/${listingId}/unpublish`, {}, { 
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

    const handlePublish = async (listingId) => {
      try {
        const res = await axios.put(`http://localhost:8888/listings/${listingId}/publish`, {}, { 
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

    const card = (listing) => (
        <React.Fragment>
        <CardContent>
        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, fontWeight: 'bold' }}>
            {listing.title}
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{listing.address}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            ${listing.pricePerHour}
        </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => {setOpenEdit(true); setSelectedListing(listing)}}>update</Button>
          {listing.metadata.public === true 
            ? 
          (<Button size="small" onClick={() => { handleUnpublish(listing._id); }}>unpublish</Button>)
            :
          (<Button size="small" onClick={() => { handlePublish(listing._id); }}>publish</Button>)
          }
        </CardActions>
    </React.Fragment>
    );

  return (
    <Box sx={{flexGrow: 1, p: 4}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h4" sx={{fontWeight: 'bold'}}> My Listings </Typography>
            <Button variant='contained' onClick={() => { setOpen(true); }}>Create Listing</Button>
        </Box>

        <Box sx={{py: 2}}>
            <Typography variant="h6"> Public Listings </Typography>
            <Box sx={{ py: 1, display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {listings ? listings.filter(listing => listing.metadata.public === true ).map((listing) => (<Card key={listing._id} variant="outlined" sx={{minWidth: '300px', minHeight: '200px', mx: 1}}>{card(listing)}</Card>)) : <></>}
            </Box>   
        </Box>

        <Box sx={{py: 2}}>
            <Typography variant="h6"> Private Listings </Typography>
            <Box sx={{ py: 1, display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
              {listings ? listings.filter((listing) => listing.metadata.public === false ).map((listing) => (<Card key={listing._id} variant="outlined" sx={{minWidth: '300px', minHeight: '200px', mx: 1}}>{card(listing)}</Card>)) : <></>}
            </Box>   
        </Box>

        <CreateListing open={open} setOpen={setOpen}/>
        <UpdateListingDialog open={openEdit} onClose={()=>{setOpenEdit(false);}} listing={selectedListing}/>
    </Box>
  )
}
