import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import 'firebase/compat/auth';
import PropTypes from 'prop-types';
import { React, useEffect, useState } from 'react';
import { auth } from '../common/Firebase';
import { modalStyle } from '../common/Styles';

/**
 * This component opens a modal that displays the authenticated user with actions
 * to log in or log out.
 */
export default function ProfileModal({
  profileModalOpen,
  setProfileModalOpen,
}) {
  const [user, setUser] = useState(null);
  const googleAuthProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const authUser = result.user;
        setUser(authUser);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const { email } = error.customData;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(
          'Unable to login using Google with the following errors',
          errorCode,
          errorMessage,
          email,
          credential,
        );
      });
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  });

  return (
    <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)}>
      <Box component="form" sx={modalStyle}>
        {user ? (
          <>
            <Typography variant="h6" color="textPrimary">
              Hi {user.displayName}!
            </Typography>
            <IconButton onClick={logOut}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </IconButton>
          </>
        ) : (
          <IconButton onClick={signInWithGoogle}>
            <GoogleIcon sx={{ mr: 1 }} />
            Sign in with Google
          </IconButton>
        )}
      </Box>
    </Modal>
  );
}

ProfileModal.propTypes = {
  /**
   * If `true`, the modal is shown.
   */
  profileModalOpen: PropTypes.bool.isRequired,
  /**
   * Callback function to toggle when the modal is shown.
   */
  setProfileModalOpen: PropTypes.func.isRequired,
};
