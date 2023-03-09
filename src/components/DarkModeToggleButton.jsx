import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import { IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * This compenent renders the button component to toggle the app's theme.
 */
export default function DarkModeToggleButton({ darkMode, toggleDarkMode }) {
  return (
    <IconButton
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
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
  );
}

DarkModeToggleButton.propTypes = {
  /**
   * If `true`, the app theme should be dark mode and the app bar will follow the theme.
   */
  darkMode: PropTypes.bool.isRequired,
  /**
   * Callback function to toggle the app theme.
   */
  toggleDarkMode: PropTypes.func.isRequired,
};
