import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Modal,
  Grid,
  TextField,
} from "@mui/material";
import {
  LocalizationProvider,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../../customer/state/restaurant/Action";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "& fieldset": { borderColor: "#D8D0C8" },
    "&:hover fieldset": { borderColor: "#C85A32" },
    "&.Mui-focused fieldset": {
      borderColor: "#C85A32",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#C85A32",
  },
};

const initialFormValues = {
  image: "",
  location: "",
  name: "",
  description: "",
  startedAt: null,
  endsAt: null,
};

const CreateEvents = ({ open, handleClose}) => {
  const [formValues, setFormValues] = useState(initialFormValues);

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant
  );

  const restaurantId = usersRestaurant?.id;

  const handleChange = (e) =>
    setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleDateChange = (date, field) =>
    setFormValues({ ...formValues, [field]: date });

  const handleSubmit = (e) => {
  e.preventDefault();

  const eventData = {
    image: formValues.image,
    location: formValues.location,
    name: formValues.name,
    description: formValues.description,
    startDateTime: formValues.startedAt
      ? dayjs(formValues.startedAt).toISOString()
      : null,
    endDateTime: formValues.endsAt
      ? dayjs(formValues.endsAt).toISOString()
      : null,
  };


  dispatch(
    createEvent({
      eventData,
      jwt,
      restaurantId,
    })
  );

  setFormValues(initialFormValues);
  handleClose();
};
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            color: "text.primary",
            border: "1px solid #E5DED6",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 3,
              color: "primary.main",
            }}
          >
            Create New Event
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              {["image", "location", "name", "description"].map((field) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    fullWidth
                    name={field}
                    multiline={field === "description"}
                    rows={field === "description" ? 3 : 1}
                    label={
                      field === "image"
                        ? "Image URL"
                        : field.charAt(0).toUpperCase() + field.slice(1)
                    }
                    value={formValues[field]}
                    onChange={handleChange}
                    sx={fieldSx}
                  />
                </Grid>
              ))}

              {[
                ["startedAt", "Start Date and Time"],
                ["endsAt", "End Date and Time"],
              ].map(([field, label]) => (
                <Grid item xs={12} key={field}>
                  <DateTimePicker
                    label={label}
                    value={formValues[field]}
                    onChange={(date) => handleDateChange(date, field)}
                    slotProps={{
                      popper: {
                        placement: "top-start",
                      },
                      textField: {
                        fullWidth: true,
                        sx: {
                          ...fieldSx,
                          "& input::selection": {
                            backgroundColor: "transparent",
                          },
                          "& .MuiInputAdornment-root .MuiIconButton-root": {
                            color: "#C85A32",
                          },
                        },
                      },
                    }}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Create Event
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default CreateEvents;