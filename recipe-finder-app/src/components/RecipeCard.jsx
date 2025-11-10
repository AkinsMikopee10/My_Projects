const RecipeCard = ({ recipe, toggleFavorite, isFavorite }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 relative">
      {/* Favorite button */}
      <button
        onClick={() => toggleFavorite(recipe)}
        className={`absolute top-2 right-2 text-xl ${
          isFavorite ? "text-red-500" : "text-gray-300"
        }`}
      >
        ♥
      </button>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-lg">{recipe.strMeal}</h2>
        <p className="text-sm text-gray-500 mt-1">{recipe.strCategory}</p>
        <a
          href={recipe.strSource || recipe.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          View Recipe
        </a>
      </div>
    </div>
  );
};

export default RecipeCard;
