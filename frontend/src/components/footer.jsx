import React from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" className="py-3" >
        <Container maxWidth={false}>
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
            <Typography variant="body1" className="text-gray-700">
                © 2024 AnyParking. All Rights Reserved.
            </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className="text-right">
            </Grid>
        </Grid>
        </Container>
    </Box>
  )
}
