import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteExpense,
  getRestaurantExpenses,
} from "../../state/expense/Action";

const ExpenseTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );
  const { expenses, loading } = useSelector((store) => store.expense);

  const restaurantId = usersRestaurant?.id;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    if (restaurantId) {
      dispatch(getRestaurantExpenses(restaurantId, jwt));
    }
  }, [dispatch, restaurantId]);

  const handleOpenDelete = (expense) => {
    setSelectedExpense(expense);
    setTypedTitle("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedExpense(null);
    setTypedTitle("");
  };

  const handleConfirmDelete = () => {
    if (selectedExpense && typedTitle.trim() === selectedExpense.title) {
      dispatch(deleteExpense(selectedExpense.id, jwt));
      handleCloseDelete();
    }
  };

  const isMatching =
    selectedExpense && typedTitle.trim() === selectedExpense.title;

  return (
    <Box>
      <Card>
        <CardHeader
          title="Restaurant Expenses"
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton
              onClick={() => navigate("/owner/restaurants/add-expense")}
              aria-label="add expense"
            >
              <AddIcon />
            </IconButton>
          }
        />
        <div className="p-6 bg-gray-50 min-h-screen">
          <TableContainer
            component={Paper}
            className="shadow-none border border-gray-200"
          >
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell className="font-bold">Title / Category</TableCell>
                  <TableCell className="font-bold">Amount (₹)</TableCell>
                  <TableCell className="font-bold">Expense Date</TableCell>
                  <TableCell className="font-bold" align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {expenses?.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{row.title}</p>
                        <Chip
                          label={row.category || "GENERAL"}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>₹{row.amount?.toLocaleString()}</TableCell>
                    <TableCell>{row.expenseDate || row.date}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate("/owner/restaurants/update-expense", {
                            state: { expense: row },
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDelete(row)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Confirm Delete Expense
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To delete this expense record (
            <strong>{selectedExpense?.title}</strong>), type its title below to
            confirm:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            size="small"
            variant="outlined"
            placeholder={selectedExpense?.title}
            value={typedTitle}
            onChange={(e) => setTypedTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!isMatching}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseTable;
