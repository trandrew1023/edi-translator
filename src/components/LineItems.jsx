import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Grid, IconButton, Typography } from '@mui/material';
import { ListItem, List } from '@mui/material'; //TODO MAKE SURE TO CHANGE THIS IMPORT
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
      <Grid item xs={12}>
        <Typography variant="h4">Line Items</Typography>
      </Grid>
        <List>
          {lineItems && Array.from(lineItems).map(([key, lineItem], index) => (
            <ListItem key={key} disableGutters>
              <div>
                <h1>{`Line Item: ${index}`}</h1>
                <LineItem
                lineItem={lineItem}
                lineItemError={lineItemErrors.get(key)}
                mapID={key}
                removeLineItem={removeLineItem}
                updateLineItem={updateLineItem}
                />
              </div>
            </ListItem>
          ))}
        </List>
        {/* {lineItems && Array.from(lineItems).map(([key, lineItem]) => (
              <LineItem
              key={key}
              lineItem={lineItem}
              lineItemError={lineItemErrors.get(key)}
              mapID={key}
              removeLineItem={removeLineItem}
              updateLineItem={updateLineItem}
            />
          ))} */}
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
  lineItems: PropTypes.objectOf(Map),
  lineItemErrors: PropTypes.objectOf(Map),
  setLineItems: PropTypes.func,
};

export default LineItems;
