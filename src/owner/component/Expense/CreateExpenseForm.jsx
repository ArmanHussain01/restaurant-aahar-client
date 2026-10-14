import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createExpense } from "../../state/expense/Action";


const EXPENSE_CATEGORIES = [
  "SALARY",
  "RENT",
  "ELECTRICITY",
  "WATER",
  "MAINTENANCE",
  "DELIVERY",
  "OTHER",
];

const CreateExpenseForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const usersRestaurant = useSelector((store) => store.restaurant.usersRestaurant);
  const { loading, error } = useSelector((store) => store.expense);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      ...formData,
      amount: Number(formData.amount),
      restaurantId: usersRestaurant?.id,
    };

    dispatch(createExpense(usersRestaurant?.id, requestBody, jwt));
    navigate("/owner/restaurants/expenses");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Add New Expense
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Expense Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Expense Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Amount (₹)"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Expense Date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/owner/restaurants/expenses")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Creating..." : "Save Expense"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateExpenseForm;