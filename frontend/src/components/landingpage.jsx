import {useState} from 'react';
import { Typography, Container, Box, TextField, Button, Grid, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const cities = [
  { name: 'Sydney', img: 'https://images.luxuryescapes.com/q_auto:eco/ykj287ffgcjqr9486w5c' },
  { name: 'Melbourne', img: 'https://www.godsavethepoints.com/wp-content/uploads/2017/10/Amazing_City_View_of_Melbourne_Australia_HD_Photos.jpg' },
  { name: 'Brisbane', img: 'https://www.brightonhomes.net.au/sites/default/files/styles/blog_hero_banner/public/best-brisbane-suburbs-for-families-in-2022.jpg?itok=AiBZM1VS' },
  { name: 'Cairns', img: 'https://www.fitzroyisland.com/wp-content/uploads/2019/02/What-is-the-Best-Time-of-Year-to-Visit-Cairns-703x469.jpg' },
  { name: 'Tasmania', img: 'https://www.discovertasmania.com.au/siteassets/experiences/top-10-things-to-do/113184-2.jpg?resize=HePFh0SveoM39WGdn6-4tPIsJfGEM22GdpeVT9Cu5uvrZEzlt9ihJ9GTCEyUJ5kxEbqqgRlXMOSf6JOzlRstOA' },
  { name: 'Canberra', img: 'https://canberra.com.au/_next/image?url=https%3A%2F%2Fcms.canberra.com.au%2Fwp-content%2Fuploads%2F2023%2F01%2F108210-56-HEADER.jpg&w=3840&q=75' },
  { name: 'Perth', img: 'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/perthau/Elizabeth-Quay-Perth-Aerial-Day_20EBD597-5056-A36A-0C94E88061AF0DB8-20ebd4565056a36_20ebd5fa-5056-a36a-0cdcb26f03782625.jpg' },
  { name: 'Adeleide', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Adelaide_skyline%2C_December_2022.jpg/640px-Adelaide_skyline%2C_December_2022.jpg' },
];


const VisitorLandingPage = () => {
  
  const navigate = useNavigate();
  const handleClick = (cityName) => {
    navigate('/consumer/browse', { state: { city: cityName } });
  }

  const [searchQuery, setSearchQuery] = useState(''); // State to store input value

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update state with input value
  };

  // Handle search submission
  const handleSearchClick = () => {
    if (searchQuery) {
      navigate('/consumer/browse', { state: { city: searchQuery } });
    } else {
      alert('Please enter a location to search.');
    }
  };


  return (
    <>
      {/* Main Content */}
      <Container className="text-center" sx={{flexGrow: 1}} maxWidth={false}>
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
          {/* Search Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', my: '30px' }}>
            <TextField
              label="Input place to explore parking"
              variant="outlined"
              fullWidth
              onChange={handleInputChange} 
              sx={{ maxWidth: '750px', marginRight: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSearchClick} sx={{ height: '55px', minWidth: '100px' }}>
              Search
            </Button>
          </Box>

          {/* City Cards */}
          <Grid container spacing={4} justifyContent="center">
            {cities.map((city) => (
              <Grid item xs={12} sm={6} md={3} key={city.name}>
                <Card onClick={() => handleClick(city.name)}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      sx={{
                        width: '100%',
                        height: '160px', // Fix the height of the image
                        objectFit: 'cover' // Ensure the image covers the entire area without distortion
                      }}
                      image={city.img}
                      alt={city.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {city.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      
      </Container>
    </>
  );
};

export default VisitorLandingPage;