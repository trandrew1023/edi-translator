/* eslint-disable */
import { MenuOpen } from "@mui/icons-material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CommentIcon from "@mui/icons-material/Comment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { logEvent } from "firebase/analytics";
import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";
import { React, useRef, useLayoutEffect, useEffect, useState } from "react";
import { to855 } from "../common/855Translator";
import { FORM_SAVE_RESPONSE } from "../common/Constants";
import { analytics, db } from "../common/Firebase";
import { alertStyle, tempAlertStyle } from "../common/Styles";
import poAckTypeCodes from "../static/data/poAckTypeCodes.json";
import icon from "../static/images/chick.png";
import CommentModal from "./CommentModal";
import FormDrawer from "./FormDrawer";
import LineItems from "./LineItems";
import SaveFormModal from "./SaveFormModal";
import Loopable from "./Loopable";
import InputAdornment from "@mui/material/InputAdornment";
import {
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";

/**
 * This component renders the form to modify and generate EDI 855 files.
 */
function Form855({ user }) {
  const [items, setItems] = useState(new Map());
  const [itemErrors, setItemErrors] = useState(new Map());

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4">Form 856</Typography>
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          required
          error={false}
          label="Purchase order #"
          value={""}
          onChange={() => {}}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          required
          error={false}
          label="refrence id"
          value={""}
          onChange={() => {}}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          required
          error={false}
          label="sender"
          value={""}
          onChange={() => {}}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          required
          error={false}
          label="package number"
          value={""}
          onChange={() => {}}
        />
      </Grid>
      <Loopable>
        <TextField
          fullWidth
          required
          error={itemErrors?.item}
          label="Item"
          value={items.item}
          onChange={(event) => handleEventChange(event, "item")}
        />
        {itemErrors?.item && (
          <Typography variant="caption" sx={{ color: "red" }}>
            Please fill out required field
          </Typography>
        )}
        <TextField
          fullWidth
          label="Description"
          value={items.description}
          onChange={(event) => handleEventChange(event, "description")}
        />
        <TextField
          fullWidth
          required
          error={itemErrors?.unitOfMeasure}
          label="Unit of Measure"
          value={items.unitOfMeasure}
          onChange={(event) => handleEventChange(event, "unitOfMeasure")}
        />
        {itemErrors?.unitOfMeasure && (
          <Typography variant="caption" sx={{ color: "red" }}>
            Please fill out required field
          </Typography>
        )}
        <TextField
          fullWidth
          required
          error={itemErrors?.orderedQuantity}
          label="Ordered quantity"
          value={items.orderedQuantity}
          onChange={(event) => handleEventChange(event, "orderedQuantity")}
        />
        {itemErrors?.orderedQuantity && (
          <Typography variant="caption" sx={{ color: "red" }}>
            Please fill out required field
          </Typography>
        )}
        <TextField
          fullWidth
          required
          error={itemErrors?.acknowledgedQuantity}
          label="Acknowledged quantity"
          value={items.acknowledgedQuantity}
          onChange={(event) => handleEventChange(event, "acknowledgedQuantity")}
        />
        {itemErrors?.acknowledgedQuantity && (
          <Typography variant="caption" sx={{ color: "red" }}>
            Please fill out required field
          </Typography>
        )}
      </Loopable>
    </Grid>
  );
}

export default Form855;

Form855.defaultProps = {
  user: null,
};
