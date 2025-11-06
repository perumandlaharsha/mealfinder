const foodContainer = document.querySelector(".foodContainer");
const menuBtn = document.getElementById("menuBtn");
const sidePanel = document.getElementById("sidePanel");
const closeBtn = document.getElementById("closeBtn");
const categoryList = document.getElementById("categoryList");
const meals = document.getElementById("meals");
const searchMeals = document.getElementById("searchMeals");


async function fetchCategories() {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const data = await response.json();
    const foodProducts = data.categories;
    displayFood(foodProducts);
    populateSidebar(foodProducts);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
fetchCategories();

function displayFood(products) {
  foodContainer.classList.add("flex", "flex-wrap", "justify-center", "gap-8", "px-10", "py-10");
  foodContainer.innerHTML = "";
  products.forEach((product) => {
    if (product.strCategoryThumb && product.strCategoryThumb.trim() !== "") {
      const foodCard = document.createElement("div");
      foodCard.className = "bg-white rounded-xl shadow-lg overflow-hidden w-80 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer";
      foodCard.innerHTML = `
        <div class="relative p-4">
          <img src="${product.strCategoryThumb}" alt="${product.strCategory}" class="w-full h-50">
          <div class="absolute top-2 right-2 w-30 bg-orange-400 text-white rounded-lg px-2">
            <h3 class="text-lg font-semibold">${product.strCategory}</h3>
          </div>
        </div>
      `;
      foodContainer.appendChild(foodCard);
      foodCard.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        displayDescription(product.strCategory, product.strCategoryDescription);
        fetchMealsByCategory(product.strCategory);
      });
    }
  });
}

function populateSidebar(categories) {
  categoryList.innerHTML = "";
  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.textContent = cat.strCategory;
    li.className = "border-b pb-2 cursor-pointer hover:text-orange-500";
    li.addEventListener("click", () => {
      displayDescription(cat.strCategory, cat.strCategoryDescription);
      fetchMealsByCategory(cat.strCategory);
      sidePanel.classList.add("translate-x-full");
    });
    categoryList.appendChild(li);
  });
}

menuBtn.addEventListener("click", () => {
  sidePanel.classList.remove("translate-x-full");
});

closeBtn.addEventListener("click", () => {
  sidePanel.classList.add("translate-x-full");
});

function displayDescription(name, description) {
  meals.innerHTML = `
    <div class="rounded-xl mx-10 my-10 p-6">
      <div class = "border p-7 rounded-lg">
        <h2 class="text-4xl font-bold text-orange-600 mb-4">${name}</h2>
        <p class="text-gray-700 text-justify text-xl">${description}</p>
      </div>
      <h3 class="text-4xl font-bold mt-6 mb-3 text-orange-500">Meals in ${name}</h3>
      <div id="similarMeals" class="flex flex-wrap gap-6 justify-center"></div>
    </div>
  `;
}

async function fetchMealsByCategory(categoryName) {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + categoryName);
    const data = await response.json();
    const similarMealsContainer = document.getElementById("similarMeals");
    similarMealsContainer.innerHTML = "";
    data.meals.forEach((meal) => {
      if (meal.strMealThumb && meal.strMealThumb.trim() !== "") {
        const mealCard = document.createElement("div");
        mealCard.className = "rounded-lg overflow-hidden shadow-md w-60 hover:shadow-lg transition-all duration-300 cursor-pointer";
        mealCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover">
          <div class="p-3">
            <h4 class="text-lg font-semibold text-gray-800">${meal.strMeal}</h4>
          </div>
        `;
        mealCard.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          fetchMealDetails(meal.idMeal);
        });

        similarMealsContainer.appendChild(mealCard);
      }
    });
  } catch (error) {
    console.error("Error fetching meals by category:", error);
  }
}

async function fetchMealDetails(mealId) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    if (data.meals && data.meals[0]) {
      displayMealDetails(data.meals[0]);
    }
  } catch (error) {
    console.error('Error fetching meal details:', error);
  }
}

function displayMealDetails(meal) {
  meals.innerHTML = `
    <div class="rounded-xl mx-10 my-10 p-6">
      <div class="md:flex-row gap-6  p-7 rounded-lg">
        <div class="w-full flex justify-center">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="rounded-lg w-100 h-100 object-cover left-0" />
        </div>
        <div>
          <h2 class="text-4xl font-bold text-orange-600 mb-2">${meal.strMeal}</h2>
          <div class="mb-3">
            <span class="font-semibold">Category:</span> ${meal.strCategory || ""}
            <span class="ml-4 font-semibold">Area:</span> ${meal.strArea || ""}
          </div>
          <div class="mb-3">
            <span class="font-semibold">Tags:</span> ${(meal.strTags || " ")}
          </div>
          <div class="mb-4"><a href="${meal.strSource || '#'}" class="text-blue-600 underline" target="_blank">Source Link</a></div>
          <h3 class="text-2xl font-bold text-orange-500 mb-2">Ingredients</h3>
          <ul class="mb-4 grid grid-cols-1 gap-2">${getIngredientsList(meal)}</ul>
          <h3 class="text-2xl font-bold text-orange-500 mb-2">Instructions</h3>
          <p class="text-gray-700 whitespace-pre-wrap">${meal.strInstructions}</p>
        </div>
      </div>
    </div>
  `;
}

function getIngredientsList(meal) {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients += `<li>🍴 ${ing} <span class="text-gray-500">(${measure || ""})</span></li>`;
    }
  }
  return ingredients;
}