import {
  Button,
  CircularProgress,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FORM_SAVE_RESPONSE } from '../common/Constants';
import { modalStyle } from '../common/Styles';
import FormExistsModal from './FormExistsModal';

/**
 * This component opens a modal to save the current form.
 */
export default function SaveFormModal({
  formExistsMessage,
  modalOpen,
  saveForm,
  saveFormOverwrite,
  setModalOpen,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formExistsOpen, setFormExistsOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleNameChange = (name) => {
    setName(name);
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    setSaveLoading(true);
    setFormErrors({});
    const checkForm = {};
    let hasError = false;
    if (!name) {
      checkForm.name = true;
      hasError = true;
    }
    setFormErrors({ ...checkForm });
    if (hasError) {
      setSaveLoading(false);
      return;
    }
    const response = await saveForm(name, description);
    switch (response) {
      case FORM_SAVE_RESPONSE.FAILURE: {
        alert('Unable to save. Please try again later');
        break;
      }
      case FORM_SAVE_RESPONSE.EXISTS: {
        setFormExistsOpen(true);
        break;
      }
      case FORM_SAVE_RESPONSE.SUCCESS: {
        setModalOpen(false);
        break;
      }
    }
    setSaveLoading(false);
  };

  const handleOverwrite = async () => {
    const response = await saveFormOverwrite(name, description);
    switch (response) {
      case FORM_SAVE_RESPONSE.FAILURE: {
        alert('Unable to save. Please try again later');
        break;
      }
      case FORM_SAVE_RESPONSE.SUCCESS: {
        setModalOpen(false);
        break;
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <Box component="form" sx={modalStyle}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" color="textPrimary">
              Save 855 Form
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="name"
              multiline
              required
              fullWidth
              label="Name"
              value={name}
              error={formErrors.name}
              onChange={(event) => handleNameChange(event.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Grid>
          {formErrors.name && (
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Typography variant="caption" sx={{ color: 'red' }}>
                Please fill out name
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              id="description"
              multiline
              fullWidth
              label="Description"
              value={description}
              onChange={(event) => handleDescriptionChange(event.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'red', mr: 1 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              {saveLoading ? <CircularProgress /> : 'Save'}
            </Button>
          </Grid>
        </Grid>
        {formExistsOpen && (
          <FormExistsModal
            modalOpen={formExistsOpen}
            setModalOpen={setFormExistsOpen}
            message={formExistsMessage}
            saveOverwrite={handleOverwrite}
          />
        )}
      </Box>
    </Modal>
  );
}

SaveFormModal.propTypes = {
  /**
   * If provided, is the message for the override functionality in response to
   * {@link FORM_SAVE_RESPONSE.EXISTS}
   */
  formExistsMessage: PropTypes.string,
  /**
   * If `true`, the modal is shown.
   */
  modalOpen: PropTypes.bool.isRequired,
  /**
   * Callback function to save the form.
   */
  saveForm: PropTypes.func.isRequired,
  /**
   * Callback function provided to FormExistsModal to overwrite and save the form.
   */
  saveFormOverwrite: PropTypes.func,
  /**
   * Callback function to toggle when the modal is shown.
   */
  setModalOpen: PropTypes.func.isRequired,
};
