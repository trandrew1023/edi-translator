import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { React } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function CommentModal({
  commentModalOpen,
  setCommentModalOpen,
  comment,
  setComment,
  header,
}) {
  const [editComment, setEditComment] = useState(comment);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: '300px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleSubmit = () => {
    setComment({ target: { value: editComment } }, 'headerComment');
    setCommentModalOpen(false);
  };

  const handleSubmitKeypress = (event) => {
    if (event.which == 13) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal open={commentModalOpen} onClose={() => setCommentModalOpen(false)}>
      <Box component="form" sx={style}>
        <Grid container>
          <Grid item xs={12}>
            <Typography sx={{ color: 'text.primary' }}>{header}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={editComment}
              onChange={(event) => setEditComment(event.target.value)}
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

CommentModal.propTypes = {
  commentModalOpen: PropTypes.bool.isRequired,
  setCommentModalOpen: PropTypes.func.isRequired,
  comment: PropTypes.string.isRequired,
  setComment: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};
