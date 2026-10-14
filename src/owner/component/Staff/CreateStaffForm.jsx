import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { createStaff } from "../../state/staff/Action";

const STAFF_ROLES = [
  "CHEF",
  "CLEANER",
  "RECEPTIONIST",
  "WAITER",
  "DELIVERY_PERSON",
  "MANAGER",
  "HELPER",
  "OTHER",
];


const CreateStaffForm = () => {
    
  const navigate = useNavigate();  
  const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantId = usersRestaurant?.id;
  const jwt = localStorage.getItem("jwt");

  const { loading, error } = useSelector((state) => state.staff);

  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    salary: "",
    joiningDate: "",

    address: {
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
    },

    contactInformation: {
      mobile: "",
      emergencyContact: "",
      email: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      contactInformation: {
        ...prev.contactInformation,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      salary: Number(formData.salary),
    };

    dispatch(
      createStaff({
        restaurantId,
        staffData: requestData,
        jwt,
        navigate: () => navigate("/owner/restaurants/staff"),
      }),
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Create Staff
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Basic Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.category}
                  label="Role"
                  onChange={handleChange}
                >
                  {STAFF_ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Joining Date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{
              mt: 4,
              mb: 2,
            }}
          >
            Contact Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Mobile"
                name="mobile"
                value={formData.contactInformation.mobile}
                onChange={handleContactChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="emergencyContact"
                name="emergencyContact"
                value={formData.contactInformation.emergencyContact}
                onChange={handleContactChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData.contactInformation.email}
                onChange={handleContactChange}
              />
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{
              mt: 4,
              mb: 2,
            }}
          >
            Address
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Street Address"
                name="streetAddress"
                value={formData.address.streetAddress}
                onChange={handleAddressChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="City"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="State / Province"
                name="stateProvince"
                value={formData.address.stateProvince}
                onChange={handleAddressChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Postal Code"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={handleAddressChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Country"
                name="country"
                value={formData.address.country}
                onChange={handleAddressChange}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Creating..." : "Create Staff"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateStaffForm;
