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
  Chip,
  Box,
  Card,
  CardHeader,
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
import { getRestaurantStaff, updateStaffStatus } from "../../state/staff/Action";

const StaffTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const staffList = useSelector((store) => store.staff.staffList) || [];

  const restaurantId = usersRestaurant?.id;
  const jwt = localStorage.getItem("jwt");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [typedName, setTypedName] = useState("");

  useEffect(() => {
    if (!restaurantId || !jwt) return;

    dispatch(getRestaurantStaff(jwt));
  }, [dispatch, restaurantId, jwt]);

  const handleOpenDeleteDialog = (staff) => {
    setSelectedStaff(staff);
    setTypedName("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedStaff(null);
    setTypedName("");
  };

  const handleConfirmDelete = () => {
    if (selectedStaff && typedName.trim() === selectedStaff.fullName) {
      dispatch(updateStaffStatus(selectedStaff.id, false, jwt));
      handleCloseDeleteDialog();
    }
  };

  const activeStaff = staffList.filter(
    (item) =>
      item.active !== false &&
      item.status !== false &&
      item.status !== "INACTIVE",
  );

  const isNameMatching =
    selectedStaff && typedName.trim() === selectedStaff.fullName;

  return (
    <Box>
      <Card>
        <CardHeader
          title="Staff Details"
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton
              onClick={() => navigate("/owner/restaurants/add-staff")}
              aria-label="add staff"
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
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">Role</TableCell>
                  <TableCell className="font-bold">Salary (₹)</TableCell>
                  <TableCell className="font-bold">Joining Date</TableCell>
                  <TableCell className="font-bold">Contact Info</TableCell>
                  <TableCell className="font-bold">Address</TableCell>
                  <TableCell className="font-bold" align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {activeStaff.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.role}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₹{row.salary?.toLocaleString()}</TableCell>
                    <TableCell>{row.joiningDate}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          <strong>Mobile:</strong>{" "}
                          {row.contactInformation?.mobile}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {row.contactInformation?.email}
                        </p>
                        <p>
                          <strong>Emergency:</strong>{" "}
                          {row.contactInformation?.emergencyContact}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {row.address
                          ? `${row.address.streetAddress}, ${row.address.city}, ${row.address.stateProvince} - ${row.address.postalCode}`
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          navigate("/owner/restaurants/update-staff", {
                            state: { staff: row },
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(row)}
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
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Confirm Delete Staff
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To deactivate <strong>{selectedStaff?.fullName}</strong>, please
            type their full name in the box below to confirm:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            size="small"
            variant="outlined"
            placeholder={selectedStaff?.fullName}
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!isNameMatching}
          >
            Delete Staff
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffTable;
