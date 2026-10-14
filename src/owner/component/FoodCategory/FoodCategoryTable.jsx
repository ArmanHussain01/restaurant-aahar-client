import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import CreateFoodCategory from "./CreateFoodCategory";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantsCategory } from "../../../customer/state/restaurant/Action";


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

const FoodCategoryTable = () => {
  const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const categories = useSelector((store) => store.restaurant.categories);

  const restaurantId = usersRestaurant?.id;
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (!restaurantId || !jwt) return;

    dispatch(
      getRestaurantsCategory({
        restaurantId,
        jwt,
      }),
    );
  }, [dispatch, restaurantId, jwt]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={"Food Category"}
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton onClick={handleOpen} aria-label="create category">
              <CreateIcon />
            </IconButton>
          }
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((item, index) => (
                <TableRow
                  key={item.id || item.name || index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{item.name}</TableCell>
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
          <CreateFoodCategory />
        </Box>
      </Modal>
    </Box>
  );
};

export default FoodCategoryTable;
