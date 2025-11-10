import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Meal-type filter categories
  const mealTypes = ["Breakfast", "Seafood", "Beef", "Chicken", "Dessert"];

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // Search by ingredient
  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`
      );
      const data = await res.json();
      if (data.meals) setRecipes(data.meals);
      else {
        setRecipes([]);
        setError("No recipes found.");
      }
    } catch {
      setError("Failed to fetch recipes. Try again.");
    }
    setLoading(false);
  };

  // Filter by meal type
  const handleFilter = async (type) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${type}`
      );
      const data = await res.json();
      if (data.meals) setRecipes(data.meals);
      else {
        setRecipes([]);
        setError("No recipes found.");
      }
    } catch {
      setError("Failed to fetch recipes. Try again.");
    }
    setLoading(false);
  };

  // Toggle favorites
  const toggleFavorite = (recipe) => {
    let updated = [...favorites];
    if (favorites.find((r) => r.idMeal === recipe.idMeal)) {
      updated = updated.filter((r) => r.idMeal !== recipe.idMeal);
    } else {
      updated.push(recipe);
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Recipe Finder App</h1>
        <p className="text-gray-600 mt-2">Search recipes by ingredient</p>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Search bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />

        {/* Meal type filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {mealTypes.map((type) => (
            <button
              key={type}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              onClick={() => handleFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Loading & error */}
        {loading && <p className="text-center text-gray-700">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Recipe grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.some((f) => f.idMeal === recipe.idMeal)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
