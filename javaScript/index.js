// ! HTML Elements 
const closeBtn = $(".open-close-icon")
const sideNav = $(".side-nav-menu")
const openIcon = $(".open-close-icon")
const navLinks = $(".nav-links ul li")
const container = $(".container .row")

// ! Variables
let isOpen;
let mealName;
let areaName;
let ingrediantName;

// ! Functions
// ^ Function to open & close nav menu 
function openNav() {
    if (isOpen) {
        sideNav.animate({ marginLeft: "-260px" }, 500)
        openIcon.html(`<i class="fa-solid fa-align-justify fa-2x"></i>`)
        isOpen = false;
        navLinks.animate({
            top: "300px",
            transition: "top 1000ms",
        })
    }
    else {
        sideNav.animate({ marginLeft: "0px" }, 500)
        openIcon.html(`<i class="fa-solid open-close-icon fa-2x fa-x"></i>`)
        isOpen = true;
        navLinks.animate({
            top: "0px",
            transition: "top 1000ms",
        })
    }
}

// ^ Function to Get data From The API 
async function getData(url) {
    let response = await fetch(url)
    return await response.json();
}

// ^ Function to display meals
async function displayMeals() {
    const data = await getData("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    for (let i = 0; i < data.meals.length; i++) {
        container.append(`
            <div class="col-12 col-md-3">
                <div class="card mb-4 border-0 position-relative overflow-hidden rounded-3" data-id="${data.meals[i].idMeal}">
                    <img src=${data.meals[i].strMealThumb} alt="" class="w-100 rounded-3">
                    <div class="layer position-absolute w-100 h-100 d-flex align-items-center">
                        <h2 class="text-black ps-2">${data.meals[i].strMeal}</h2>
                    </div>
                </div>
            </div>` )
    }
    $(".card").on("click", function () {
        const mealID = $(this).data("id");
        displayMealDetails(mealID)
    })
}
displayMeals(getData("https://www.themealdb.com/api/json/v1/1/search.php?s="))

// ^ Function to display search inputs 
function displaySearchInputs() {
    container.append(`
        <div class="search-inputs">
            <input type="text" placeholder="Search by meal name" class="mealName w-100 p-2 rounded-3 mb-3">
            <input type="text" placeholder="Search by meal letter" class="mealLetter w-100 p-2 rounded-3 mb-3" maxlength="1">
        </div>
    `);

    $(".mealName").on("input", function () {
        const mealName = $(this).val();
        const mealLetter = $("#mealLetter").val();
        searchMeals(mealName, mealLetter);
    });

    $(".mealLetter").on("input", function () {
        const mealName = $("#mealName").val();
        const mealLetter = $(this).val();
        searchMeals(mealName, mealLetter);
    });

}

