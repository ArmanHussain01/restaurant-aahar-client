import { Box, Card, CardHeader, IconButton, Modal } from "@mui/material";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import CreateIngerdientCategorys from "./CreateIngredient";
import CreateCategoryForm from "./CreateCategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { getIngredientCategory } from "../../state/ingredients/Action";

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

const IngredientCategoryTabe = ({ categories }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={"Ingredient Category"}
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton onClick={handleOpen} aria-label="settings">
              <CreateIcon />
            </IconButton>
          }
        />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">id</TableCell>
                <TableCell align="left">name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((category, index) => (
                <TableRow
                  key={category.id || index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{category.name}</TableCell>
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
          <CreateCategoryForm />
        </Box>
      </Modal>
    </Box>
  );
};

export default IngredientCategoryTabe;
