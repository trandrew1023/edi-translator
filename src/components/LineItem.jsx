import {
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CommentIcon from "@mui/icons-material/Comment";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
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
} from "@mui/material";
import PropTypes from "prop-types";
import { React, useState } from "react";
import poLineStatusCodes from "../static/data/poLineStatusCodes.json";
import CommentModal from "./CommentModal";

/**
 * This component renders a single line item that can be updated.
 */
export default function LineItem({
  index,
  lineItem,
  lineItemError,
  lineItemKey,
  removeLineItem,
  updateLineItem,
}) {
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [lineItemOpen, setLineItemOpen] = useState(true);

  const handleEventChange = (event, prop) => {
    updateLineItem(lineItemKey, prop, event.target.value);
  };

  const editLineItemComment = (updatedComment) => {
    handleEventChange({ target: { value: updatedComment } }, "comment");
  };

  const handleLineItemCollapse = () => {
    setLineItemOpen(!lineItemOpen);
  };

  const getLineItemDisplay = () =>
    lineItem.item ? `${index + 1}: (${lineItem.item})` : `${index + 1}`;

  return (
    <Box>
      <Button
        variant="text"
        onClick={handleLineItemCollapse}
        startIcon={
          lineItemOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />
        }
      >
        {getLineItemDisplay()}
      </Button>
      <IconButton onClick={() => removeLineItem(lineItemKey)}>
        <RemoveCircleIcon sx={{ color: "red", mr: 1 }} />
        <Typography>Remove line item</Typography>
      </IconButton>
      <Collapse
        in={lineItemOpen}
        sx={{ paddingTop: "10px" }}
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
              onChange={(event) => handleEventChange(event, "item")}
            />
            {lineItemError?.item && (
              <Typography variant="caption" sx={{ color: "red" }}>
                Please fill out required field
              </Typography>
            )}
          </Grid>
          <Grid item md={4}>
            <TextField
              fullWidth
              label="Description"
              value={lineItem.description}
              onChange={(event) => handleEventChange(event, "description")}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              fullWidth
              required
              error={lineItemError?.unitOfMeasure}
              label="Unit of Measure"
              value={lineItem.unitOfMeasure}
              onChange={(event) => handleEventChange(event, "unitOfMeasure")}
            />
            {lineItemError?.unitOfMeasure && (
              <Typography variant="caption" sx={{ color: "red" }}>
                Please fill out required field
              </Typography>
            )}
          </Grid>
          <Grid item md={4}>
            <TextField
              fullWidth
              required
              error={lineItemError?.orderedQuantity}
              label="Ordered quantity"
              value={lineItem.orderedQuantity}
              onChange={(event) => handleEventChange(event, "orderedQuantity")}
            />
            {lineItemError?.orderedQuantity && (
              <Typography variant="caption" sx={{ color: "red" }}>
                Please fill out required field
              </Typography>
            )}
          </Grid>
          <Grid item md={4}>
            <TextField
              fullWidth
              required
              error={lineItemError?.acknowledgedQuantity}
              label="Acknowledged quantity"
              value={lineItem.acknowledgedQuantity}
              onChange={(event) =>
                handleEventChange(event, "acknowledgedQuantity")
              }
            />
            {lineItemError?.acknowledgedQuantity && (
              <Typography variant="caption" sx={{ color: "red" }}>
                Please fill out required field
              </Typography>
            )}
          </Grid>
          <Grid item md={4}>
            <TextField
              fullWidth
              required
              error={lineItemError?.price}
              label="Price"
              value={lineItem.price}
              onChange={(event) => handleEventChange(event, "price")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title="Must be numeric with up to 2 decimal values (no symbols)"
                      arrow
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <InfoOutlined />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            {lineItemError?.price && (
              <Typography variant="caption" sx={{ color: "red" }}>
                Please fill out required field
              </Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Acknowledgement Status</InputLabel>
              <Select
                label="Acknowledgement Status"
                value={lineItem.acknowledgementStatus}
                onChange={(event) =>
                  handleEventChange(event, "acknowledgementStatus")
                }
              >
                {poLineStatusCodes.map((poLineStatusCode) => (
                  <MenuItem
                    value={poLineStatusCode.code}
                    key={poLineStatusCode.code}
                  >
                    {`${poLineStatusCode.code} (${poLineStatusCode.description})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <IconButton onClick={() => setCommentModalOpen(true)}>
              {lineItem.comment ? <CommentIcon /> : <AddCommentIcon />}
              <Typography ml={1}>
                {lineItem.comment ? "Edit comment" : "Add comment"}
              </Typography>
            </IconButton>
          </Grid>
          {commentModalOpen && (
            <CommentModal
              comment={lineItem.comment}
              commentModalOpen={commentModalOpen}
              headerText={`Line Comment - ${lineItem.item}`}
              setComment={editLineItemComment}
              setCommentModalOpen={setCommentModalOpen}
            />
          )}
        </Grid>
      </Collapse>
    </Box>
  );
}

LineItem.defaultProps = {
  lineItemError: {},
};

LineItem.propTypes = {
  /**
   * The position of the line item starting at 0.
   * Used to display the line item's line number.
   */
  index: PropTypes.number.isRequired,
  /**
   * The line item details.
   */
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
  /**
   * The line item errors used to set the input error props.
   * The following properties can be set if the line item prop has an error:
   * {acknowledgedQuantity, item, orderedQuantity, price, unitOfMeasure}
   */
  // eslint-disable-next-line react/forbid-prop-types
  lineItemError: PropTypes.object,
  /**
   * The unique key for this line item for reference. Specifically, the line item
   * {@link Map} key.
   */
  lineItemKey: PropTypes.string.isRequired,
  /**
   * Callback function the remove this line item.
   *
   * @param {string} key The unique key for this line item.
   */
  removeLineItem: PropTypes.func.isRequired,
  /**
   * Callback function to provide updated line item details.
   *
   * @param {string} key The unique key for this line item.
   * @param {string} prop The line item property name being updated.
   * @param {string} value The updated value.
   */
  updateLineItem: PropTypes.func.isRequired,
};