// ^ Function to search meals
async function searchMeals(mealName, mealLetter) {
    let meals = [];
    if (mealName) {
        const data = await getData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        if (data.meals) meals = meals.concat(data.meals);
    }
    if (mealLetter) {
        const data = await getData(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealLetter}`);
        if (data.meals) meals = meals.concat(data.meals);
    }
    displaySearchedMeals(meals);
}

// ^ Function to display searched meals
function displaySearchedMeals(meals) {
    const resultsContainer = container.find('.results');
    if (resultsContainer.length === 0) {
        container.append('<div class="results d-flex flex-wrap"></div>');
    }
    const results = container.find('.results');
    results.html("");

    if (meals.length > 0) {
        for (let i = 0; i < meals.length; i++) {
            results.append(`
                <div class="col-12 col-md-3 mb-4"> 
                    <div class="inner" style="padding: 10px;">
                        <div class="card border-0 position-relative overflow-hidden rounded-3" data-id="${meals[i].idMeal}">
                            <img src=${meals[i].strMealThumb} alt="" class="w-100 rounded-3">
                            <div class="layer position-absolute w-100 h-100 d-flex align-items-center">
                                <h2 class="text-black ps-2">${meals[i].strMeal}</h2>
                            </div>
                        </div>
                    </div>
                </div>`);
        }
        $(".card").on("click", function () {
            const mealID = $(this).data("id");
            displayMealDetails(mealID);
        });
    }
}

// ^ Function to display Categories
async function displayCategories() {
    const data = await getData("https://www.themealdb.com/api/json/v1/1/categories.php")
    for (let i = 0; i < data.categories.length; i++) {
        container.append(`
            <div class="col-12 col-md-3">
                <div class="card bg-black mb-4 border-0 position-relative overflow-hidden rounded-3">
                    <img src=${data.categories[i].strCategoryThumb} alt=${data.categories[i].strCategoryDescription} class="w-100 rounded-3">
                    <div class="layer position-absolute w-100 h-100 d-flex align-items-center flex-column text-black">
                        <h2 class="text-black ps-2">${data.categories[i].strCategory}</h2>
                        <p class="text-center">${data.categories[i].strCategoryDescription.split(" ").slice(0, 16).join(" ")}</p>
                    </div>
                </div>
            </div>` )
    }
    $(".card").on("click", async function () {
        mealName = $(this).find("h2").text();
        container.html("")
        displayCategoryMeals(mealName);
    })
}

// ^ Function to display Category Meals 
async function displayCategoryMeals(mealName) {
    const data = await getData(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealName}`)
    for (let i = 0; i < 20; i++) {
        container.append(`
            <div class="col-12 col-md-3">
                <div class="card mb-4 border-0 position-relative overflow-hidden rounded-3" data-id="${data.meals[i].idMeal}" >
                    <img src=${data.meals[i].strMealThumb} alt="" class="w-100 rounded-3">
                    <div class="layer position-absolute w-100 h-100 d-flex align-items-center">
                        <h2 class="text-black ps-2">${data.meals[i].strMeal}</h2>
                    </div>
                </div>
            </div>` )
    }
    $(".card").on("click", function () {
        const mealID = $(this).data("id");
        displayMealDetails(mealID);
    })
}

// ^ Function to display Areas
async function displayAreas() {
    const data = await getData("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    for (let i = 0; i < 20; i++) {
        container.append(`
        <div class="col-12 col-md-3">
            <div class="card bg-black mb-4 border-0 position-relative overflow-hidden d-flex justify-content-center align-items-center rounded-3">
                <i class="fa-solid fa-house-laptop fa-4x mb-3 text-white"></i>
                <h3 class="text-white">${data.meals[i].strArea}</h3>
            </div>
        </div>` )
    }
    $(".card").on("click", async function () {
        areaName = $(this).find("h3").text();
        container.html("")
        displayAreaMeals(areaName);
    })
}

// ^ Function to display Area Meals
async function displayAreaMeals(areaName) {
    const data = await getData(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`)
    for (let i = 0; i < 20; i++) {
        container.append(`
            <div class="col-12 col-md-3">
                <div class="card mb-4 border-0 position-relative overflow-hidden rounded-3" data-id="${data.meals[i].idMeal}">
                    <img src=${data.meals[i].strMealThumb} alt="" class="w-100 rounded-3">
                    <div class="layer position-absolute w-100 h-100 d-flex align-items-center">
                        <h2 class="text-black ps-2">${data.meals[i].strMeal}</h2>
                    </div>
                </div>
            </div>` )
    }
    $(".card").on("click", function () {
        const mealID = $(this).data("id");
        displayMealDetails(mealID);
    })
}

// ^ Function to display ingrediants
async function displayIngrediants() {
    const data = await getData("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
    for (let i = 0; i < 20; i++) {
        container.append(`
        <div class="col-12 col-md-3">
            <div class="card bg-black mb-4 border-0 position-relative overflow-hidden d-flex justify-content-center align-items-center rounded-3">
                <i class="fa-solid fa-drumstick-bite fa-4x text-white mb-2"></i>
                <h4 class="text-white text-center mb-3 fs-3">${data.meals[i].strIngredient}</h4>
                <p class="text-center text-white m-0">${data.meals[i].strDescription.split(" ").slice(0, 16).join(" ")}</p>       
            </div>
        </div>` )
    }
    $(".card").on("click", async function () {
        ingrediantName = $(this).find("h4").text();
        container.html("")
        displayIngrediantMeals(ingrediantName);
    })
}

// ^ Function to display ingrediant Meals
async function displayIngrediantMeals(ingrediantName) {
    const data = await getData(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediantName}`)
    for (let i = 0; i < data.meals.length; i++) {
        container.append(`
            <div class="col-12 col-md-3">
                <div class="card mb-4 border-0 position-relative overflow-hidden rounded-3" data-id="${data.meals[i].idMeal}">
                    <img src=${data.meals[i].strMealThumb} alt="" class="w-100 rounded-3">
                    <div class="layer position-absolute w-100 h-100 d-flex align-items-center">
                        <h2 class="text-black ps-2">${data.meals[i].strMeal}</h2>
                    </div>
                </div>
            </div>` )
    }
    $(".card").on("click", function () {
        const mealID = $(this).data("id");
        displayMealDetails(mealID);
    })
}

