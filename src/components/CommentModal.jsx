import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { React } from "react";
import PropTypes from "prop-types";
import { useState } from "react";

export default function CommentModal({
  commentModalOpen,
  setCommentModalOpen,
  comment,
  setComment,
  header,
  target,
}) {
  const [editComment, setEditComment] = useState(comment);

  const handleSubmit = () => {
    setComment({ target: { value: editComment } }, target);
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
      <Box component="form" sx={modalStyle}>
        <Grid container>
          <Grid item xs={12}>
            <Typography sx={{ color: "text.primary" }}>{header}</Typography>
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
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setCommentModalOpen(false)}
            sx={{ mr: 1, backgroundColor: "red" }}
          >
            <Typography>Cancel</Typography>
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ backgroundColor: "green" }}
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
  target: PropTypes.string.isRequired,
};
