import GitHubIcon from '@mui/icons-material/GitHub';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { onAuthStateChanged } from 'firebase/auth';
import { React, useEffect, useState } from 'react';
import './App.css';
import { ediTranslatorForms, FORMS } from './common/Constants';
import { auth } from './common/Firebase';
import DarkModeToggleButton from './components/DarkModeToggleButton';
import EdiTranslatorBar from './components/EdiTranslatorBar';
import Form855 from './components/Form855';

function App() {
  const themePref = localStorage.getItem('dark-mode-pref');
  const lastForm = localStorage.getItem('lastForm');
  const [darkMode, setDarkMode] = useState(themePref === 'dark');
  const [form, selectForm] = useState(lastForm || 0);
  const [profileImg, setProfileImg] = useState(null);
  const [user, setUser] = useState(null);

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
    typography: {
      button: {
        fontWeight: 700,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            color: darkMode ? 'white' : 'black',
            background: darkMode ? '#696969' : '#D3D3D3',
          },
        },
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

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setProfileImg(authUser.photoURL);
        setUser(authUser);
      } else {
        setProfileImg('');
        setUser(null);
      }
    });
  });

  const renderFormSelect = () => (
    <Grid
      item
      xs={12}
      sx={{
        textAlign: 'center',
        mt: 10,
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
          {ediTranslatorForms.map((menuForm) => (
            <MenuItem key={menuForm.value} value={menuForm.value}>
              {menuForm.display}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  const renderForm = () => {
    switch (form) {
      case FORMS[855004010].value:
        return <Form855 user={user} />;
      case FORMS.DEFAULT.value:
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <EdiTranslatorBar
        profileImg={profileImg}
        darkModeToggleButton={
          <DarkModeToggleButton
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        }
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '90vh',
          height: 'auto',
        }}
      >
        <Grid
          container
          maxWidth="md"
          sx={{
            m: 1,
          }}
        >
          {renderFormSelect()}
          {renderForm()}
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '10vh',
          height: 'auto',
        }}
      >
        <IconButton
          aria-label="Go to GitHub repository"
          href="https://github.com/trandrew1023/edi-translator#readme"
          size="large"
          sx={{
            alignSelf: 'flex-end',
            bottom: 0,
          }}
        >
          <GitHubIcon />
        </IconButton>
      </Box>
    </ThemeProvider>
  );
}

export default App;
