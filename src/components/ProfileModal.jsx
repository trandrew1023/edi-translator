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

export default function ProfileModal({
  profileModalOpen,
  setProfileModalOpen,
  auth,
}) {
  // Modal style
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
  const [user, setUser] = useState(null);
  const googleAuthProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('Unable to login using Google with the following error');
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

  return (
    <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)}>
      <Box component="form" sx={style}>
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
  profileModalOpen: PropTypes.bool.isRequired,
  setProfileModalOpen: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