// ^ Function to display Meal Details
async function displayMealDetails(mealID) {
    const data = await getData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    container.html(`
        <div class="col-12 col-md-4">
                <div><img src=${data.meals[0].strMealThumb} alt="" class="w-100"></div>
                <h2 class="text-white">${data.meals[0].strMeal}</h2>
            </div>
            <div class="col-12 col-md-8 text-white">
                <h2 class="mb-3">Instruction</h2>
                <p>${data.meals[0].strInstructions}</p>
                <h3>Area : <span>${data.meals[0].strArea}</span></h3>
                <h3>category : <span>${data.meals[0].strCategory}</span></h3>
                <h3>Recipes : </h3>
                <ul class="recipes d-flex list-unstyled flex-wrap">
                    <li>${data.meals[0].strMeasure1} ${data.meals[0].strIngredient1} </li>
                    <li>${data.meals[0].strMeasure2} ${data.meals[0].strIngredient2} </li>
                    <li>${data.meals[0].strMeasure3} ${data.meals[0].strIngredient3} </li>
                    <li>${data.meals[0].strMeasure4} ${data.meals[0].strIngredient4} </li>
                    <li>${data.meals[0].strMeasure5} ${data.meals[0].strIngredient5} </li>
                    <li>${data.meals[0].strMeasure6} ${data.meals[0].strIngredient6} </li>
                </ul>
                <h3>tags : </h3>
                <button class="btn btn-success m-2">Source</button>
                <button class="btn btn-danger">Youtube</button>
            </div>
        `)
    $(".btn-success").on("click", function () {
        const url = `${data.meals[0].strSource}`;
        window.open(url, "_blank");
    });
    $(".btn-danger").on("click", function () {
        const url = `${data.meals[0].strYoutube}`;
        window.open(url, "_blank");
    });

}

