import { React } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Grid, IconButton, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import LineItem from './LineItem';

function LineItems({ lineItems, setLineItems }) {

  const handleAddLineItem = () => {
    const newLineItems = [...lineItems];
    newLineItems.push({
      key: nanoid(),
      item: '',
      description: '',
      unitOfMeasure: 'EA',
      orderedQuantity: '0',
      acknowledgedQuantity: '0',
      price: '0.00',
      acknowledgementStatus: 'IA',
    });
    setLineItems(newLineItems);
  };

  const removeLineItem = (lineItem) => {
    const newLineItems = [...lineItems];
    const idx = newLineItems.indexOf(lineItem);
    newLineItems.splice(idx, 1);
    setLineItems(newLineItems);
  };

  const updateLineItem = (lineItem, field, updatedValue) => {
    const newLineItems = [...lineItems];
    const idx = newLineItems.indexOf(lineItem);
    newLineItems[idx][field] = updatedValue;
    setLineItems(newLineItems);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>Line Items</Typography>
      </Grid>
      {lineItems && lineItems.map((lineItem) => (
        <LineItem
          lineItem={lineItem}
          key={lineItem.key}
          removeLineItem={removeLineItem}
          updateLineItem={updateLineItem}
        />
      ))}
      <Grid item xs={12}>
        <IconButton onClick={handleAddLineItem}>
          <AddCircleIcon />
          <Typography>Add line item</Typography>
        </IconButton>
      </Grid>
    </Grid>
  );
}

LineItems.propTypes = {
  lineItems: PropTypes.array.isRequired,
  setLineItems: PropTypes.func,
};

export default LineItems;