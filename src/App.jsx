import { React, useState } from 'react';
import './App.css';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import PurchaseOrder from './components/PurchaseOrder';

function App() {
  const [form, selectForm] = useState(0);

  const handleFormChange = (event) => {
    selectForm(event.target.value)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        spacing={2}
        maxWidth='md'
      >
        <Grid item xs={12}>
          <Typography>EDI Translator</Typography>
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
              <MenuItem value={0}>None</MenuItem>
              <MenuItem value={855004010}>855 (v004010)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <PurchaseOrder></PurchaseOrder>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
