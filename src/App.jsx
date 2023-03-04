import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import {
  AppBar,
  Avatar,
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/system';
import { onAuthStateChanged } from 'firebase/auth';
import { React, useEffect, useState } from 'react';
import './App.css';
import { auth } from './common/Firebase';
import ProfileModal from './components/ProfileModal';
import PurchaseOrder from './components/PurchaseOrder';

function App() {
  const themePref = localStorage.getItem('dark-mode-pref');
  const [form, selectForm] = useState(0);
  const [darkMode, setDarkMode] = useState(themePref === 'dark');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileImg, setProfileImg] = useState('');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? grey[100] : grey[900],
      },
      secondary: {
        main: darkMode ? grey[100] : grey[900],
      },
    },
  });

  const toggleDarkMode = () => {
    const newMode = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('dark-mode-pref', newMode);
  };

  const handleFormChange = (event) => {
    const selectedForm = event.target.value;
    selectForm(selectedForm);
    localStorage.setItem('lastForm', selectedForm);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(!profileModalOpen);
  };

  useEffect(() => {
    const lastForm = localStorage.getItem('lastForm');
    if (lastForm) {
      selectForm(lastForm);
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfileImg(user.photoURL);
      } else {
        setProfileImg('');
      }
    });
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        sx={{
          color: darkMode ? 'white' : 'black',
          background: darkMode ? '#808080' : '#D3D3D3',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography sx={{ flexGrow: 1 }}>EDI Translator</Typography>
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={toggleDarkMode}>
                {darkMode === 'light' ? (
                  <Brightness4Icon />
                ) : (
                  <Brightness4OutlinedIcon />
                )}
              </IconButton>
              <IconButton onClick={handleProfileClick}>
                {profileImg ? <Avatar src={profileImg} /> : <Avatar />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
        }}
      >
        <Grid
          container
          spacing={2}
          maxWidth="md"
          sx={{
            m: 1,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              textAlign: 'center',
            }}
          >
            <FormControl>
              <InputLabel>Form</InputLabel>
              <Select
                labelId="edi-form-select-label"
                id="edi-form-select-label"
                label="Form"
                value={form}
                onChange={handleFormChange}
              >
                <MenuItem value={0}>Select form</MenuItem>
                <MenuItem value={855004010}>855 (v004010)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {form == 855004010 && (
            <Grid item xs={12}>
              <PurchaseOrder />
            </Grid>
          )}
        </Grid>
        {profileModalOpen && (
          <ProfileModal
            profileModalOpen={profileModalOpen}
            setProfileModalOpen={setProfileModalOpen}
            auth={auth}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
