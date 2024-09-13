import React from 'react'
import { Box, Container, Grid, Link, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" className="bg-gray-100 py-6 mt-10">
        <Container>
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
            <Typography variant="body1" className="text-gray-700">
                © 2024 AnyParking. All Rights Reserved.
            </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className="text-right">
            <Link href="/contact" underline="none" className="text-gray-700">
                Contact Us
            </Link>
            <Link href="/privacy" underline="none" className="ml-4 text-gray-700">
                Privacy Policy
            </Link>
            </Grid>
        </Grid>
        </Container>
    </Box>
  )
}
