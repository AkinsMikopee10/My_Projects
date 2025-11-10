const RecipeCard = ({ recipe }) => {
  return (
    <div>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <div>
        <h2>{recipe.strMeal}</h2>
        <p>{recipe.strCategory}</p>
        <a
          href={recipe.strSource || recipe.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Recipie
        </a>
      </div>
    </div>
  );
};

export default RecipeCard;
