import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

export default function FormDrawer({
  closeFormDrawer,
  deleteForm,
  formDrawerOpen,
  isLoading = false,
  openForm,
  savedForms,
  savedFormKeys,
}) {
  const handleOpenForm = (key) => {
    openForm(key);
    closeFormDrawer();
  };

  const handleDeleteForm = (key, index) => {
    deleteForm(key, index);
  };

  return (
    <Drawer anchor="right" open={formDrawerOpen} onClose={closeFormDrawer}>
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
    </Drawer>
  );
}

FormDrawer.defaultProps = {
  isLoading: false,
};

FormDrawer.propTypes = {
  /**
   * Callback function to close the drawer.
   */
  closeFormDrawer: PropTypes.func.isRequired,
  /**
   * Callback function to delete a form from the list.
   *
   * @param {string} key The form's unique key (should be the form's name).
   * @param {number} index The index of the form's position in the savedFormKeys.
   */
  deleteForm: PropTypes.func.isRequired,
  /**
   * If `true`, the drawer is shown.
   */
  formDrawerOpen: PropTypes.bool.isRequired,
  /**
   * If `true`, displays CircularProgress.
   *
   * @default false
   */
  isLoading: PropTypes.bool,
  /**
   * Callback funtion to provide the selected form save to open.
   *
   * @param {string} key The form's unique key (should be the form's name).
   */
  openForm: PropTypes.func.isRequired,
  /**
   * An object to reference the form's information stored as an object, where key is the
   * form's unique key (should be the form's name). The form information has:
   * {description: string,}
   */
  /* eslint-disable react/prop-types */
  savedForms: PropTypes.objectOf(PropTypes.object).isRequired,
  /**
   * The collection of form keys where each key is the
   * form's unique key (should be the form's name).
   */
  savedFormKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};
