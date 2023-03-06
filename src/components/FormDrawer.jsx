import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';

export default function FormDrawer({
  closeFormDrawer,
  openForm,
  savedFormKeys,
  savedForms,
  getSavedForms,
  deleteForm,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenForm = (key) => {
    openForm(key);
    closeFormDrawer();
  };

  const handleDeleteForm = (key, index) => {
    deleteForm(key, index);
  };

  useEffect(() => {
    setIsLoading(true);
    getSavedForms();
    setIsLoading(false);
  }, []);

  return (
    <Box
      sx={{ width: 290, m: 1 }}
      role="presentation"
      onKeyDown={closeFormDrawer}
    >
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Saved 855 Forms
      </Typography>
      {isLoading ? (
        <Grid
          container
          height="80vh"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <List>
          {savedFormKeys.length > 0 ? (
            savedFormKeys.map((key, index) => (
              <Fragment key={key}>
                <ListItem
                  secondaryAction={
                    <IconButton onClick={() => handleDeleteForm(key, index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => handleOpenForm(key)}>
                    <ListItemText
                      primary={key}
                      secondary={savedForms[key].description}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
              </Fragment>
            ))
          ) : (
            <Typography>No forms saved</Typography>
          )}
        </List>
      )}
    </Box>
  );
}

FormDrawer.propTypes = {
  closeFormDrawer: PropTypes.func.isRequired,
  openForm: PropTypes.func.isRequired,
  savedFormKeys: PropTypes.array.isRequired,
  savedForms: PropTypes.object.isRequired,
  getSavedForms: PropTypes.func.isRequired,
  deleteForm: PropTypes.func.isRequired,
};
