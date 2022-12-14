import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { React } from 'react';
import PropTypes from 'prop-types';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import poLineStatusCodes from '../static/data/poLineStatusCodes.json';

function LineItem({ lineItem, lineItemError, removeLineItem, updateLineItem }) {

  const handleEventChange = (event, prop) => {
    updateLineItem(lineItem, prop, event.target.value);
  };

  return (
    <Grid container spacing={2} mb={4}>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.item}
          label='Item'
          value={lineItem.item}
          onChange={event => handleEventChange(event, 'item')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Description'
          value={lineItem.description}
          onChange={event => handleEventChange(event, 'description')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.unitOfMeasure}
          label='Unit of Measure'
          value={lineItem.unitOfMeasure}
          onChange={event => handleEventChange(event, 'unitOfMeasure')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.orderedQuantity}
          label='Ordered quantity'
          value={lineItem.orderedQuantity}
          onChange={event => handleEventChange(event, 'orderedQuantity')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.acknowledgedQuantity}
          label='Acknowledged quantity'
          value={lineItem.acknowledgedQuantity}
          onChange={event => handleEventChange(event, 'acknowledgedQuantity')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.price}
          label='Price'
          value={lineItem.price}
          onChange={event => handleEventChange(event, 'price')}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>Acknowledgement Status</InputLabel>
          <Select
            label="Acknowledgement Status"
            value={lineItem.acknowledgementStatus}
            onChange={event => handleEventChange(event, 'acknowledgementStatus')}
          >
            {poLineStatusCodes.map((poLineStatusCode => (
              <MenuItem value={poLineStatusCode.code} key={poLineStatusCode.code}>
                {poLineStatusCode.code + ' (' + poLineStatusCode.description + ")"}
              </MenuItem>
            )))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <IconButton onClick={() => removeLineItem(lineItem)}>
          <RemoveCircleIcon sx={{ color: 'red' }} />
          <Typography>Remove line item</Typography>
        </IconButton>
      </Grid>
    </Grid>
  );
}

LineItem.propTypes = {
  lineItem: PropTypes.shape({
    item: PropTypes.string,
    description: PropTypes.string,
    orderedQuantity: PropTypes.string,
    acknowledgedQuantity: PropTypes.string,
    price: PropTypes.string,
    acknowledgementStatus: PropTypes.string,
    unitOfMeasure: PropTypes.string,
  }).isRequired,
  lineItemError: PropTypes.object,
  removeLineItem: PropTypes.func.isRequired,
  updateLineItem: PropTypes.func.isRequired,
};

export default LineItem;