import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Badge,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  clearFoodSearch,
  fetchPopularSearches,
  searchFood,
} from "../../state/search/action";
import { FoodSearchBar } from "./FoodSearchBar";
import { PopularSearches } from "./PopularSearches";
import { FoodSearchFilters } from "./FoodSearchFilters";
import { FoodSearchResults } from "./FoodSearchResults";
import { useDebouncedCallback } from "../../../shared/util/useDebouncedCallback";
import { brand} from "../../../shared/theme/searchTheme";
import { addItemToCart } from "../../state/cart/Action";

const DEFAULT_SIZE = 10;
const DEBOUNCE_MS = 400;

const SORTS = [
  { value: "relevance", label: "Relevance", sortBy: "", direction: "" },
  {
    value: "name-asc",
    label: "Name: A to Z",
    sortBy: "name",
    direction: "asc",
  },
  {
    value: "name-desc",
    label: "Name: Z to A",
    sortBy: "name",
    direction: "desc",
  },
  {
    value: "price-asc",
    label: "Price: low to high",
    sortBy: "price",
    direction: "asc",
  },
  {
    value: "price-desc",
    label: "Price: high to low",
    sortBy: "price",
    direction: "desc",
  },
];

export const SearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const jwt = localStorage.getItem("jwt");

  const user = useSelector((store) => store.auth?.user);
  const {
    foods = [],
    loading,
    error,
    page,
    totalPages,
    totalElements = 0,
    popularSearches = [],
  } = useSelector((store) => store.foodSearch || {});

  const name = searchParams.get("name") ?? "";
  const urlPage = Math.max(
    0,
    parseInt(searchParams.get("page") || "0", 10) || 0
  );
  const size = Math.min(
    50,
    Math.max(
      1,
      parseInt(searchParams.get("size") || String(DEFAULT_SIZE), 10) ||
        DEFAULT_SIZE
    )
  );
  const sortBy = searchParams.get("sortBy") ?? "";
  const direction = searchParams.get("direction") ?? "asc";

  const vegParam = searchParams.get("vegetarian") === "true";
  const seasonalParam = searchParams.get("seasonal") === "true";
  const availParam = searchParams.get("available") === "true";

  const filters = {
    vegetarian: vegParam,
    seasonal: seasonalParam,
    available: availParam,
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const sortValue =
    SORTS.find(
      (s) => s.sortBy === sortBy && (!sortBy || s.direction === direction)
    )?.value ?? "relevance";

  const [input, setInput] = useState(name);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState("");
  const lastPushedName = useRef(name);

  const updateParams = useCallback(
    (patch, { replace = false } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === false
        )
          next.delete(key);
        else next.set(key, String(value));
      });
      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams]
  );

  // Search Food Trigger
useEffect(() => {
  console.log("SEARCH EFFECT RUNNING", {
    name,
    urlPage,
    size,
    sortBy,
    direction,
    vegParam,
    seasonalParam,
    availParam,
  });

  if (!name.trim()) {
    dispatch(clearFoodSearch());
    return;
  }

  console.log("DISPATCHING searchFood");

  dispatch(
    searchFood(
      {
        name,
        page: urlPage,
        size,
        sortBy,
        direction,
        vegetarian: vegParam,
        seasonal: seasonalParam,
        available: availParam,
      },
      jwt
    )
  );
}, [
  dispatch,
  name,
  urlPage,
  size,
  sortBy,
  direction,
  vegParam,
  seasonalParam,
  availParam,
  jwt,
]);

  // Fetch Popular Searches
  useEffect(() => {
    console.log("hello mushi mushi");
    
    dispatch(fetchPopularSearches(jwt));
  }, [dispatch, jwt]);

  // Sync input value with URL parameter changes
  useEffect(() => {
    if (name !== lastPushedName.current) {
      lastPushedName.current = name;
      setInput(name);
    }
  }, [name]);

  const applyTyped = useDebouncedCallback((term) => {
    lastPushedName.current = term;
    updateParams({ name: term, page: 0, size }, { replace: true });
  }, DEBOUNCE_MS);

  const handleInputChange = (value) => {
    setInput(value);
    applyTyped(value.trim());
  };

  const applySearch = (term) => {
    applyTyped.cancel();
    const keyword = term.trim();
    setInput(keyword);
    lastPushedName.current = keyword;
    updateParams({ name: keyword, page: 0, size });
  };

  const handleClear = () => applySearch("");

  const handleSortChange = (value) => {
    const sort = SORTS.find((s) => s.value === value);
    if (sort) {
      updateParams({
        sortBy: sort.sortBy,
        direction: sort.direction,
        page: 0,
      });
    }
  };

