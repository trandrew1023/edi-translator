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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { nanoid } from 'nanoid';
import { to855 } from '../common/855Translator';
import LineItems from './LineItems';
import poAckTypeCodes from '../static/data/poAckTypeCodes.json';
import { Box } from '@mui/system';

function PurchaseOrder() {
  const [lineItems, setLineItems] = useState([{
    key: nanoid(),
    item: '',
    description: '',
    unitOfMeasure: 'EA',
    orderedQuantity: '0',
    acknowledgedQuantity: '0',
    price: '0.00',
    acknowledgementStatus: 'IA',
  }]);
  const [text, setText] = useState(``);
  const [purchaseOrder, setPurchaseOrder] = useState({
    purchaseOrderNumber: '',
    senderId: '',
    receiverId: '',
    accountNumber: '',
    poDate: dayjs(new Date()),
    ackDate: dayjs(new Date()),
    acknowledgementType: 'AC',
  });
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const [saveToolTipOpen, setSaveToolTipOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleAckDateChange = (newValue) => {
    setPurchaseOrder({...purchaseOrder, ackDate: newValue});
  };

  const handlePoDateChange = (newValue) => {
    setPurchaseOrder({...purchaseOrder, poDate: newValue});
  };

  const handleSubmit = () => {
    setFormErrors({});
    setText(``);
    handleSave();
    const checkForm = {};
    if (!purchaseOrder.purchaseOrderNumber) {
      checkForm.purchaseOrderNumber = true;
    }
    if (checkForm && Object.keys(checkForm).length > 0) {
      setFormErrors({...checkForm});
      return;
    }
    let submittedPurchaseOrder = to855(purchaseOrder, lineItems);
    setText(submittedPurchaseOrder);
  };

  const handleSave = () => {
    localStorage.setItem('purchaseOrder', JSON.stringify(purchaseOrder));
    localStorage.setItem('lineItems', JSON.stringify(lineItems));
  };

  const handleReset = () => {
    setFormErrors({});
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
    setLineItems([{
      key: nanoid(),
      item: '',
      description: '',
      unitOfMeasure: 'EA',
      orderedQuantity: '0',
      acknowledgedQuantity: '0',
      price: '0.00',
      acknowledgementStatus: 'IA',
    }])
    localStorage.removeItem('purchaseOrder');
    localStorage.removeItem('lineItems');
  };

  const handleLineItemReset = () => {
    setFormErrors({});
    setLineItems([{
      key: nanoid(),
      item: '',
      description: '',
      unitOfMeasure: 'EA',
      orderedQuantity: '0',
      acknowledgedQuantity: '0',
      price: '0.00',
      acknowledgementStatus: 'IA',
    }])
    localStorage.removeItem('lineItems');
  };

  useEffect(() => {
    let savedPurchaseOrder = localStorage.getItem('purchaseOrder');
    const savedLineItems = localStorage.getItem('lineItems');
    if (savedPurchaseOrder) {
      savedPurchaseOrder = JSON.parse(savedPurchaseOrder);
      setPurchaseOrder({...savedPurchaseOrder, poDate: dayjs(savedPurchaseOrder.poDate)});
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
    setPurchaseOrder({...purchaseOrder, [param]: event.target.value});
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} mb={-4}>
        <Typography variant='h4'>Purchase Order Header</Typography>
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          required
          error={formErrors.purchaseOrderNumber}
          label='Purchase order #'
          value={purchaseOrder.purchaseOrderNumber}
          onChange={(event) => editPurchaseOrder(event, 'purchaseOrderNumber')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Sender ID'
          value={purchaseOrder.senderId}
          onChange={(event) => editPurchaseOrder(event, 'senderId')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Receiver ID'
          value={purchaseOrder.receiverId}
          onChange={(event) => editPurchaseOrder(event, 'receiverId')}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Account number'
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
      </Grid>
      <Grid item md={4}>
        <FormControl fullWidth>
          <InputLabel>Acknowledgement type</InputLabel>
          <Select
            label="Acknowledgement type"
            value={purchaseOrder.acknowledgementType}
            onChange={(event) => editPurchaseOrder(event, 'acknowledgementType')}
          >
            {poAckTypeCodes.map((poAckTypeCode => (
              <MenuItem value={poAckTypeCode.code} key={poAckTypeCode.code}>
                {poAckTypeCode.code + ' (' + poAckTypeCode.description + ")"}
              </MenuItem>
            )))}
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
      </Grid>
      <Grid item xs={12}>
        <LineItems lineItems={lineItems} setLineItems={setLineItems} />
      </Grid>
      {text &&
        <Grid 
        item 
        xs={12}
        >
          <Typography variant='h4'>Generated 855 file text</Typography>
          <Box sx={{border: 1}}>
            <Typography sx={{ wordBreak: "break-word" }}>{text.replace(/ /g, '\u00A0')}</Typography>
          </Box>
          <Tooltip 
          title='Copied to clipboard!' 
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
            float: 'right'
          }}
          >
            <ContentCopyIcon/>
          </IconButton>
          </Tooltip>
        </Grid>
      }
      <Grid item xs={12}>
        <Button onClick={handleSubmit} variant='contained'>Submit</Button>
        {(formErrors && Object.keys(formErrors).length > 0) 
        && <Typography sx={{color:'red'}}>Unable to generate, please check the fields</Typography>}
      </Grid>
      <Grid item xs={12}>
      <Tooltip 
          title='Saved!' 
          open={saveToolTipOpen} 
          leaveDelay={750}
          onClose={handleSaveTooltipClose}
          >
        <Button
        onClick={() => {
          handleSave();
          setSaveToolTipOpen(true);
        }} 
        variant='contained'
        >
          Save
          </Button>
          </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleLineItemReset}
          variant='contained'
          sx={{ backgroundColor: 'red' }}
        >
          Clear line items
        </Button>
      </Grid>
      <Grid item xs={12} mb={4}>
        <Button
          onClick={handleReset}
          variant='contained'
          sx={{ backgroundColor: 'red' }}
        >
          Reset
        </Button>
      </Grid>
    </Grid>
  );
}

export default PurchaseOrder;