import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import login_img from "../../assets/login2.png";
import MapComponent from "../Map/Map";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function VisitorDashboard() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Determine flex direction and width based on screen size
    const flexDirection = isSmallScreen ? 'column-reverse' : 'row';
    const leftBoxWidth = isSmallScreen ? '100%' : '33%';
    const rightBoxWidth = isSmallScreen ? '100%' : '67%';

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: flexDirection}}>
      {/* LEFT PART (LISTINGS QUERY RESULT) */}
      <Box sx={{ width: leftBoxWidth, height: isSmallScreen ? '50vh' : 'auto', padding: '16px', backgroundColor: '#F0F6E8', overflowY: 'auto' }}>
        
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'space-evenly'}}>
            <Grid item xs={12} md={6} sx={{backgroundColor: '#F9FCF4', padding: 1, borderRadius: '8px', m: 1}}>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", maxWidth: '250px'}}>
                    <Box
                      component="img"
                      sx={{
                          width: '80px',  // Set the fixed width
                          height: '80px', // Set the fixed height
                          objectFit: 'cover', // Ensure the image covers the box without distortion
                          borderRadius: '8px', // Optional: add rounded corners
                          mr: 1,
                      }}
                      alt="car image"
                      src={login_img} // Image source
                    />
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <Typography>KentSt, Sydney, NSW 2000</Typography>
                        <Typography>
                            $<Box component="span" sx={{ fontWeight: 'bold' }}>6</Box>/h
                        </Typography>
                    </Box>

                    
                </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{backgroundColor: '#F9FCF4', padding: 1, borderRadius: '8px', m: 1,}}>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", maxWidth: '250px'}}>
                    <Box
                      component="img"
                      sx={{
                          width: '80px',  // Set the fixed width
                          height: '80px', // Set the fixed height
                          objectFit: 'cover', // Ensure the image covers the box without distortion
                          borderRadius: '8px', // Optional: add rounded corners
                          mr: 1,
                      }}
                      alt="car image"
                      src={login_img} // Image source
                    />
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <Typography>KentSt, Sydney, NSW 2000</Typography>
                        <Typography>
                            $<Box component="span" sx={{ fontWeight: 'bold' }}>6</Box>/h
                        </Typography>
                    </Box>

                    
                </Box>
            </Grid>

        </Grid>
      </Box>

      {/* RIGHT PART (MAP) */}
      <Box sx={{ width: rightBoxWidth, height: isSmallScreen ? '50vh' : 'auto', }}>
        <MapComponent/>
      </Box>

    </Box>
  );
}

export default VisitorDashboard;

