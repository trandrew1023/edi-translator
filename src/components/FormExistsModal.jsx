import {
  Button,
  CircularProgress,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { modalStyle } from '../common/Styles';

/**
 * This component opens a modal with a message that allows the user to override an action.
 */
export default function FormExistsModal({
  message,
  modalOpen,
  saveOverwrite,
  setModalOpen,
}) {
  const [saveLoading, setSaveLoading] = useState(false);

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    setSaveLoading(true);
    await saveOverwrite();
    setSaveLoading(false);
    setModalOpen(false);
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <Box component="form" sx={modalStyle}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography color="textPrimary">{message}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'red', mr: 1 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {saveOverwrite && (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                {saveLoading ? <CircularProgress /> : 'Overwrite'}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

FormExistsModal.defaultProps = {
  saveOverwrite: null,
};

FormExistsModal.propTypes = {
  /**
   * The message displayed in the modal.
   */
  message: PropTypes.string.isRequired,
  /**
   * If `true`, the modal is shown.
   */
  modalOpen: PropTypes.bool.isRequired,
  /**
   * Callback function to continue the flow. If not provided,
   * the Overwrite button is not displayed.
   */
  saveOverwrite: PropTypes.func,
  /**
   * Callback function to toggle when the modal is shown.
   */
  setModalOpen: PropTypes.func.isRequired,
};
