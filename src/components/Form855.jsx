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
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { logEvent } from 'firebase/analytics';
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
import { React, useCallback, useEffect, useState } from 'react';
import { to855 } from '../common/855Translator';
import { FORM_SAVE_RESPONSE } from '../common/Constants';
import { analytics, db } from '../common/Firebase';
import { alertStyle, tempAlertStyle } from '../common/Styles';
import poAckTypeCodes from '../static/data/poAckTypeCodes.json';
import icon from '../static/images/chick.png';
import CommentModal from './CommentModal';
import FormDrawer from './FormDrawer';
import LineItems from './LineItems';
import SaveFormModal from './SaveFormModal';

/**
 * This component renders the form to modify and generate EDI 855 files.
 */
function Form855({ user }) {
  const scrollToGeneratedText = useCallback((textRef) => {
    if (textRef !== null) {
      textRef.scrollIntoView({ behavior: 'smooth' });
    }
  });
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
  const [ackDateChecked, setAckDateChecked] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [fileDownload, setFileDownload] = useState('');
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [generatedText, setGeneratedText] = useState('');
  const [getSavedFormsLoading, setGetSavedFormsLoading] = useState(false);
  const [lineItemErrors, setLineItemErrors] = useState(new Map());
  const [poDateChecked, setPoDateChecked] = useState(false);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const [savedFormKeys, changeSavedFormKeys] = useState([]);
  const [savedForms, changeSavedForms] = useState({});
  const [saveFormModalOpen, setSaveFormModalOpen] = useState(false);
  const [saveToolTipOpen, setSaveToolTipOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [tempAlert, setTempAlert] = useState(false);

  const handleTempAlert = () => {
    setTempAlert(false);
    localStorage.setItem('tempAlert-0.8.0', true);
  };

  const handleAckDateChange = (newValue) => {
    setPurchaseOrder({ ...purchaseOrder, ackDate: newValue });
  };

  const handlePoDateChange = (newValue) => {
    setPurchaseOrder({ ...purchaseOrder, poDate: newValue });
  };

  const handleSave = () => {
    localStorage.setItem('purchaseOrder', JSON.stringify(purchaseOrder));
    localStorage.setItem('lineItems', JSON.stringify([...lineItems]));
  };

  const handleLineItemsChange = (updatedLineItems) => {
    setLineItems(updatedLineItems);
    if (generatedText) setGeneratedText('');
  };

  const handleSaveWithParams = (purchaseOrderToSave, lineItemsToSave) => {
    localStorage.setItem('purchaseOrder', JSON.stringify(purchaseOrderToSave));
    localStorage.setItem('lineItems', JSON.stringify([...lineItemsToSave]));
  };

  const handleSubmit = () => {
    logEvent(analytics, 'generate', {
      form: '855',
    });
    setFormErrors({});
    setLineItemErrors(new Map());
    setGeneratedText('');
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
      // regex only accepts positive integers or decimal numbers up to 2 decimal places of precision
      // [EX. 234, 12.8, 1.99, 15342523, 0.76]
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
    const submittedPurchaseOrder = to855(updatedPurchaseOrder, lineItems);
    const file = new Blob([submittedPurchaseOrder], { type: 'text/plain' });
    setFileDownload(window.URL.createObjectURL(file));
    setGeneratedText(submittedPurchaseOrder);
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

  const saveForm = async (name, description) => {
    if (!name) {
      return FORM_SAVE_RESPONSE.FAILURE;
    }
    const savedFormsRef = doc(db, user.uid, 'savedForms');
    const savedFormsDoc = await getDoc(savedFormsRef);
    if (savedFormsDoc.exists()) {
      await updateDoc(savedFormsRef, {
        [name]: {
          description,
        },
      });
    } else {
      await setDoc(savedFormsRef, {
        [name]: {
          description,
        },
      });
    }
    await setDoc(doc(db, user.uid, name), {
      purchaseOrder: JSON.stringify(purchaseOrder),
      lineItems: JSON.stringify([...lineItems]),
      description,
      createDate: new Date(),
    });
    handleSave();
    showSuccessfulSaveAlert();
    return FORM_SAVE_RESPONSE.SUCCESS;
  };

  const handleFormSave = async (name, description) => {
    if (!name) {
      return FORM_SAVE_RESPONSE.FAILURE;
    }
    const formRef = doc(db, user.uid, name);
    const docSnap = await getDoc(formRef);
    if (docSnap.exists()) {
      return FORM_SAVE_RESPONSE.EXISTS;
    }
    return saveForm(name, description);
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

  const resetLineItems = () => {
    setFormErrors({});
    setLineItemErrors(new Map());
    setGeneratedText('');
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
  };

  const handleReset = () => {
    logEvent(analytics, 'reset', {
      form: '855',
    });
    // eslint-disable-next-line no-alert
    const reset = window.confirm('Are you sure you want to reset?');
    if (reset) {
      setPurchaseOrder({
        purchaseOrderNumber: '',
        senderId: '',
        receiverId: '',
        accountNumber: '',
        poDate: dayjs(new Date()),
        ackDate: dayjs(new Date()),
        acknowledgementType: 'AC',
      });
      resetLineItems();
      localStorage.removeItem('purchaseOrder');
    }
  };

  const handleLineItemReset = () => {
    logEvent(analytics, 'clear_line_items', {
      form: '855',
    });
    // eslint-disable-next-line no-alert
    const reset = window.confirm(
      'Are you sure you want to clear all line items?',
    );
    if (reset) {
      setFormErrors({});
      setLineItemErrors(new Map());
      setGeneratedText('');
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
    const checkAlert = localStorage.getItem('tempAlert-0.8.0');
    if (!checkAlert) {
      setTempAlert(true);
    }
    let savedPurchaseOrder = localStorage.getItem('purchaseOrder');
    const savedLineItems = localStorage.getItem('lineItems');
    const savedPoDateChecked = localStorage.getItem('poDateChecked');
    const savedAckDateChecked = localStorage.getItem('ackDateChecked');
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
    if (savedAckDateChecked) {
      setAckDateChecked(savedAckDateChecked === 'true');
    }
  }, []);

  const handleTooltipClose = () => {
    setToolTipOpen(false);
  };

  const handleSaveTooltipClose = () => {
    setSaveToolTipOpen(false);
  };

  const editPurchaseOrder = (event, param) => {
    setGeneratedText('');
    setPurchaseOrder({ ...purchaseOrder, [param]: event.target.value });
  };

  const editPurchaseOrderHeaderComment = (updatedComment) => {
    editPurchaseOrder({ target: { value: updatedComment } }, 'headerComment');
  };

  const closeFormDrawer = () => {
    setFormDrawerOpen(false);
  };

  const openSaveFormModel = () => {
    setSaveFormModalOpen(true);
  };

  const getSavedForms = async () => {
    setGetSavedFormsLoading(true);
    // TODO optimize to check if the the form has been updated compared to the
    // current form to avoid extra document reads.
    if (user) {
      const savedFormsRef = doc(db, user.uid, 'savedForms');
      const savedFormsDoc = await getDoc(savedFormsRef);
      if (savedFormsDoc.exists()) {
        const data = savedFormsDoc.data();
        const formKeys = [];
        Object.keys(data).forEach((key) => {
          formKeys.push(key);
        });
        changeSavedFormKeys(formKeys.sort());
        changeSavedForms(data);
      }
    }
    setGetSavedFormsLoading(false);
  };

  const openFormDrawer = () => {
    logEvent(analytics, 'open_saved_forms', {
      form: '855',
    });
    getSavedForms();
    setFormDrawerOpen(true);
  };

  const openForm = (key) => {
    const docRef = doc(db, user.uid, key);
    const fetch855Form = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPurchaseOrder(JSON.parse(data.purchaseOrder));
        setLineItems(new Map(JSON.parse(data.lineItems)));
        setGeneratedText('');
      }
    };
    fetch855Form();
  };

  const renderSavedFormsButton = () => (
    <Grid item xs={12} textAlign="right">
      <IconButton onClick={openFormDrawer}>
        <Typography variant="h6" sx={{ mr: 1 }}>
          Saved forms
        </Typography>
        <MenuOpen />
      </IconButton>
    </Grid>
  );

  const renderPurchaseOrderHeader = () => (
    <>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: 3,
          marginBottom: -2,
        }}
      >
        <Typography variant="h1" fontSize={35}>
          Purchase Order Header
        </Typography>
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
        {formErrors.purchaseOrderNumber && (
          <Typography variant="caption" sx={{ color: 'red' }}>
            Please fill out required field
          </Typography>
        )}
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
        {formErrors.senderId && (
          <Typography variant="caption" sx={{ color: 'red' }}>
            Please fill out required field
          </Typography>
        )}
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
        {formErrors.receiverId && (
          <Typography variant="caption" sx={{ color: 'red' }}>
            Please fill out required field
          </Typography>
        )}
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
        <IconButton
          aria-label="Reset purchase order date to current time"
          onClick={() => handlePoDateChange(dayjs(new Date()))}
        >
          <UpdateIcon />
        </IconButton>
        <FormControlLabel
          control={
            <Checkbox checked={poDateChecked} onChange={handlePoDateChecked} />
          }
          label="Update on submit"
        />
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
        <IconButton
          aria-label="Reset purchase order date to current time"
          onClick={() => handleAckDateChange(dayjs(new Date()))}
        >
          <UpdateIcon />
        </IconButton>
        <FormControlLabel
          control={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Checkbox
              checked={ackDateChecked}
              onChange={handleAckDateChecked}
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
            onChange={(e) => editPurchaseOrder(e, 'acknowledgementType')}
          >
            {poAckTypeCodes.map((poAckTypeCode) => (
              <MenuItem value={poAckTypeCode.code} key={poAckTypeCode.code}>
                {`${poAckTypeCode.code} (${poAckTypeCode.description})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={4} sx={{ display: 'flex' }}>
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
          setLineItems={handleLineItemsChange}
        />
      </Grid>
    </>
  );

  const renderGeneratedText = () => (
    <Grid item xs={12}>
      <Typography variant="h4">Generated 855 file text</Typography>
      <Box sx={{ border: 1 }}>
        <Typography sx={{ wordBreak: 'break-word' }}>
          {generatedText.replace(/ /g, '\u00A0')}
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
            navigator.clipboard.writeText(generatedText);
            setToolTipOpen(true);
            logEvent(analytics, 'copy_generated_text', {
              form: '855',
            });
          }}
          sx={{
            marginLeft: 'auto',
            float: 'right',
          }}
        >
          <ContentCopyIcon />
          Copy to clipboard
        </IconButton>
      </Tooltip>
      <a
        download={`${purchaseOrder.purchaseOrderNumber}.855`}
        href={fileDownload}
      >
        <IconButton
          ref={scrollToGeneratedText}
          onClick={() => {
            logEvent(analytics, 'download_generated_text', {
              form: '855',
            });
          }}
          sx={{
            marginLeft: 'auto',
            float: 'right',
          }}
        >
          <DownloadIcon />
          Download
        </IconButton>
      </a>
    </Grid>
  );

  const renderFormButtons = () => (
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
              logEvent(analytics, 'local_save', {
                form: '855',
              });
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

  return (
    <Grid container spacing={4}>
      {user && renderSavedFormsButton()}
      {renderPurchaseOrderHeader()}
      {generatedText && renderGeneratedText()}
      {renderFormButtons()}
      {commentModalOpen && (
        <CommentModal
          comment={purchaseOrder.headerComment}
          commentModalOpen={commentModalOpen}
          headerText="Header Comment"
          setComment={editPurchaseOrderHeaderComment}
          setCommentModalOpen={setCommentModalOpen}
        />
      )}
      {saveFormModalOpen && (
        <SaveFormModal
          modalOpen={saveFormModalOpen}
          setModalOpen={setSaveFormModalOpen}
          saveForm={handleFormSave}
          formExistsMessage="Form name already in use. Would you like to overwrite?"
          saveFormOverwrite={saveForm}
        />
      )}
      {formDrawerOpen && (
        <FormDrawer
          closeFormDrawer={closeFormDrawer}
          deleteForm={handleFormDelete}
          formDrawerOpen={formDrawerOpen}
          isLoading={getSavedFormsLoading}
          openForm={openForm}
          savedForms={savedForms}
          savedFormKeys={savedFormKeys}
        />
      )}
      {tempAlert && (
        <Grid item xs={12}>
          <Slide direction="right" in mountOnEnter unmountOnExit>
            <Alert
              style={tempAlertStyle}
              onClose={() => {
                handleTempAlert();
              }}
              severity="info"
            >
              Hi There!
              <img
                src={icon}
                alt="Chicken Icon"
                width={20}
                style={{ marginLeft: 10 }}
              />
              <br />
              <br />
              Some new beta features have just been added! You can now log in
              using your Google account to enable saving forms!
              <br />
              <br />
              Please log any issues{' '}
              <a href="https://github.com/trandrew1023/edi-translator/issues">
                here
              </a>{' '}
              <br />
              <br />
              Goodbye!
            </Alert>
          </Slide>
        </Grid>
      )}
    </Grid>
  );
}

export default Form855;

Form855.defaultProps = {
  user: null,
};

Form855.propTypes = {
  /**
   * The authenticated Firebase user. If user is logged in, enables features
   * that require user authentication.
   *
   * @default null
   */
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
};
