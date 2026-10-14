import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Modal,
} from "@mui/material";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIngerdientCategorys from "./CreateIngredient";
import { useDispatch, useSelector } from "react-redux";
import CreateIngredient from "./CreateIngredient";
import { updateStockOfIngredient } from "../../state/ingredients/Action";

const orders = [1, 2, 3, 4, 6, 7, 8, 9];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "rounded",
  boxShadow: 24,
  p: 4,
};

const IngredientsTable = ({ ingredients, categories }) => {
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdateStock = (id) => {
    dispatch(
      updateStockOfIngredient({
        id,
        jwt,
      }),
    );
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title="Ingredients Table"
          sx={{
            pt: 2,
            alignItems: "center",
          }}
          action={
            <IconButton onClick={handleOpen} aria-label="create ingredient">
              <CreateIcon />
            </IconButton>
          }
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="ingredients table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Cost</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {ingredients?.map((ingredient, index) => (
                <TableRow
                  key={ingredient.id || index}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{ingredient.name}</TableCell>

                  <TableCell>{ingredient.category?.name || "N/A"}</TableCell>

                  <TableCell>
                    <Button onClick={() => handleUpdateStock(ingredient.id)}>
                      {ingredient.inStock ? "IN STOCK" : "OUT OF STOCK"}
                    </Button>
                  </TableCell>

                  <TableCell>{ingredient.unit}</TableCell>

                  <TableCell>{ingredient.unitCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateIngredient categories={categories} />
        </Box>
      </Modal>
    </Box>
  );
};

export default IngredientsTable;
