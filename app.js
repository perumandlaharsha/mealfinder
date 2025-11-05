const foodContainer = document.querySelector(".foodContainer");
const menuBtn = document.getElementById("menuBtn");
const sidePanel = document.getElementById("sidePanel");
const closeBtn = document.getElementById("closeBtn");
const categoryList = document.getElementById("categoryList");


fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((response) => response.json())
  .then((data) => {
    const foodProducts = data.categories;
    displayFood(foodProducts);
    populateSidebar(foodProducts);
  })
  .catch((error) => console.error("Error fetching data:", error));

function displayFood(products) {
  foodContainer.classList.add( "flex","flex-wrap","justify-center","gap-8","px-10","py-10");

  foodContainer.innerHTML = "";

  products.forEach((product) => {
    const foodCard = document.createElement("div");
    foodCard.className ="bg-white rounded-xl shadow-lg overflow-hidden w-80 text-center hover:shadow-2xl transition-all duration-300";

    foodCard.innerHTML = `
        <div class="relative p-4 cursor-pointer">
          <img src="${product.strCategoryThumb}" alt="${product.strCategory}" class="w-full h-50">
          <div class="absolute top-2 right-2 w-30 bg-orange-400 text-white rounded-lg">
            <h3 class="text-lg font-semibold">${product.strCategory}</h3>
          </div>
        </div>
      `;

    foodContainer.appendChild(foodCard);
  });
}

function populateSidebar(categories) {
  categoryList.innerHTML = "";
  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.textContent = cat.strCategory;
    li.className = "border-b pb-2 cursor-pointer";
    categoryList.appendChild(li);
  });
}

menuBtn.addEventListener("click", () => {
  sidePanel.classList.remove("translate-x-full");
});

closeBtn.addEventListener("click", () => {
  sidePanel.classList.add("translate-x-full");
});