import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function NavBar() {

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  const pages = !token ? ['Home', 'Login'] : (role === "provider" ? ['Home', 'My Listings'] : ['Home', 'Explore Parking']); 

  const settings = token ? ['Profile', 'Logout'] : []; // visitor - no setting option
  
  
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickPage = (page) => {
    if (page === 'Home') {
      navigate('/');
    } else if (page === 'Login') {
      navigate('/login');
    } else if (page === 'Explore Parking') {
      console.log(page);
    } else {
      navigate('/provider/dashboard');
    }
  }
  const handleClickSetting = async (page) => {
    handleCloseUserMenu();
    if (page === 'Profile') {
      navigate('/profile');
    } else if (page === 'Logout') {
      try {
        const res = await axios.post("http://localhost:8888/user/auth/logout/", {}, 
          { headers: {Authorization: `Bearer ${token}` } }
        );
        if(res.status === 200) {
          navigate('/login');
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
        } 
      } catch(error) {
        console.log(error.response.data.error);
      }
    } 
  }
  return (
    <AppBar position="static" sx={{ backgroundColor: '#00A47C' }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters >
          <svg className='hidden md:flex' width="22" height="32" viewBox="0 0 332 532" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M154.5 0.487805C152.85 0.680805 147.225 1.3338 142 1.9408C123.695 4.0648 105.906 9.6938 86.745 19.4238C65.833 30.0428 48.461 44.5138 33.8 63.5248C11.919 91.8988 0.001 126.751 0 162.365C0 201.943 7.17101 222.191 47.984 297.839C64.263 328.013 67.63 333.812 111.845 407.839C147.841 468.106 158.766 485.493 163.23 489.622C168.084 494.11 172.113 490.411 184.019 470.535C193.569 454.592 209.062 427.92 222.18 404.839C227.963 394.664 235.913 381.094 239.847 374.683C243.781 368.272 247 362.792 247 362.504C247 362.217 248.518 359.363 250.373 356.161C269.603 322.972 299.918 267.279 308.79 248.839C319.33 226.933 323.199 216.743 328.153 197.839C331.369 185.571 331.43 184.93 331.465 163.339C331.496 144.014 331.218 140.019 329.176 130.483C326.047 115.864 322.757 106.368 316.48 93.8388C290.226 41.4318 244.949 8.4488 189.542 1.3668C178.736 -0.0141969 162.336 -0.425195 154.5 0.487805ZM191.906 27.4348C203.138 29.3888 218.59 34.6048 229.644 40.1728C256.633 53.7678 281.03 79.6078 293.568 107.882C299.148 120.465 303.514 136.734 304.981 150.41C308.232 180.725 296.17 218.863 275.013 245.162C253.296 272.158 223.745 289.696 189.575 295.866C140.112 304.798 85.213 282.603 54.025 241.066C44.326 228.147 37.402 214.867 32.562 199.895C27.738 184.972 26.68 176.11 27.261 155.491C27.666 141.113 28.167 136.784 30.359 128.723C45.797 71.9708 93.761 31.3938 152 25.8158C162.824 24.7798 180.851 25.5108 191.906 27.4348ZM131.5 63.8138C120.739 65.6148 112.329 70.2368 105.358 78.1848C100.941 83.2208 88.428 104.495 84.763 113.202C82.44 118.718 81.984 119.174 77.046 120.913C63.009 125.856 54.407 138.141 53.26 154.88C52.667 163.523 55.006 173.316 59.763 182.113C62.117 186.468 69.232 194.102 73.082 196.406C74.245 197.102 74.917 200.36 75.72 209.215C76.675 219.733 77.127 221.562 79.674 225.215C83.652 230.918 87.908 232.836 96.593 232.837C111.136 232.841 116.691 226.698 117.719 209.479L118.285 199.996L122.892 200.108C125.427 200.171 146.85 200.114 170.5 199.984L213.5 199.746L214.272 206.043C214.697 209.506 215.279 214.193 215.564 216.459C216.27 222.056 220.916 229.097 225.266 231.161C229.296 233.073 239.37 233.407 243.685 231.772C247.268 230.415 250.599 227.342 253.62 222.609C255.77 219.239 256 217.775 256 207.467C256 196.33 256.056 196.042 258.345 195.467C261.901 194.575 271.445 184.871 274.257 179.289C281.158 165.592 280.239 147.129 271.974 133.409C267.744 126.386 263.155 122.584 256.138 120.289C253.217 119.334 250.567 117.829 250.248 116.946C249.123 113.825 235.596 90.2288 230.221 82.0138C224.264 72.9078 219.766 69.0628 211.145 65.7058C205.776 63.6158 203.815 63.4948 171 63.2428C152.025 63.0968 134.25 63.3538 131.5 63.8138ZM205.754 87.7928C208.577 89.3978 211.3 92.2518 213.85 96.2748C219.59 105.334 227 117.561 227 117.975C227 118.175 199.74 118.22 166.422 118.074C133.104 117.928 105.991 117.422 106.172 116.951C107.913 112.403 118.13 94.9068 120.356 92.6618C123.549 89.4408 128 86.8968 132.5 85.7198C134.15 85.2888 150.35 85.0348 168.5 85.1548C201.373 85.3738 201.516 85.3838 205.754 87.7928ZM105.183 144.434C112.338 148.133 116.872 156.886 115.081 163.539C112.405 173.476 105.152 179.147 95.848 178.574C89.053 178.155 84.063 174.843 80.907 168.658C72.928 153.016 89.603 136.377 105.183 144.434ZM244.634 144.758C255.466 151.362 257.043 165.969 247.847 174.522C239.98 181.84 226.395 179.68 220.052 170.103C215.32 162.96 216.395 155.031 223.051 147.983C228.001 142.741 238.704 141.141 244.634 144.758ZM193.727 488.152C184.282 504.378 177.443 510.011 167.081 510.099C156.506 510.19 147.817 502.94 139.135 486.785L136.208 481.339L124.354 481.627C110.1 481.973 98.638 483.151 78 486.39C50.478 490.71 34.01 496.497 29.857 503.307C27.433 507.28 27.475 507.546 31.048 510.883C36.527 516.002 56.689 522.371 79.781 526.279C97.879 529.342 122.662 530.989 158.5 531.512C189.247 531.961 198.221 531.736 220 529.973C266.253 526.23 300.237 517.738 305.064 508.719C308.399 502.488 295.084 494.573 273.31 489.843C260 486.951 232.521 483.141 215.5 481.828C207.8 481.233 200.825 480.568 200 480.349C198.991 480.081 196.937 482.636 193.727 488.152Z" fill="white"/>
          </svg>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mx: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AnyParking
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleClickPage(page)}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <svg className='flex md:hidden' width="22" height="32" viewBox="0 0 332 532" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M154.5 0.487805C152.85 0.680805 147.225 1.3338 142 1.9408C123.695 4.0648 105.906 9.6938 86.745 19.4238C65.833 30.0428 48.461 44.5138 33.8 63.5248C11.919 91.8988 0.001 126.751 0 162.365C0 201.943 7.17101 222.191 47.984 297.839C64.263 328.013 67.63 333.812 111.845 407.839C147.841 468.106 158.766 485.493 163.23 489.622C168.084 494.11 172.113 490.411 184.019 470.535C193.569 454.592 209.062 427.92 222.18 404.839C227.963 394.664 235.913 381.094 239.847 374.683C243.781 368.272 247 362.792 247 362.504C247 362.217 248.518 359.363 250.373 356.161C269.603 322.972 299.918 267.279 308.79 248.839C319.33 226.933 323.199 216.743 328.153 197.839C331.369 185.571 331.43 184.93 331.465 163.339C331.496 144.014 331.218 140.019 329.176 130.483C326.047 115.864 322.757 106.368 316.48 93.8388C290.226 41.4318 244.949 8.4488 189.542 1.3668C178.736 -0.0141969 162.336 -0.425195 154.5 0.487805ZM191.906 27.4348C203.138 29.3888 218.59 34.6048 229.644 40.1728C256.633 53.7678 281.03 79.6078 293.568 107.882C299.148 120.465 303.514 136.734 304.981 150.41C308.232 180.725 296.17 218.863 275.013 245.162C253.296 272.158 223.745 289.696 189.575 295.866C140.112 304.798 85.213 282.603 54.025 241.066C44.326 228.147 37.402 214.867 32.562 199.895C27.738 184.972 26.68 176.11 27.261 155.491C27.666 141.113 28.167 136.784 30.359 128.723C45.797 71.9708 93.761 31.3938 152 25.8158C162.824 24.7798 180.851 25.5108 191.906 27.4348ZM131.5 63.8138C120.739 65.6148 112.329 70.2368 105.358 78.1848C100.941 83.2208 88.428 104.495 84.763 113.202C82.44 118.718 81.984 119.174 77.046 120.913C63.009 125.856 54.407 138.141 53.26 154.88C52.667 163.523 55.006 173.316 59.763 182.113C62.117 186.468 69.232 194.102 73.082 196.406C74.245 197.102 74.917 200.36 75.72 209.215C76.675 219.733 77.127 221.562 79.674 225.215C83.652 230.918 87.908 232.836 96.593 232.837C111.136 232.841 116.691 226.698 117.719 209.479L118.285 199.996L122.892 200.108C125.427 200.171 146.85 200.114 170.5 199.984L213.5 199.746L214.272 206.043C214.697 209.506 215.279 214.193 215.564 216.459C216.27 222.056 220.916 229.097 225.266 231.161C229.296 233.073 239.37 233.407 243.685 231.772C247.268 230.415 250.599 227.342 253.62 222.609C255.77 219.239 256 217.775 256 207.467C256 196.33 256.056 196.042 258.345 195.467C261.901 194.575 271.445 184.871 274.257 179.289C281.158 165.592 280.239 147.129 271.974 133.409C267.744 126.386 263.155 122.584 256.138 120.289C253.217 119.334 250.567 117.829 250.248 116.946C249.123 113.825 235.596 90.2288 230.221 82.0138C224.264 72.9078 219.766 69.0628 211.145 65.7058C205.776 63.6158 203.815 63.4948 171 63.2428C152.025 63.0968 134.25 63.3538 131.5 63.8138ZM205.754 87.7928C208.577 89.3978 211.3 92.2518 213.85 96.2748C219.59 105.334 227 117.561 227 117.975C227 118.175 199.74 118.22 166.422 118.074C133.104 117.928 105.991 117.422 106.172 116.951C107.913 112.403 118.13 94.9068 120.356 92.6618C123.549 89.4408 128 86.8968 132.5 85.7198C134.15 85.2888 150.35 85.0348 168.5 85.1548C201.373 85.3738 201.516 85.3838 205.754 87.7928ZM105.183 144.434C112.338 148.133 116.872 156.886 115.081 163.539C112.405 173.476 105.152 179.147 95.848 178.574C89.053 178.155 84.063 174.843 80.907 168.658C72.928 153.016 89.603 136.377 105.183 144.434ZM244.634 144.758C255.466 151.362 257.043 165.969 247.847 174.522C239.98 181.84 226.395 179.68 220.052 170.103C215.32 162.96 216.395 155.031 223.051 147.983C228.001 142.741 238.704 141.141 244.634 144.758ZM193.727 488.152C184.282 504.378 177.443 510.011 167.081 510.099C156.506 510.19 147.817 502.94 139.135 486.785L136.208 481.339L124.354 481.627C110.1 481.973 98.638 483.151 78 486.39C50.478 490.71 34.01 496.497 29.857 503.307C27.433 507.28 27.475 507.546 31.048 510.883C36.527 516.002 56.689 522.371 79.781 526.279C97.879 529.342 122.662 530.989 158.5 531.512C189.247 531.961 198.221 531.736 220 529.973C266.253 526.23 300.237 517.738 305.064 508.719C308.399 502.488 295.084 494.573 273.31 489.843C260 486.951 232.521 483.141 215.5 481.828C207.8 481.233 200.825 480.568 200 480.349C198.991 480.081 196.937 482.636 193.727 488.152Z" fill="white"/>
          </svg>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mx: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AnyParking
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleClickPage(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {settings.length!==0 && (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{user[0].toUpperCase()}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser || null}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser || null)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={ () => handleClickSetting(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