// Single parameter update prevents React state batching race conditions
const handleFilterChange = (selectedType) => {
  updateParams({
    vegetarian: selectedType === "vegetarian" ? "true" : undefined,
    seasonal: selectedType === "seasonal" ? "true" : undefined,
    available: selectedType === "available" ? "true" : undefined,
    page: 0,
  });
};

const handleClearFilters = () => {
  updateParams({
    vegetarian: undefined,
    seasonal: undefined,
    available: undefined,
    page: 0,
  });
};

  const handlePageChange = (_, value) => {
    updateParams({ page: value - 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () =>
    dispatch(
      searchFood(
        {
          name,
          page: urlPage,
          size,
          sortBy,
          direction,
          vegetarian: vegParam,
          seasonal: seasonalParam,
          available: availParam,
        },
        jwt
      )
    );

  const handleAddToCart = (food) => {
    if (!user) {
      navigate("/account/login");
      return;
    }
    dispatch(
      addItemToCart({
        token: jwt,
        cartItem: { foodId: food.id, quantity: 1 },
      })
    );
    setToast(`${food.name} added to cart`);
  };

  const visibleFoods = foods;

  const countText = loading
    ? `Searching for “${name}”…`
    : `${totalElements} ${totalElements === 1 ? "result" : "results"} for “${name}”`;


  return (
  <Box
    sx={{
      bgcolor: brand.cream,
      minHeight: "calc(100vh - 64px)",
      overflowX: "hidden",
    }}
  >
    <Box
      sx={{
        maxWidth: 1280,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 2.5, md: 4 },
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        align="center"
        sx={{ fontWeight: 800, color: brand.text, mb: 2 }}
      >
        Search food
      </Typography>

      {/* Centered FoodSearchBar Box */}
      <Box sx={{ maxWidth: 760, mx: "auto" }}>
        <FoodSearchBar
          value={input}
          onChange={handleInputChange}
          onSubmit={applySearch}
          onClear={handleClear}
          autoFocus={!name}
          clearOnEscape
        />
      </Box>

      {/* Centered PopularSearches Box */}
      <Box sx={{ mt: 2, maxWidth: 760, mx: "auto" }}>
        <PopularSearches
          items={popularSearches}
          onSelect={applySearch}
          activeKeyword={name}
        />
      </Box>

      {name && (
        <Box
          sx={{
            mt: 3,
            mb: 2,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography
            role="status"
            aria-live="polite"
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: brand.text,
              overflowWrap: "anywhere",
              minWidth: 0,
            }}
          >
            {countText}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Badge
              badgeContent={activeFilterCount}
              sx={{
                display: { lg: "none" },
                "& .MuiBadge-badge": {
                  bgcolor: brand.primary,
                  color: "#fff",
                },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setFiltersOpen(true)}
                sx={{
                  minHeight: 44,
                  textTransform: "none",
                  fontWeight: 700,
                  color: brand.primary,
                  borderColor: brand.primary,
                  bgcolor: "#fff",
                }}
              >
                Filters
              </Button>
            </Badge>

            <FormControl
              size="small"
              sx={{ flex: { xs: 1, sm: "none" }, minWidth: { sm: 210 } }}
            >
              <InputLabel id="sort-label">Sort by</InputLabel>
              <Select
                labelId="sort-label"
                label="Sort by"
                value={sortValue}
                onChange={(e) => handleSortChange(e.target.value)}
                sx={{ bgcolor: "#fff", minHeight: 44, borderRadius: 2 }}
              >
                {SORTS.map((s) => (
                  <MenuItem
                    key={s.value}
                    value={s.value}
                    sx={{ minHeight: 44 }}
                  >
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 3,
          mt: name ? 0 : 3,
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: name ? "240px minmax(0, 1fr)" : "minmax(0, 1fr)",
          },
          alignItems: "start",
        }}
      >
        {name && (
          <FoodSearchFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            activeCount={activeFilterCount}
            mobileOpen={filtersOpen}
            onMobileClose={() => setFiltersOpen(false)}
          />
        )}

        <Box sx={{ minWidth: 0 }}>
          <FoodSearchResults
            loading={loading}
            error={error}
            foods={visibleFoods}
            rawCount={foods.length}
            keyword={name}
            popularSearches={popularSearches}
            onRetry={handleRetry}
            onSelectPopular={applySearch}
            onAddToCart={handleAddToCart}
            onClearFilters={handleClearFilters}
          />

          {name && !loading && !error && totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 2,
                maxWidth: "100%",
              }}
            >
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                size={isMobile ? "small" : "medium"}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": { minWidth: 36, height: 36 },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: brand.primary,
                    color: "#fff",
                    "&:hover": { bgcolor: brand.primaryDark },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>

    <Snackbar
      open={!!toast}
      autoHideDuration={2500}
      onClose={() => setToast("")}
      message={toast}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  </Box>
);
};

export default SearchPage;
