const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const singleMealEl = document.getElementById("single-meal");

//search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  singleMealEl.innerHTML = "";

  //get search term
  const term = search.value;

  //check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}': </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML =
            "<p>There are no search result. Try again! </p>";
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class = "meal">
                <img src = "${meal.strMealThumb}" alt = "${meal.strMeal}">
                <div class = "meal-info" data-mealId = "${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>


            </div>
            `
            )
            .join("");
        }
      });

    //clear search text
    search.value = "";
  } else {
    alert("Please enter a serach term");
  }
}

//fetch meal by id
function getMealById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
  <div class = "single-meal">
    <h1>${meal.strMeal}</h1>
    <img src ="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class ="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    
    </div>
    <div class ="main">
     <p>${meal.strInstructions}</p>
     <h2>Ingredients</h2>
        <ul>
        ${ingredients
          .map(
            (ing) => `
        <li>${ing}</li>
        `
          )
          .join("")}
        
        </ul>
    </div>
  </div>
  `;
}

//fetch random meal
function getRandomMeal(e) {
  //clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

//event listeners
submit.addEventListener("submit", searchMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealid");
    getMealById(mealId);
  }
});

random.addEventListener("click", getRandomMeal);
