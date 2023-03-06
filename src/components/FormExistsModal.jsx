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

export default function FormExistsModal({
  modalOpen,
  setModalOpen,
  message,
  saveOverwrite,
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

FormExistsModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  saveOverwrite: PropTypes.func,
};
