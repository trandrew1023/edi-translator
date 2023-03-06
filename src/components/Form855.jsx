import { MenuOpen } from '@mui/icons-material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import UpdateIcon from '@mui/icons-material/Update';
import {
  Alert,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { React, useEffect, useState } from 'react';
import { to855 } from '../common/855Translator';
import { FORM_SAVE_RESPONSE } from '../common/Constants';
import { db } from '../common/Firebase';
import { alertStyle } from '../common/Styles';
import poAckTypeCodes from '../static/data/poAckTypeCodes.json';
import CommentModal from './CommentModal';
import FormDrawer from './FormDrawer';
import LineItems from './LineItems';
import SaveFormModal from './SaveFormModal';

function Form855({ user }) {
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
  const [lineItems, setLineItems] = useState(
    new Map([
      [
        nanoid(),
        {
          item: '',
          description: '',
          unitOfMeasure: 'EA',
          orderedQuantity: '0',
          acknowledgedQuantity: '0',
          price: '0.00',
          acknowledgementStatus: 'IA',
        },
      ],
    ]),
  );
  const [text, setText] = useState(``);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const [saveToolTipOpen, setSaveToolTipOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [lineItemErrors, setLineItemErrors] = useState(new Map());
  const [fileDownload, setFileDownload] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [poDateChecked, setPoDateChecked] = useState(false);
  const [ackDateChecked, setAckDateChecked] = useState(false);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [savedFormKeys, changeSavedFormKeys] = useState([]);
  const [savedForms, changeSavedForms] = useState({});
  const [saveFormModalOpen, setSaveFormModalOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

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
    lineItems.forEach((lineItem, key) => {
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
      //regex only accepts positive integers or decimal numbers up to 2 decimal places of precision [EX. 234, 12.8, 1.99, 15342523, 0.76]
      if (!lineItem.price || !/^[0-9]*(\.[0-9]{1,2})?$/.test(lineItem.price)) {
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
    const updatedPurchaseOrder = {
      ...purchaseOrder,
      ...(ackDateChecked && { ackDate: dayjs(new Date()) }),
      ...(poDateChecked && { poDate: dayjs(new Date()) }),
    };
    setPurchaseOrder(updatedPurchaseOrder);
    handleSaveWithParams(updatedPurchaseOrder, lineItems);
    let submittedPurchaseOrder = to855(updatedPurchaseOrder, lineItems);
    const file = new Blob([submittedPurchaseOrder], { type: 'text/plain' });
    setFileDownload(window.URL.createObjectURL(file));
    setText(submittedPurchaseOrder);
  };

  const handleSave = () => {
    localStorage.setItem('purchaseOrder', JSON.stringify(purchaseOrder));
    localStorage.setItem('lineItems', JSON.stringify([...lineItems]));
  };

  const showSuccessfulSaveAlert = () => {
    setSuccessAlert(true);
    const showAlert = setTimeout(() => {
      setSuccessAlert(false);
    }, 3000);

    return () => {
      clearTimeout(showAlert);
    };
  };

  const handleFormSave = async (name, description) => {
    if (!name) {
      return FORM_SAVE_RESPONSE.FAILURE;
    }
    const savedFormsRef = doc(db, user.uid, 'savedForms');
    const formRef = doc(db, user.uid, name);
    const docSnap = await getDoc(formRef);
    if (docSnap.exists()) {
      return FORM_SAVE_RESPONSE.EXISTS;
    } else {
      const savedFormsDoc = await getDoc(savedFormsRef);
      if (savedFormsDoc.exists()) {
        await updateDoc(savedFormsRef, {
          [name]: {
            description: description,
          },
        });
      } else {
        await setDoc(savedFormsRef, {
          [name]: {
            description: description,
          },
        });
      }
      await setDoc(doc(db, user.uid, name), {
        purchaseOrder: JSON.stringify(purchaseOrder),
        lineItems: JSON.stringify([...lineItems]),
        description: description,
        createDate: new Date(),
      });
      handleSave();
      showSuccessfulSaveAlert();
      return FORM_SAVE_RESPONSE.SUCCESS;
    }
  };

  const handleFormOverwrite = async (name, description) => {
    if (!name) {
      return FORM_SAVE_RESPONSE.FAILURE;
    }
    const savedFormsRef = doc(db, user.uid, 'savedForms');
    const savedFormsDoc = await getDoc(savedFormsRef);
    if (savedFormsDoc.exists()) {
      await updateDoc(savedFormsRef, {
        [name]: {
          description: description,
        },
      });
    } else {
      await setDoc(savedFormsRef, {
        [name]: {
          description: description,
        },
      });
    }
    await setDoc(doc(db, user.uid, name), {
      purchaseOrder: JSON.stringify(purchaseOrder),
      lineItems: JSON.stringify([...lineItems]),
      description: description,
      createDate: new Date(),
    });
    handleSave();
    showSuccessfulSaveAlert();
    return FORM_SAVE_RESPONSE.SUCCESS;
  };

  const handleFormDelete = async (key, index) => {
    await deleteDoc(doc(db, user.uid, key));
    await updateDoc(doc(db, user.uid, 'savedForms'), {
      [key]: deleteField(),
    });
    const newSavedForms = { ...savedForms };
    delete newSavedForms[key];
    savedFormKeys.splice(index, 1);
    changeSavedFormKeys(savedFormKeys);
    changeSavedForms(newSavedForms);
  };

  const handleSaveWithParams = (purchaseOrderToSave, lineItemsToSave) => {
    localStorage.setItem('purchaseOrder', JSON.stringify(purchaseOrderToSave));
    localStorage.setItem('lineItems', JSON.stringify([...lineItemsToSave]));
  };

  const handleReset = () => {
    let reset = confirm('Are you sure you want to reset?');
    if (reset) {
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
      setLineItems(
        new Map([
          [
            nanoid(),
            {
              item: '',
              description: '',
              unitOfMeasure: 'EA',
              orderedQuantity: '0',
              acknowledgedQuantity: '0',
              price: '0.00',
              acknowledgementStatus: 'IA',
            },
          ],
        ]),
      );
      localStorage.removeItem('purchaseOrder');
      localStorage.removeItem('lineItems');
    }
  };

  const handleLineItemReset = () => {
    let reset = confirm('Are you sure you want to clear all line items?');
    if (reset) {
      setFormErrors({});
      setLineItemErrors(new Map());
      setLineItems(
        new Map([
          [
            nanoid(),
            {
              item: '',
              description: '',
              unitOfMeasure: 'EA',
              orderedQuantity: '0',
              acknowledgedQuantity: '0',
              price: '0.00',
              acknowledgementStatus: 'IA',
            },
          ],
        ]),
      );
      localStorage.removeItem('lineItems');
    }
  };

  const handlePoDateChecked = () => {
    const newPoDateChecked = !poDateChecked;
    setPoDateChecked(newPoDateChecked);
    localStorage.setItem('poDateChecked', newPoDateChecked);
  };

  const handleAckDateChecked = () => {
    const newAckDateChecked = !ackDateChecked;
    setAckDateChecked(newAckDateChecked);
    localStorage.setItem('ackDateChecked', newAckDateChecked);
  };

  useEffect(() => {
    let savedPurchaseOrder = localStorage.getItem('purchaseOrder');
    const savedLineItems = localStorage.getItem('lineItems');
    const savedPoDateChecked = localStorage.getItem('poDateChecked');
    const savedAckDateChcked = localStorage.getItem('ackDateChecked');
    if (savedPurchaseOrder) {
      savedPurchaseOrder = JSON.parse(savedPurchaseOrder);
      setPurchaseOrder({
        ...savedPurchaseOrder,
        poDate: dayjs(savedPurchaseOrder.poDate),
        ackDate: dayjs(savedPurchaseOrder.ackDate),
      });
    }
    if (savedLineItems) {
      const savedLineItemsMap = new Map(JSON.parse(savedLineItems));
      if (!savedLineItemsMap.has(undefined)) {
        // set if parsing was done correctly
        setLineItems(savedLineItemsMap);
      }
    }
    if (savedPoDateChecked) {
      setPoDateChecked(savedPoDateChecked === 'true');
    }
    if (savedAckDateChcked) {
      setAckDateChecked(savedAckDateChcked === 'true');
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

  const openFormDrawer = () => {
    setFormDrawerOpen(true);
  };

  const closeFormDrawer = () => {
    setFormDrawerOpen(false);
  };

  const openSaveFormModel = () => {
    setSaveFormModalOpen(true);
  };

  const getSavedForms = async () => {
    if (user) {
      const savedFormsRef = doc(db, user.uid, 'savedForms');
      const savedFormsDoc = await getDoc(savedFormsRef);
      if (savedFormsDoc.exists()) {
        const data = savedFormsDoc.data();
        const formKeys = [];
        for (let key in data) {
          formKeys.push(key);
        }
        changeSavedFormKeys(formKeys.sort());
        changeSavedForms(data);
      }
    }
  };

  const openForm = (key) => {
    const docRef = doc(db, user.uid, key);
    const fetch855Form = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPurchaseOrder(JSON.parse(data.purchaseOrder));
        setLineItems(new Map(JSON.parse(data.lineItems)));
      }
    };
    fetch855Form();
  };

  const renderSavedFormsButton = () => {
    return (
      <Grid item xs={12} textAlign={'right'}>
        <IconButton onClick={openFormDrawer}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            Saved forms
          </Typography>
          <MenuOpen />
        </IconButton>
      </Grid>
    );
  };

  const renderPurchaseOrderHeader = () => {
    return (
      <>
        <Grid item xs={12} mb={-3}>
          <Typography variant="h4">Purchase Order Header</Typography>
        </Grid>
        <Grid item md={4}>
          <TextField
            fullWidth
            required
            error={formErrors.purchaseOrderNumber}
            label="Purchase order #"
            value={purchaseOrder.purchaseOrderNumber}
            onChange={(event) =>
              editPurchaseOrder(event, 'purchaseOrderNumber')
            }
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
          <FormControlLabel
            control={
              <Checkbox
                checked={poDateChecked}
                onChange={handlePoDateChecked}
              />
            }
            label="Update on submit"
          />
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
          <FormControlLabel
            control={
              <Checkbox
                checked={ackDateChecked}
                onChange={handleAckDateChecked}
              />
            }
            label="Update on submit"
          />
        </Grid>
        <Grid item md={4}>
          <IconButton onClick={() => setCommentModalOpen(true)}>
            {purchaseOrder.headerComment ? <CommentIcon /> : <AddCommentIcon />}
            <Typography ml={1}>
              {purchaseOrder.headerComment
                ? 'Edit header comment'
                : 'Add header comment'}
            </Typography>
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <LineItems
            lineItems={lineItems}
            lineItemErrors={lineItemErrors}
            setLineItems={setLineItems}
          />
        </Grid>
      </>
    );
  };

  const renderGeneratedText = () => {
    return (
      <>
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
      </>
    );
  };

  const renderFormButtons = () => {
    return (
      <>
        {successAlert && (
          <Grid item xs={12}>
            <Alert
              style={alertStyle}
              onClose={() => {
                setSuccessAlert(false);
              }}
              severity="success"
            >
              Save successful!
            </Alert>
          </Grid>
        )}
        <Grid item xs={user ? 3 : 6}>
          <Tooltip
            title="Saved!"
            fullWidth
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
              Local Save
            </Button>
          </Tooltip>
        </Grid>
        {user && (
          <Grid item xs={3}>
            <Button
              fullWidth
              onClick={openSaveFormModel}
              variant="contained"
              color="success"
            >
              Save
            </Button>
          </Grid>
        )}
        <Grid item xs={6}>
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            color="secondary"
          >
            Generate
          </Button>
          {((formErrors && Object.keys(formErrors).length > 0) ||
            (lineItemErrors && lineItemErrors.size > 0)) && (
            <Typography sx={{ color: 'red' }}>
              Unable to generate, please check the fields
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            onClick={handleLineItemReset}
            variant="contained"
            sx={{ backgroundColor: 'red' }}
          >
            Clear line items
          </Button>
        </Grid>
        <Grid item xs={6} mb={4}>
          <Button
            fullWidth
            onClick={handleReset}
            variant="contained"
            sx={{ backgroundColor: 'red' }}
          >
            Reset
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <Grid container spacing={4}>
      {user && renderSavedFormsButton()}
      {renderPurchaseOrderHeader()}
      {text && renderGeneratedText()}
      {renderFormButtons()}
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
      {saveFormModalOpen && (
        <SaveFormModal
          modalOpen={saveFormModalOpen}
          setModalOpen={setSaveFormModalOpen}
          saveForm={handleFormSave}
          formExistsMessage={
            'Form name already in use. Would you like to overwrite?'
          }
          saveFormOverwrite={handleFormOverwrite}
        />
      )}
      <Drawer anchor="right" open={formDrawerOpen} onClose={closeFormDrawer}>
        <FormDrawer
          closeFormDrawer={closeFormDrawer}
          openForm={openForm}
          savedFormKeys={savedFormKeys}
          savedForms={savedForms}
          getSavedForms={getSavedForms}
          deleteForm={handleFormDelete}
        />
      </Drawer>
    </Grid>
  );
}

export default Form855;

Form855.propTypes = {
  user: PropTypes.object,
};
