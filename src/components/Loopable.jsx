/* eslint-disable */
import {
  ContrastOutlined,
  MenuOpen,
  ReportProblemSharp,
} from "@mui/icons-material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CommentIcon from "@mui/icons-material/Comment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Alert,
  Button,
  Checkbox,
  Collapse,
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

function Loopable(props) {
  const [items, setItems] = useState(
    new Map([[nanoid(), { item: "", description: "" }]])
  );

  const handleAddItem = () => {
    const newItems = new Map(items);
    newItems.set(nanoid(), {
      item: "",
      description: "",
    });
    setItems(newItems);
    console.log(items);
  };

  return (
    <>
      {Array.from(items).map((e, i) => {
        return <LoopItem key={i}>{props.children}</LoopItem>;
      })}
      <Grid item xs={12}>
        <Button onClick={handleAddItem}>Add</Button>
      </Grid>
    </>
  );
}

function LoopItem(props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Grid item xs={12}>
        <Button onClick={() => setIsOpen(!isOpen)}>Close</Button>
      </Grid>
      <Collapse in={isOpen}>{props.children}</Collapse>
    </>
  );
}

export default Loopable;
