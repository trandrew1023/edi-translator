import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { React, useEffect, useState } from 'react';
import './App.css';
import PurchaseOrder from './components/PurchaseOrder';

function App() {
  const [form, selectForm] = useState(0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('dark-mode-pref') === null
      ? 'light'
      : localStorage.getItem('dark-mode-pref'),
  );
  const theme = createTheme({
    palette: {
      mode: darkMode,
      primary: {
        main: darkMode === 'dark' ? grey[100] : grey[900],
      },
      secondary: {
        main: darkMode === 'dark' ? grey[100] : grey[900],
      },
    },
  });
  const toggleDarkMode = () => {
    const newMode = darkMode === 'dark' ? 'light' : 'dark';
    setDarkMode(newMode);
    localStorage.setItem('dark-mode-pref', newMode);
  };

  const handleFormChange = (event) => {
    const selectedForm = event.target.value;
    selectForm(selectedForm);
    localStorage.setItem('lastForm', selectedForm);
  };

  useEffect(() => {
    const lastForm = localStorage.getItem('lastForm');
    if (lastForm) {
      selectForm(lastForm);
    }
  });

  return (
    <ThemeProvider theme={theme}>
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
        <Grid container spacing={2} maxWidth="md">
          <Grid item xs={12}>
            <Typography variant="h2">EDI Translator</Typography>
            <IconButton
              onClick={() => toggleDarkMode()}
              sx={{
                // position: 'fixed',
                // right: 0,
                marginLeft: 'auto',
                float: 'right',
                marginTop: -9,
              }}
            >
              {darkMode === 'light' ? (
                <Brightness4Icon />
              ) : (
                <Brightness4OutlinedIcon />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
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
              <PurchaseOrder></PurchaseOrder>
            </Grid>
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
