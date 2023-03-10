import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { Fragment, React, useEffect, useRef, useState } from 'react';
import LineItem from './LineItem';

function LineItems({ lineItems, lineItemErrors, setLineItems }) {
  const addItemRef = useRef(null);
  const [itemAdded, setItemAdded] = useState(false);
  const [itemRemoved, setItemRemoved] = useState(false);
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
    setItemAdded(true);
    setItemRemoved(false);
  };

  const removeLineItem = (key) => {
    const newLineItems = new Map(lineItems);
    newLineItems.delete(key);
    setLineItems(newLineItems);
    setItemAdded(false);
    setItemRemoved(true);
  };

  const updateLineItem = (key, field, updatedValue) => {
    const newLineItems = new Map(lineItems);
    newLineItems.get(key)[field] = updatedValue;
    setLineItems(newLineItems);
  };

  useEffect(() => {
    if (itemAdded && addItemRef && !itemRemoved) {
      addItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  });

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          marginBottom: -2,
        }}
      >
        <Typography variant="h1" fontSize={35}>
          Line Items
        </Typography>
      </Grid>
      <List>
        {lineItems &&
          Array.from(lineItems).map(([key, lineItem], index) => (
            <Fragment key={key}>
              <ListItem disableGutters>
                <LineItem
                  index={index}
                  lineItem={lineItem}
                  lineItemError={lineItemErrors.get(key)}
                  lineItemKey={key}
                  removeLineItem={removeLineItem}
                  updateLineItem={updateLineItem}
                />
              </ListItem>
              <Divider component="li" />
            </Fragment>
          ))}
      </List>
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <IconButton ref={addItemRef} onClick={handleAddLineItem}>
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
