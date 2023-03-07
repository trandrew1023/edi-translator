import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { React, useState } from 'react';
import { modalStyle } from '../common/Styles';

/**
 * This component opens a modal with a single text field that can be edited.
 */
export default function CommentModal({
  closeOnSubmit = true,
  comment = '',
  commentModalOpen,
  headerText = 'Comment',
  setComment,
  setCommentModalOpen,
}) {
  const [updatedComment, setUpdatedComment] = useState(comment);

  const handleSubmit = () => {
    setComment(updatedComment);
    if (closeOnSubmit) {
      setCommentModalOpen(false);
    }
  };

  const handleSubmitKeypress = (event) => {
    if (event.which == 13) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal open={commentModalOpen} onClose={() => setCommentModalOpen(false)}>
      <Box component="form" sx={modalStyle}>
        <Grid container>
          <Grid item xs={12}>
            <Typography sx={{ color: 'text.primary' }}>{headerText}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={updatedComment}
              onChange={(event) => setUpdatedComment(event.target.value)}
              onKeyPress={handleSubmitKeypress}
            ></TextField>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setCommentModalOpen(false)}
            sx={{ mr: 1, backgroundColor: 'red' }}
          >
            <Typography>Cancel</Typography>
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ backgroundColor: 'green' }}
          >
            <Typography>Submit</Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

CommentModal.defaultProps = {
  closeOnSubmit: true,
};

CommentModal.propTypes = {
  /**
   * If `true`, the modal is closed on submit. Default is `true`.
   *
   * @default true
   */
  closeOnSubmit: PropTypes.bool,
  /**
   * The initial comment text. Default is empty string ''.
   *
   * @default ''
   */
  comment: PropTypes.string,
  /**
   * If `true`, the modal is shown.
   */
  commentModalOpen: PropTypes.bool.isRequired,
  /**
   * The modal text header displayed above the text field.
   *
   * @default 'Comment'
   */
  headerText: PropTypes.string,
  /**
   * Callback function to update the comment with new value.
   *
   * @param {string} updatedComment The updated comment.
   */
  setComment: PropTypes.func.isRequired,
  /**
   * Callback function to toggle when the modal is shown.
   */
  setCommentModalOpen: PropTypes.func.isRequired,
};
