export const categorizeIngredients = (ingredients = []) => {
  return ingredients.reduce((acc, ingredient) => {
    const categoryName = ingredient.category?.name || ingredient.category || "Other";
    
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(ingredient);
    return acc;
  }, {});
};

