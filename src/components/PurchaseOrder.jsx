import { React, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CommentIcon from '@mui/icons-material/Comment';
import DownloadIcon from '@mui/icons-material/Download';
import UpdateIcon from '@mui/icons-material/Update';
import { nanoid } from 'nanoid';
import { to855 } from '../common/855Translator';
import LineItems from './LineItems';
import poAckTypeCodes from '../static/data/poAckTypeCodes.json';
import { Box } from '@mui/system';
import CommentModal from './CommentModal';

function PurchaseOrder() {
  const [lineItems, setLineItems] = useState([
    {
      key: nanoid(),
      item: '',
      description: '',
      unitOfMeasure: 'EA',
      orderedQuantity: '0',
      acknowledgedQuantity: '0',
      price: '0.00',
      acknowledgementStatus: 'IA',
    },
  ]);
  const [text, setText] = useState(``);
  const [purchaseOrder, setPurchaseOrder] = useState({
    purchaseOrderNumber: '',
    senderId: '',
    receiverId: '',
    accountNumber: '',
    poDate: dayjs(new Date()),
    ackDate: dayjs(new Date()),
    acknowledgementType: 'AC',
    headerComment: '',
  });
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const [saveToolTipOpen, setSaveToolTipOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [lineItemErrors, setLineItemErrors] = useState(new Map());
  const [fileDownload, setFileDownload] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const handleAckDateChange = (newValue) => {
    setPurchaseOrder({ ...purchaseOrder, ackDate: newValue });
  };

  const handlePoDateChange = (newValue) => {
    setPurchaseOrder({ ...purchaseOrder, poDate: newValue });
  };

  const handleSubmit = () => {
    setFormErrors({});
    setLineItemErrors(new Map());
    setText(``);
    handleSave();
    const checkForm = {};
    if (!purchaseOrder.purchaseOrderNumber) {
      checkForm.purchaseOrderNumber = true;
    }
    if (!purchaseOrder.senderId) {
      checkForm.senderId = true;
    }
    if (!purchaseOrder.receiverId) {
      checkForm.receiverId = true;
    }
    const checkLineItemErrors = new Map();
    lineItems.forEach((lineItem) => {
      const key = lineItem.key;
      if (!lineItem.item) {
        checkLineItemErrors.set(key, {
          ...checkLineItemErrors.get(key),
          item: true,
        });
      }
      if (!lineItem.unitOfMeasure) {
        checkLineItemErrors.set(key, {
          ...checkLineItemErrors.get(key),
          unitOfMeasure: true,
        });
      }
      if (!lineItem.orderedQuantity) {
        checkLineItemErrors.set(key, {
          ...checkLineItemErrors.get(key),
          orderedQuantity: true,
        });
      }
      if (!lineItem.price) {
        checkLineItemErrors.set(key, {
          ...checkLineItemErrors.get(key),
          price: true,
        });
      }
    });
    let hasErrors = false;
    if (checkLineItemErrors && checkLineItemErrors.size > 0) {
      setLineItemErrors(checkLineItemErrors);
      hasErrors = true;
    }
    if (checkForm && Object.keys(checkForm).length > 0) {
      setFormErrors({ ...checkForm });
      hasErrors = true;
    }
    if (hasErrors) return;
    let submittedPurchaseOrder = to855(purchaseOrder, lineItems);
    const file = new Blob([submittedPurchaseOrder], { type: 'text/plain' });
    setFileDownload(window.URL.createObjectURL(file));
    setText(submittedPurchaseOrder);
  };

  const handleSave = () => {
    localStorage.setItem('purchaseOrder', JSON.stringify(purchaseOrder));
    localStorage.setItem('lineItems', JSON.stringify(lineItems));
  };

  const handleReset = () => {
    setFormErrors({});
    setLineItemErrors(new Map());
    setText(``);
    setPurchaseOrder({
      purchaseOrderNumber: '',
      senderId: '',
      receiverId: '',
      accountNumber: '',
      poDate: dayjs(new Date()),
      ackDate: dayjs(new Date()),
      acknowledgementType: 'AC',
    });
    setLineItems([
      {
        key: nanoid(),
        item: '',
        description: '',
        unitOfMeasure: 'EA',
        orderedQuantity: '0',
        acknowledgedQuantity: '0',
        price: '0.00',
        acknowledgementStatus: 'IA',
      },
    ]);
    localStorage.removeItem('purchaseOrder');
    localStorage.removeItem('lineItems');
  };

  const handleLineItemReset = () => {
    setFormErrors({});
    setLineItemErrors(new Map());
    setLineItems([
      {
        key: nanoid(),
        item: '',
        description: '',
        unitOfMeasure: 'EA',
        orderedQuantity: '0',
        acknowledgedQuantity: '0',
        price: '0.00',
        acknowledgementStatus: 'IA',
      },
    ]);
    localStorage.removeItem('lineItems');
  };

  useEffect(() => {
    let savedPurchaseOrder = localStorage.getItem('purchaseOrder');
    const savedLineItems = localStorage.getItem('lineItems');
    if (savedPurchaseOrder) {
      savedPurchaseOrder = JSON.parse(savedPurchaseOrder);
      setPurchaseOrder({
        ...savedPurchaseOrder,
        poDate: dayjs(savedPurchaseOrder.poDate),
        ackDate: dayjs(savedPurchaseOrder.ackDate),
      });
    }
    if (savedLineItems) {
      setLineItems(JSON.parse(savedLineItems));
    }
  }, []);

  const handleTooltipClose = () => {
    setToolTipOpen(false);
  };

  const handleSaveTooltipClose = () => {
    setSaveToolTipOpen(false);
  };

  const editPurchaseOrder = (event, param) => {
    setPurchaseOrder({ ...purchaseOrder, [param]: event.target.value });
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} mb={-4}>
        <Typography variant="h4">Purchase Order Header</Typography>
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={formErrors.purchaseOrderNumber}
          label="Purchase order #"
          value={purchaseOrder.purchaseOrderNumber}
          onChange={(event) => editPurchaseOrder(event, 'purchaseOrderNumber')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={formErrors.senderId}
          label="Sender ID"
          value={purchaseOrder.senderId}
          onChange={(event) => editPurchaseOrder(event, 'senderId')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={formErrors.receiverId}
          label="Receiver ID"
          value={purchaseOrder.receiverId}
          onChange={(event) => editPurchaseOrder(event, 'receiverId')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label="Account number"
          value={purchaseOrder.accountNumber}
          onChange={(event) => editPurchaseOrder(event, 'accountNumber')}
        />
      </Grid>
      <Grid item md={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Purchase order date"
            value={purchaseOrder.poDate}
            onChange={handlePoDateChange}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </LocalizationProvider>
        <IconButton onClick={() => handlePoDateChange(dayjs(new Date()))}>
          <UpdateIcon />
        </IconButton>
      </Grid>
      <Grid item md={4}>
        <FormControl fullWidth>
          <InputLabel>Acknowledgement type</InputLabel>
          <Select
            label="Acknowledgement type"
            value={purchaseOrder.acknowledgementType}
            onChange={(event) =>
              editPurchaseOrder(event, 'acknowledgementType')
            }
          >
            {poAckTypeCodes.map((poAckTypeCode) => (
              <MenuItem value={poAckTypeCode.code} key={poAckTypeCode.code}>
                {poAckTypeCode.code + ' (' + poAckTypeCode.description + ')'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Acknowledgement date"
            value={purchaseOrder.ackDate}
            onChange={handleAckDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <IconButton onClick={() => handleAckDateChange(dayjs(new Date()))}>
          <UpdateIcon />
        </IconButton>
      </Grid>
      <Grid item md={4}>
        <IconButton onClick={() => setCommentModalOpen(true)}>
          {purchaseOrder.headerComment ? <CommentIcon /> : <AddCommentIcon />}
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <LineItems
          lineItems={lineItems}
          lineItemErrors={lineItemErrors}
          setLineItems={setLineItems}
        />
      </Grid>
      {text && (
        <Grid item xs={12}>
          <Typography variant="h4">Generated 855 file text</Typography>
          <Box sx={{ border: 1 }}>
            <Typography sx={{ wordBreak: 'break-word' }}>
              {text.replace(/ /g, '\u00A0')}
            </Typography>
          </Box>
          <Tooltip
            title="Copied to clipboard!"
            open={toolTipOpen}
            leaveDelay={750}
            onClose={handleTooltipClose}
          >
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(text);
                setToolTipOpen(true);
              }}
              sx={{
                marginLeft: 'auto',
                float: 'right',
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <a download="edi-translator.855" href={fileDownload}>
            <IconButton
              sx={{
                marginLeft: 'auto',
                float: 'right',
              }}
            >
              <DownloadIcon />
            </IconButton>
          </a>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button onClick={handleSubmit} variant="contained" color="success">
          Submit
        </Button>
        {((formErrors && Object.keys(formErrors).length > 0) ||
          (lineItemErrors && lineItemErrors.size > 0)) && (
          <Typography sx={{ color: 'red' }}>
            Unable to generate, please check the fields
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <Tooltip
          title="Saved!"
          open={saveToolTipOpen}
          leaveDelay={750}
          onClose={handleSaveTooltipClose}
        >
          <Button
            onClick={() => {
              handleSave();
              setSaveToolTipOpen(true);
            }}
            variant="contained"
            color="success"
          >
            Save
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleLineItemReset}
          variant="contained"
          sx={{ backgroundColor: 'red' }}
        >
          Clear line items
        </Button>
      </Grid>
      <Grid item xs={12} mb={4}>
        <Button
          onClick={handleReset}
          variant="contained"
          sx={{ backgroundColor: 'red' }}
        >
          Reset
        </Button>
      </Grid>
      {commentModalOpen && (
        <CommentModal
          commentModalOpen={commentModalOpen}
          setCommentModalOpen={setCommentModalOpen}
          comment={purchaseOrder.headerComment}
          setComment={editPurchaseOrder}
          header={'Header Comment'}
          target={'headerComment'}
        />
      )}
    </Grid>
  );
}

export default PurchaseOrder;
