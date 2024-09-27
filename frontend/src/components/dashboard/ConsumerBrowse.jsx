import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import MapComponent from "../Map/Map";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from "axios";
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ListingDetailsDialog from "../PopUp/CreateBooking";

function ConsumerBrowse() {

    const [listings, setListings] = React.useState(null);   
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Determine flex direction and width based on screen size
    const flexDirection = isSmallScreen ? 'column-reverse' : 'row';
    const leftBoxWidth = isSmallScreen ? '100%' : '33%';
    const rightBoxWidth = isSmallScreen ? '100%' : '67%';

    const token = localStorage.getItem("token");
    const [flyToCoordinates, setFlyToCoordinates] = React.useState(null); // Store the coordinates for flying to a location


    const [open, setOpen] = React.useState(false);  // detial button
    const [selectedListing, setSelectedListing] = React.useState(null);

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
      }, [token]); 

    const listingBox = (listing) => (
      <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-left", backgroundColor: '#F9FCF4', m: 1, p: 1, borderRadius: 2}}>
        <Box
          component="img"
          sx={{
              width: '80px',  // Set the fixed width
              height: '80px', // Set the fixed height
              objectFit: 'cover', // Ensure the image covers the box without distortion
              borderRadius: '8px', // Optional: add rounded corners
              mr: 1,
              flexShrink: 0,
          }}
          alt="car image"
          src={listing.thumbnail} // Image source
        />
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <Typography sx={{fontSize: 15, fontWeight: 'bold'}}>{listing.title }</Typography>
            <Typography sx={{fontSize: 12}}>{listing.address }</Typography>
            <Typography>
                $<Box component="span" sx={{ fontWeight: 'bold' }}>{listing.pricePerHour}</Box>/h
            </Typography>
        </Box>
        <MoreHorizOutlinedIcon sx={{cursor: 'pointer', ml: 'auto'}} onClick={() => {setOpen(true); setSelectedListing(listing);}}/>
      </Box>
    )

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: flexDirection}}>
      {/* LEFT PART (LISTINGS QUERY RESULT) */}
      <Box sx={{ width: leftBoxWidth, height: isSmallScreen ? '50vh' : 'auto', padding: '16px', backgroundColor: '#F0F6E8', overflowY: 'auto' }}>
        
        <Stack spacing={2} sx={{display: 'flex', justifyContent: 'space-around'}}>
            <Stack>
              {listings && listings.map((listing) => (<Box key={listing._id} onClick={() => setFlyToCoordinates(listing.metadata.coordinates)}>{listingBox(listing)}</Box>))}
            </Stack>

        </Stack>
      </Box>
      { selectedListing && (<ListingDetailsDialog open={open} onClose={()=>{setOpen(false);}} listing={selectedListing} />) }
      {/* RIGHT PART (MAP) */}
      <Box sx={{ width: rightBoxWidth, height: isSmallScreen ? '50vh' : 'auto', }}>
        <MapComponent listings={listings} flyToCoordinates={flyToCoordinates}/>
      </Box>

    </Box>
  );
}

export default ConsumerBrowse;

