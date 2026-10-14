import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { updateExpense } from "../../state/expense/Action";


const EXPENSE_CATEGORIES = [
  "SALARY",
  "RENT",
  "ELECTRICITY",
  "WATER",
  "MAINTENANCE",
  "DELIVERY",
  "OTHER",
];

const UpdateExpenseForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const jwt = localStorage.getItem("jwt");

  const expenseToEdit = location.state?.expense;

  const usersRestaurant = useSelector((store) => store.restaurant.usersRestaurant);
  const { loading, error } = useSelector((store) => store.expense);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    expenseDate: ""
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || "",
        amount: expenseToEdit.amount || "",
        category: expenseToEdit.category || "",
        expenseDate: expenseToEdit.expenseDate || expenseToEdit.date || "",
      });
    }
  }, [expenseToEdit]);

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

    dispatch(updateExpense(expenseToEdit?.id, requestBody, jwt));
    navigate("/owner/restaurants/expenses");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Update Expense Details
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
              {loading ? "Updating..." : "Update Expense"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UpdateExpenseForm;