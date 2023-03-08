import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

/**
 * This component renders the EDI Translator App Bar.
 */
export default function EdiTranslatorBar({
  darkMode,
  profileImg = '',
  toggleDarkMode,
}) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileModalOpen(!profileModalOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        color: darkMode ? 'white' : 'black',
        background: darkMode ? '#696969' : '#D3D3D3',
      }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            sx={{
              flexGrow: 1,
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            EDI Translator
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              aria-label={
                darkMode ? 'Switch to light theme' : 'Switch to dark theme'
              }
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Tooltip title="Switch to light theme">
                  <Brightness5Icon />
                </Tooltip>
              ) : (
                <Tooltip title="Switch to dark theme">
                  <Brightness4Icon />
                </Tooltip>
              )}
            </IconButton>
            <IconButton
              aria-label="Open profile modal"
              onClick={handleProfileClick}
            >
              {profileImg ? (
                <Avatar
                  alt="Profile image"
                  referrerPolicy="no-referrer"
                  src={profileImg}
                />
              ) : (
                <Avatar alt="Profile image" />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      {profileModalOpen && (
        <ProfileModal
          profileModalOpen={profileModalOpen}
          setProfileModalOpen={setProfileModalOpen}
        />
      )}
    </AppBar>
  );
}

EdiTranslatorBar.defaultProps = {
  profileImg: '',
};

EdiTranslatorBar.propTypes = {
  /**
   * If `true`, the app theme should be dark mode and the app bar will follow the theme.
   */
  darkMode: PropTypes.bool.isRequired,
  /**
   * The source of the profile image. Default is empty string ''.
   *
   * @default ''
   */
  profileImg: PropTypes.string,
  /**
   * Callback function to toggle the app theme.
   */
  toggleDarkMode: PropTypes.func.isRequired,
};
