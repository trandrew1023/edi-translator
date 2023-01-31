import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { React, useState } from 'react';
import poLineStatusCodes from '../static/data/poLineStatusCodes.json';
import CommentModal from './CommentModal';

function LineItem({
  lineItem,
  lineItemError,
  mapID,
  removeLineItem,
  updateLineItem,
}) {
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const handleEventChange = (event, prop) => {
    updateLineItem(mapID, prop, event.target.value);
  };

  return (
    <Grid container spacing={2} mb={4}>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.item}
          label="Item"
          value={lineItem.item}
          onChange={(event) => handleEventChange(event, 'item')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label="Description"
          value={lineItem.description}
          onChange={(event) => handleEventChange(event, 'description')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.unitOfMeasure}
          label="Unit of Measure"
          value={lineItem.unitOfMeasure}
          onChange={(event) => handleEventChange(event, 'unitOfMeasure')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.orderedQuantity}
          label="Ordered quantity"
          value={lineItem.orderedQuantity}
          onChange={(event) => handleEventChange(event, 'orderedQuantity')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.acknowledgedQuantity}
          label="Acknowledged quantity"
          value={lineItem.acknowledgedQuantity}
          onChange={(event) => handleEventChange(event, 'acknowledgedQuantity')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={lineItemError?.price}
          label="Price"
          value={lineItem.price}
          onChange={(event) => handleEventChange(event, 'price')}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>Acknowledgement Status</InputLabel>
          <Select
            label="Acknowledgement Status"
            value={lineItem.acknowledgementStatus}
            onChange={(event) =>
              handleEventChange(event, 'acknowledgementStatus')
            }
          >
            {poLineStatusCodes.map((poLineStatusCode) => (
              <MenuItem
                value={poLineStatusCode.code}
                key={poLineStatusCode.code}
              >
                {poLineStatusCode.code +
                  ' (' +
                  poLineStatusCode.description +
                  ')'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={4}>
        <IconButton onClick={() => setCommentModalOpen(true)}>
          {lineItem.comment ? <CommentIcon /> : <AddCommentIcon />}
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <IconButton onClick={() => removeLineItem(mapID)}>
          <RemoveCircleIcon sx={{ color: 'red' }} />
          <Typography>Remove line item</Typography>
        </IconButton>
      </Grid>
      {commentModalOpen && (
        <CommentModal
          commentModalOpen={commentModalOpen}
          setCommentModalOpen={setCommentModalOpen}
          comment={lineItem.comment}
          setComment={handleEventChange}
          header={'Line Comment - ' + lineItem.item}
          target={'comment'}
        />
      )}
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
    comment: PropTypes.string,
  }).isRequired,
  lineItemError: PropTypes.object,
  mapID: PropTypes.string.isRequired,
  removeLineItem: PropTypes.func.isRequired,
  updateLineItem: PropTypes.func.isRequired,
};

export default LineItem;
