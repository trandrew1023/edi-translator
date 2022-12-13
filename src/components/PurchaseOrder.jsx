import { React, useState } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { nanoid } from 'nanoid';
import { to855 } from '../common/855Translator';
import LineItems from './LineItems';
import poAckTypeCodes from '../static/data/poAckTypeCodes.json';

function PurchaseOrder() {
  const [acknowledgementType, setAcknowledgementType] = useState('AC');
  const [ackDate, setAckDate] = useState(dayjs(new Date()));
  const [poDate, setPoDate] = useState(dayjs(new Date()));
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
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('AT123');
  const [senderId, setSenderId] = useState('SENDER');
  const [receiverId, setReceiverId] = useState('RECEIVER');
  const [accountNumber, setAccountNumber] = useState('123');
  const [text, setText] = useState(``);

  const handleAcknowledgementTypeChange = (event) => {
    setAcknowledgementType(event.target.value)
  }

  const handleAckDateChange = (newValue) => {
    setAckDate(newValue);
  };

  const handlePoDateChange = (newValue) => {
    setPoDate(newValue);
  };

  const handleSubmit = () => {
    const purchaseOrder = {
      purchaseOrderNumber: purchaseOrderNumber,
      senderId: senderId,
      receiverId: receiverId,
      accountNumber: accountNumber,
      purchaseOrderDate: poDate,
      purchaseOrderTime: poDate,
      purchaseOrderDateFull: poDate,
      acknowledgementType: acknowledgementType,
    };
    let temp = to855(purchaseOrder, lineItems);
    console.log(temp);
    setText(temp);
  };

  const handleReset = () => {
    setPurchaseOrderNumber('');
    setSenderId('');
    setReceiverId('');
    setAccountNumber('');
    setAckDate(dayjs(new Date()));
    setPoDate(dayjs(new Date()));
    setAcknowledgementType('AC');
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
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} mb={-4}>
        <Typography>Purchase Order Header</Typography>
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Purchase order #'
          value={purchaseOrderNumber}
          onChange={(event) => setPurchaseOrderNumber(event.target.value)}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Sender ID'
          value={senderId}
          onChange={(event) => setSenderId(event.target.value)}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Receiver ID'
          value={receiverId}
          onChange={(event) => setReceiverId(event.target.value)}
        />
      </Grid>
      <Grid item md={4}>
        <TextField
          fullWidth
          label='Account number'
          value={accountNumber}
          onChange={(event) => setAccountNumber(event.target.value)}
        />
      </Grid>
      <Grid item md={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Purchase order date"
            value={poDate}
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
            value={acknowledgementType}
            onChange={handleAcknowledgementTypeChange}
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
            value={ackDate}
            onChange={handleAckDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <LineItems lineItems={lineItems} setLineItems={setLineItems} />
      </Grid>
      <Grid item xs={12} mb={4}>
        <Button onClick={handleSubmit} variant='contained'>Submit</Button>
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
      {text &&
        <Grid item xs={12} mb={4}>
          <Typography>Generated 855 file text</Typography>
          <Typography sx={{ wordBreak: "break-word" }}>{text.replace(/ /g, '\u00A0')}</Typography>
        </Grid>
      }
    </Grid>
  );
}

export default PurchaseOrder;