const searchBtn = document.getElementById("searchBtn");
const foodSearch = document.getElementById("foodSearch");

if (searchBtn && foodSearch && foodContainer) {
  searchBtn.addEventListener("click", async () => {
    const foodName = foodSearch.value.trim();
    if (!foodName) {
      foodContainer.innerHTML = "<p class='w-full text-center text-red-500 text-xl'>Please enter a meal name.</p>";
      return;
    }

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`);
      const data = await response.json();

      if (data.meals) {
        displaySearchedMeals(data.meals);
      } else {
        foodContainer.innerHTML = "<p class='w-full text-center text-red-500 text-xl'>No meals found for your search.</p>";
      }
    } catch (error) {
      console.error("Error fetching meals by name:", error);
    }
  });
}

function displaySearchedMeals(meals) {
  foodContainer.innerHTML = "";
  foodContainer.classList.add("flex", "flex-wrap", "justify-center", "gap-8", "px-10", "py-10");
  meals.forEach((meal) => {
    if (meal.strMealThumb && meal.strMealThumb.trim() !== "") {
      const mealCard = document.createElement("div");
      mealCard.className = "bg-white rounded-xl shadow-lg overflow-hidden w-80 text-center hover:shadow-2xl transition-all duration-300";
      mealCard.innerHTML = `
        <div class="relative p-4 cursor-pointer">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-50">
          <div class="absolute top-2 right-2 w-30 bg-orange-400 text-white rounded-lg">
            <h3 class="text-lg font-semibold">${meal.strMeal}</h3>
          </div>
        </div>
      `;
      foodContainer.appendChild(mealCard);
    }
  });
}