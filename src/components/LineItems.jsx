import { React } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Grid, IconButton, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import LineItem from './LineItem';

function LineItems({ lineItems, lineItemErrors, setLineItems }) {



  const handleAddLineItem = () => {
    const newLineItems = new Map(lineItems);
    newLineItems.set(
        nanoid(),
        {
          item: '',
          description: '',
          unitOfMeasure: 'EA',
          orderedQuantity: '0',
          acknowledgedQuantity: '0',
          price: '0.00',
          acknowledgementStatus: 'IA',
        }
    )
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
        <Typography variant='h4'>Line Items</Typography>
      </Grid>
      {lineItems && lineItems.map((lineItem) => (
        <LineItem
          lineItem={lineItem}
          lineItemError={lineItemErrors.get(lineItem.key)}
          key={lineItem.key}
          removeLineItem={removeLineItem}
          updateLineItem={updateLineItem}
        />
      ))}
      <Grid item xs={12}>
        <IconButton onClick={handleAddLineItem}>
          <AddCircleIcon sx={{ color: 'green' }} />
          <Typography>Add line item</Typography>
        </IconButton>
      </Grid>
    </Grid>
  );
}

LineItems.propTypes = {
  lineItems: PropTypes.array.isRequired,
  lineItemErrors: PropTypes.objectOf(Map),
  setLineItems: PropTypes.func,
};

export default LineItems;