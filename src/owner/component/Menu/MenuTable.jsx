import { Box, Button, Card, CardHeader, IconButton, Chip } from "@mui/material";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMenuItem,
  getMenuItemsByRestaurantId,
  updateMenuItemAvailability,
} from "../../../customer/state/menu/Action";
import { getIngredientsOfRestaurant } from "../../state/ingredients/Action";

const MenuTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const { usersRestaurant } = useSelector((store) => store.restaurant);

  const menuItems = useSelector(
    (store) => store.menu.menuItems?.content || store.menu.menuItems || [],
  );

  const restaurantIngredients = useSelector(
    (store) =>
      store.ingredients?.ingredients ||
      store.ingredients?.ingredientsItems ||
      [],
  );

  const restaurantId = usersRestaurant?.id;

  useEffect(() => {
    if (!restaurantId || !jwt) return;

    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId,
        jwt,
      }),
    );

    dispatch(
      getIngredientsOfRestaurant({
        restaurantId,
        jwt,
      }),
    );
  }, [dispatch, restaurantId, jwt]);

  const handleAvailability = (foodId) => {
    dispatch(
      updateMenuItemAvailability({
        foodId,
        jwt,
      }),
    );
  };

  const handleDeleteFood = (foodId) => {
    dispatch(
      deleteMenuItem({
        foodId,
        jwt,
      }),
    );
  };

  const renderIngredientName = (foodIngredient) => {
    const ingredient = foodIngredient.ingredient;

    if (!ingredient) {
      return `${foodIngredient.quantity} ${foodIngredient.unit}`;
    }

    return `${ingredient.name} (${foodIngredient.quantity} ${foodIngredient.unit})`;
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title="Menu"
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton
              onClick={() => navigate("/owner/restaurants/add-menu")}
              aria-label="add menu"
            >
              <CreateIcon />
            </IconButton>
          }
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Ingredients</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {menuItems.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>

                  <TableCell>{item.name}</TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.foodIngredients?.length > 0 ? (
                        item.foodIngredients.map((foodIngredient) => (
                          <Chip
                            key={foodIngredient.id}
                            label={renderIngredientName(foodIngredient)}
                            size="small"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No ingredients
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>₹{item.price}</TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      color={item.available ? "success" : "error"}
                      onClick={() => handleAvailability(item.id)}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteFood(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default MenuTable;
