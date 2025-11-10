const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-lg">{recipe.strMeal}</h2>
        <p className="text-sm text-gray-600 mt-1">{recipe.strCategory}</p>
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
