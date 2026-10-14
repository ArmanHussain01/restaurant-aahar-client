import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import React, { memo, useCallback, useMemo, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useDispatch } from "react-redux";
import { categorizeIngredients } from "../../../shared/util/categorizeIngredients";
import { addItemToCart } from "../../state/cart/Action";

const FALLBACK_IMG = "/placeholder.png";

const getImage = (images) =>
  (Array.isArray(images) ? images[0] : images) || FALLBACK_IMG;

const MenuCard = ({ item }) => {
  const dispatch = useDispatch();
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Computed once per item instead of on every render / checkbox click.
  const categorized = useMemo(
    () => (item?.ingredients ? categorizeIngredients(item.ingredients) : {}),
    [item?.ingredients],
  );

  const image = useMemo(() => getImage(item?.images), [item?.images]);

  const toggleIngredient = useCallback((name) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }, []);

  const handleAddItemToCart = (e) => {
    e.preventDefault();
    if (!item?.available) return;

    dispatch(
      addItemToCart({
        token: localStorage.getItem("jwt"),
        cartItem: {
          foodId: item.id,
          quantity: 1,
          ingredients: selectedIngredients,
        },
      }),
    );
    setSelectedIngredients([]); // reset after adding
  };

  const available = Boolean(item?.available);
  const categories = Object.keys(categorized);

  return (
    <Accordion
      className="w-full"
      disableGutters
      // Don't mount the ingredient checkboxes until the card is opened.
      // On a long menu this removes hundreds of DOM nodes from first render.
      TransitionProps={{ unmountOnExit: true }}
      sx={{ borderRadius: 2, "&:before": { display: "none" } }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls={`panel-${item?.id}-content`}
        id={`panel-${item?.id}-header`}
      >
        <div className="flex w-full items-center gap-4 pr-2">
          <img
            className={`h-24 w-24 shrink-0 rounded-md object-cover sm:h-28 sm:w-28 ${
              available ? "" : "grayscale opacity-60"
            }`}
            src={image}
            alt={item?.name || "Food item"}
            loading="lazy"
            decoding="async"
            width={112}
            height={112}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-lg font-semibold sm:text-xl">
                {item?.name}
              </p>
              <p className="shrink-0 font-semibold">₹{item?.price}</p>
            </div>
            <p className="line-clamp-2 text-sm text-gray-400 lg:max-w-2xl">
              {item?.description}
            </p>
            {!available && (
              <p className="text-sm font-medium text-red-500">Out of stock</p>
            )}
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <form onSubmit={handleAddItemToCart}>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-x-12 gap-y-4">
              {categories.map((category) => (
                <div key={category} className="min-w-[10rem]">
                  <Typography
                    className="capitalize"
                    sx={{ fontWeight: 700, pb: 1 }}
                    color="text.secondary"
                  >
                    {category}
                  </Typography>

                  <FormGroup>
                    {categorized[category].map((ingredient) => {
                      const name = ingredient.name || ingredient;
                      return (
                        <FormControlLabel
                          key={ingredient.id || name}
                          label={name}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedIngredients.includes(name)}
                              onChange={() => toggleIngredient(name)}
                              sx={{
                                "&.Mui-checked": { color: "#c05621" },
                              }}
                            />
                          }
                        />
                      );
                    })}
                  </FormGroup>
                </div>
              ))}
            </div>
          )}

          <div className="pt-5">
            <Button
              variant="contained"
              type="submit"
              disabled={!available}
              sx={{
                backgroundColor: "#c05621",
                "&:hover": { backgroundColor: "#9c4518" },
                "&.Mui-disabled": {
                  backgroundColor: "action.disabledBackground",
                },
              }}
            >
              {available ? "Add to cart" : "Out of stock"}
            </Button>
          </div>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(MenuCard);
