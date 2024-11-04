// فتح وإغلاق القائمة الجانبية
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

// عرض الأقسام
function showSection(section) {
    closeNav();
    document.getElementById("mealContainer").style.display = "none";
    document.getElementById("searchContainer").style.display = "none";
    document.getElementById("categoryContainer").style.display = "none";
    document.getElementById("areaContainer").style.display = "none";
    document.getElementById("contactForm").style.display = "none";
    document.getElementById("loader").style.display = "none"; // إخفاء السبانر

    if (section === 'search') {
        document.getElementById("searchContainer").style.display = "block";
    } else if (section === 'categories') {
        loadCategories(); // استدعاء الدالة لجلب الفئات
        document.getElementById("categoryContainer").style.display = "block";
    } else if (section === 'area') {
        loadAreas(); // استدعاء الدالة لجلب المناطق
        document.getElementById("areaContainer").style.display = "block";
    } else if (section === 'contact') {
        document.getElementById("contactForm").style.display = "block";
    }
}

// جلب الوجبات من API وعرضها
async function loadMeals(query) {
    document.getElementById("loader").style.display = "block"; // عرض السبانر
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    const meals = data.meals ? data.meals.slice(0, 20) : []; // تحقق من وجود الوجبات
    const mealContainer = document.getElementById("mealContainer");
    mealContainer.innerHTML = '';

    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="overlay"><span>${meal.strMeal}</span></div>
        `;
        mealContainer.appendChild(mealCard);
    });
    document.getElementById("loader").style.display = "none"; // إخفاء السبانر بعد التحميل
}

// جلب الفئات من API وعرضها
async function loadCategories() {
    document.getElementById("loader").style.display = "block"; // عرض السبانر
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await response.json();
    const categories = data.categories;

    const categoryContainer = document.getElementById("categoryContainer");
    categoryContainer.innerHTML = '<h2>Categories</h2>'; // عنوان الفئات

    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('meal-card');
        categoryCard.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <div class="overlay"><span>${category.strCategory}</span></div>
        `;
        categoryContainer.appendChild(categoryCard);
    });
    document.getElementById("loader").style.display = "none"; // إخفاء السبانر بعد التحميل
}

// جلب المناطق من API وعرضها
async function fetchArea() {
    const response = await fetch(`${apiUrl}/list.php?a=list`);
    const data = await response.json();
    displayMeals(data.meals.map(area => ({
        strMeal: area.strArea,
        strMealThumb: 'https://via.placeholder.com/150' // صورة افتراضية
    })));
    document.getElementById("loader").style.display = "none";
}
async function fetchIngredients() {
    const response = await fetch(`${apiUrl}/list.php?i=list`);
    const data = await response.json();
    displayMeals(data.meals.map(ing => ({
        strMeal: ing.strIngredient,
        strMealThumb: 'https://via.placeholder.com/150' // صورة افتراضية
    })));
}
// التحقق من صحة المدخلات باستخدام Regex
function validateForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const nameRegex = /^[a-zA-Z ]{2,30}$/;
    const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    return nameRegex.test(name) && emailRegex.test(email) && passwordRegex.test(password);
}

// استدعاء بعض الوجبات عند تحميل الموقع لأول مرة
document.addEventListener("DOMContentLoaded", function() {
    loadMeals('');
});

async function searchByName() {
    const mealName = document.getElementById("mealName").value;
    document.getElementById("loader").style.display = "block"; // عرض السبانر
    loadMeals(mealName);
}

async function searchByID() {
    const mealID = document.getElementById("mealID").value;
    document.getElementById("loader").style.display = "block"; // عرض السبانر
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await response.json();
    loadMeals(data.meals ? data.meals[0].strMeal : ''); // استخدم الاسم إذا كان موجودًا
}

