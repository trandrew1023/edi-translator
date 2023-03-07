import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import { AppBar, Avatar, IconButton, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

/**
 * This component renders the EDI Translator App Bar.
 */
export default function EdiTranslationBar({
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
        background: darkMode ? '#808080' : '#D3D3D3',
      }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography
            onClick={() => {
              scrollTo(0, 0);
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
            <IconButton onClick={toggleDarkMode}>
              {darkMode === 'light' ? (
                <Brightness4Icon />
              ) : (
                <Brightness4OutlinedIcon />
              )}
            </IconButton>
            <IconButton onClick={handleProfileClick}>
              {profileImg ? <Avatar src={profileImg} /> : <Avatar />}
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

EdiTranslationBar.propTypes = {
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
