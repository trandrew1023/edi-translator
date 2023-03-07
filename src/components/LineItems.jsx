import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Grid, IconButton, List, ListItem, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { React } from 'react';
import LineItem from './LineItem';

function LineItems({ lineItems, lineItemErrors, setLineItems }) {
  const handleAddLineItem = () => {
    const newLineItems = new Map(lineItems);
    newLineItems.set(nanoid(), {
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

  const removeLineItem = (key) => {
    const newLineItems = new Map(lineItems);
    newLineItems.delete(key);

    setLineItems(newLineItems);
  };

  const updateLineItem = (key, field, updatedValue) => {
    const newLineItems = new Map(lineItems);
    newLineItems.get(key)[field] = updatedValue;
    setLineItems(newLineItems);
  };

  return (
    <Grid container>
      <Grid item xs={12} mb={-3}>
        <Typography variant="h4">Line Items</Typography>
      </Grid>
      <List>
        {lineItems &&
          Array.from(lineItems).map(([key, lineItem], index) => (
            <ListItem key={key} disableGutters>
              <LineItem
                index={index}
                lineItem={lineItem}
                lineItemError={lineItemErrors.get(key)}
                lineItemKey={key}
                removeLineItem={removeLineItem}
                updateLineItem={updateLineItem}
              />
            </ListItem>
          ))}
      </List>
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <IconButton onClick={handleAddLineItem}>
          <AddCircleIcon sx={{ color: 'green', mr: 1 }} />
          <Typography>Add line item</Typography>
        </IconButton>
      </Grid>
    </Grid>
  );
}

LineItems.defaultProps = {
  lineItems: new Map(),
  lineItemErrors: new Map(),
};

LineItems.propTypes = {
  lineItems: PropTypes.objectOf(Map),
  lineItemErrors: PropTypes.objectOf(Map),
  setLineItems: PropTypes.func.isRequired,
};

export default LineItems;
