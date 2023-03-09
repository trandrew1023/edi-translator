import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import PropTypes from "prop-types";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

/**
 * This component renders the EDI Translator App Bar.
 */
export default function EdiTranslatorBar({
  profileImg = "",
  darkModeToggleButton,
}) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileModalOpen(!profileModalOpen);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            sx={{
              flexGrow: 1,
              fontSize: "1.75rem",
              fontWeight: "bold",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            EDI Translator
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            {darkModeToggleButton}
            <IconButton
              aria-label="Open profile modal"
              onClick={handleProfileClick}
            >
              {profileImg !== null &&
                (profileImg ? (
                  <Avatar
                    alt="Profile image"
                    referrerPolicy="no-referrer"
                    src={profileImg}
                  />
                ) : (
                  <Avatar alt="Profile image" />
                ))}
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
  profileImg: "",
};

EdiTranslatorBar.propTypes = {
  /**
   * The source of the profile image. Default is empty string ''.
   *
   * @default ''
   */
  profileImg: PropTypes.string,
  /**
   * Button component to toggle the app's theme.
   */
  darkModeToggleButton: PropTypes.element.isRequired,
};