// ^ Function to display Contact section
async function displayContact() {
    container.append(`
       <form>
    <div class="row py-4 d-flex align-items-center align-content-center min-vh-100">
        <div class="col-12 col-md-6">
            <input type="text" placeholder="Enter Your Name" name="username" class="w-100 p-2 rounded-3 mb-3 ">
            <p class="nameWarning warn d-none">Special characters and numbers not allowed   </p>
        </div>
        <div class="col-12 col-md-6">
            <input type="email" placeholder="Enter Your Email" name="email" class="w-100 p-2 rounded-3 mb-3">
            <p class="emailWarning warn d-none">Email not valid *exemple@yyy.zzz</p>

        </div>
        <div class="col-12 col-md-6">
            <input type="tel" placeholder="Enter Your phone" name="phone" class="w-100 p-2 rounded-3 mb-3">
            <p class="phoneWarning warn d-none">Please Enter valid Phone Number</p>

        </div>
        <div class="col-12 col-md-6">
            <input type="number" placeholder="Enter Your Age" name="age" class="w-100 p-2 rounded-3 mb-3">
            <p class="ageWarning warn d-none">Enter a valid age</p>

        </div>
        <div class="col-12 col-md-6">
            <input type="password" placeholder="Enter Your Password" name="password"
                class="w-100 p-2 rounded-3 mb-3">
            <p class="passWarning warn d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>

        </div>
        <div class="col-12 col-md-6">
            <input type="password" placeholder="Repassword" name="repassword" class="w-100 p-2 rounded-3 mb-3">
            <p class="repassWarning warn d-none">Enter valid repassword</p>

        </div>
        <button class="submitBtn btn btn-danger m-auto p-3 mt-3 disabled">Submit</button>
    </div>
</form>` )

    const nameInput = $("input[name='username']");
    const emailInput = $("input[name='email']");
    const phoneInput = $("input[name='phone']");
    const ageInput = $("input[name='age']");
    const passwordInput = $("input[name='password']");
    const repasswordInput = $("input[name='repassword']");
    const submitBtn = $(".submitBtn");
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^[0-9]+$/;
    const ageRegex = /^[1-9][0-9]*$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    function validateInput(input, regex, warning) {
        if (!regex.test(input.val())) {
            warning.removeClass("d-none");
            return false;
        } else {
            warning.addClass("d-none");
            return true;
        }
    }

    function validatePasswords() {
        if (!passwordRegex.test(passwordInput.val()) || passwordInput.val() !== repasswordInput.val()) {
            $(".passWarning").toggleClass("d-none", passwordRegex.test(passwordInput.val()));
            $(".repassWarning").toggleClass("d-none", passwordInput.val() === repasswordInput.val());
            return false;
        } else {
            $(".passWarning, .repassWarning").addClass("d-none");
            return true;
        }
    }

    function checkFormValidity() {
        const isFormValid =
            validateInput(nameInput, nameRegex, $(".nameWarning")) &&
            validateInput(emailInput, emailRegex, $(".emailWarning")) &&
            validateInput(phoneInput, phoneRegex, $(".phoneWarning")) &&
            validateInput(ageInput, ageRegex, $(".ageWarning")) &&
            validatePasswords();
        submitBtn.toggleClass("disabled", !isFormValid);
    }

    nameInput.on("input", () => { validateInput(nameInput, nameRegex, $(".nameWarning")); checkFormValidity(); });
    emailInput.on("input", () => { validateInput(emailInput, emailRegex, $(".emailWarning")); checkFormValidity(); });
    phoneInput.on("input", () => { validateInput(phoneInput, phoneRegex, $(".phoneWarning")); checkFormValidity(); });
    ageInput.on("input", () => { validateInput(ageInput, ageRegex, $(".ageWarning")); checkFormValidity(); });
    passwordInput.on("input", () => { validatePasswords(); checkFormValidity(); });
    repasswordInput.on("input", () => { validatePasswords(); checkFormValidity(); });

    submitBtn.on("click", function () {
        if (!submitBtn.hasClass("disabled")) {
            alert("Form submitted successfully!");
        } else {
            alert("Please correct the highlighted errors before submitting.");
        }
    });
}

// ! Events 
closeBtn.on("click", openNav)
$(".categories").on("click", function () {
    container.html("")
    sideNav.animate({ marginLeft: "-260px" }, 500)
    openIcon.html(`<i class="fa-solid fa-align-justify fa-2x"></i>`)
    navLinks.animate({
        top: "300px",
        transition: "top 1000ms",
    })
    isOpen = false;
    displayCategories()
})
$(".area").on("click", function () {
    container.html("")
    sideNav.animate({ marginLeft: "-260px" }, 500)
    openIcon.html(`<i class="fa-solid fa-align-justify fa-2x"></i>`)
    navLinks.animate({
        top: "300px",
        transition: "top 1000ms",
    })
    isOpen = false;
    displayAreas()
})
$(".ingrediants").on("click", function () {
    container.html("")
    sideNav.animate({ marginLeft: "-260px" }, 500)
    openIcon.html(`<i class="fa-solid fa-align-justify fa-2x"></i>`)
    navLinks.animate({
        top: "300px",
        transition: "top 1000ms",
    })
    isOpen = false;
    displayIngrediants()
})
$(".contact").on("click", function () {
    container.html("")
    sideNav.animate({ marginLeft: "-260px" }, 500)
    openIcon.html(`<i class="fa-solid fa-align-justify fa-2x"></i>`)
    navLinks.animate({
        top: "300px",
        transition: "top 1000ms",
    })
    isOpen = false;
    displayContact()
})
$(".search").on("click", function () {
    container.html("")
    sideNav.animate({ marginLeft: "-260px" }, 500)
    openIcon.html(`<i class="fa-solid fa-align-justify fa-2x"></i>`)
    navLinks.animate({
        top: "300px",
        transition: "top 1000ms",
    })
    isOpen = false;
    displaySearchInputs()
})


