import {
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@mui/icons-material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { React, useState } from 'react';
import poLineStatusCodes from '../static/data/poLineStatusCodes.json';
import CommentModal from './CommentModal';

function LineItem({
  index,
  lineItem,
  lineItemError,
  mapID,
  removeLineItem,
  updateLineItem,
}) {
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [open, setOpen] = useState(true);

  const handleEventChange = (event, prop) => {
    updateLineItem(mapID, prop, event.target.value);
  };

  const handleLineItemCollapse = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Button
        variant="text"
        onClick={handleLineItemCollapse}
        startIcon={open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
      >
        {`${index + 1}: ` + (lineItem.item ? `(${lineItem.item})` : '')}
      </Button>
      <Collapse
        in={open}
        sx={{ paddingTop: '10px' }}
        timeout="auto"
        unmountOnExit
      >
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
              onChange={(event) =>
                handleEventChange(event, 'acknowledgedQuantity')
              }
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title="Must be numeric with up to 2 decimal values (no symbols)"
                      arrow
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
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
              <Typography ml={1}>
                {lineItem.comment ? 'Edit comment' : 'Add comment'}
              </Typography>
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <IconButton onClick={() => removeLineItem(mapID)}>
              <RemoveCircleIcon sx={{ color: 'red', mr: 1 }} />
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
      </Collapse>
    </Box>
  );
}

LineItem.propTypes = {
  index: PropTypes.number.isRequired,
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
