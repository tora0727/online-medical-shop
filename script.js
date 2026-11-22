const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const productForm = document.getElementById("productForm");
let seller = null;

registerForm.addEventListener("submit", function (event) {
 event.preventDefault();
 clearErrors();

 let rName = document.getElementById("rName");
 let rEmail = document.getElementById("rEmail");
 let rMobile = document.getElementById("rMobile");
 let rPassword = document.getElementById("rPassword");
 let rConfirm = document.getElementById("rConfirm");
 let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
 let valid = true;

 if (rName.value.trim() === "") {
  showError(rName, "rNameError", "Name is required.");
  valid = false;
 } else if (!/^[A-Za-z ]+$/.test(rName.value.trim())) {
  showError(rName, "rNameError", "Only letters and spaces are allowed.");
  valid = false;
 } else if (rName.value.trim().length < 3) {
  showError(rName, "rNameError", "Name must be at least 3 characters.");
  valid = false;
 } else {
  showSuccess(rName);
 }

 let email = rEmail.value.trim().toLowerCase();
 let used = sellers.some(function (s) {
  return s.email === email;
 });
 if (email === "") {
  showError(rEmail, "rEmailError", "Email is required.");
  valid = false;
 } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  showError(rEmail, "rEmailError", "Invalid email address.");
  valid = false;
 } else if (used) {
  showError(rEmail, "rEmailError", "This email is already registered.");
  valid = false;
 } else {
  showSuccess(rEmail);
 }

 if (rMobile.value.trim() === "") {
  showError(rMobile, "rMobileError", "Mobile number is required.");
  valid = false;
 } else if (!/^01[3-9][0-9]{8}$/.test(rMobile.value.trim())) {
  showError(rMobile, "rMobileError", "Must be 11 digits starting with 013-019.");
  valid = false;
 } else {
  showSuccess(rMobile);
 }

 let pw = rPassword.value;
 if (pw === "") {
  showError(rPassword, "rPasswordError", "Password is required.");
  valid = false;
 } else if (pw.length < 8) {
  showError(rPassword, "rPasswordError", "Password must be at least 8 characters.");
  valid = false;
 } else if (!/[A-Z]/.test(pw)) {
  showError(rPassword, "rPasswordError", "Add at least one uppercase letter.");
  valid = false;
 } else if (!/[a-z]/.test(pw)) {
  showError(rPassword, "rPasswordError", "Add at least one lowercase letter.");
  valid = false;
 } else if (!/[0-9]/.test(pw)) {
  showError(rPassword, "rPasswordError", "Add at least one digit.");
  valid = false;
 } else if (!/[^A-Za-z0-9]/.test(pw)) {
  showError(rPassword, "rPasswordError", "Add at least one special character.");
  valid = false;
 } else {
  showSuccess(rPassword);
 }

 if (rConfirm.value === "") {
  showError(rConfirm, "rConfirmError", "Please confirm your password.");
  valid = false;
 } else if (rConfirm.value !== pw) {
  showError(rConfirm, "rConfirmError", "Passwords do not match.");
  valid = false;
 } else {
  showSuccess(rConfirm);
 }

 if (valid) {
  sellers.push({ name: rName.value.trim(), email: email, mobile: rMobile.value.trim(), password: pw });
  localStorage.setItem("sellers", JSON.stringify(sellers));
  let message = "Account created for " + rName.value.trim() + ". Please login.";
  registerForm.reset();
  clearErrors();
  document.getElementById("registerResult").innerHTML = message;
 }
});

loginForm.addEventListener("submit", function (event) {
 event.preventDefault();
 clearErrors();

 let lEmail = document.getElementById("lEmail");
 let lPassword = document.getElementById("lPassword");
 let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
 let email = lEmail.value.trim().toLowerCase();
 let found = sellers.find(function (s) {
  return s.email === email && s.password === lPassword.value;
 });
 let valid = true;

 if (email === "") {
  showError(lEmail, "lEmailError", "Email is required.");
  valid = false;
 } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  showError(lEmail, "lEmailError", "Invalid email address.");
  valid = false;
 } else {
  showSuccess(lEmail);
 }

 if (lPassword.value === "") {
  showError(lPassword, "lPasswordError", "Password is required.");
  valid = false;
 } else if (valid && found === undefined) {
  showError(lPassword, "lPasswordError", "Wrong email or password.");
  valid = false;
 } else if (valid) {
  showSuccess(lPassword);
 }

 if (valid) {
  seller = found;
  loginForm.reset();
  clearErrors();
  showPage("dashboard");
 }
});

productForm.addEventListener("submit", function (event) {
 event.preventDefault();
 clearErrors();

 let pName = document.getElementById("pName");
 let pCategory = document.getElementById("pCategory");
 let pPrice = document.getElementById("pPrice");
 let pStock = document.getElementById("pStock");
 let condition = document.querySelector('input[name="condition"]:checked');
 let delivery = document.querySelectorAll('input[name="delivery"]:checked');
 let price = Number(pPrice.value);
 let stock = Number(pStock.value);
 let valid = true;
 if (pName.value.trim() === "") {
  showError(pName, "pNameError", "Product name is required.");
  valid = false;
 } else if (pName.value.trim().length < 3) {
  showError(pName, "pNameError", "Name must be at least 3 characters.");
  valid = false;
 } else if (pName.value.trim().length > 50) {
  showError(pName, "pNameError", "Name must be at most 50 characters.");
  valid = false;
 } else {
  showSuccess(pName);
 }

 if (pCategory.value === "") {
  showError(pCategory, "pCategoryError", "Please select a category.");
  valid = false;
 } else {
  showSuccess(pCategory);
 }

 if (pPrice.value.trim() === "") {
  showError(pPrice, "pPriceError", "Price is required.");
  valid = false;
 } else if (isNaN(price) || price <= 0) {
  showError(pPrice, "pPriceError", "Price must be a number greater than 0.");
  valid = false;
 } else {
  showSuccess(pPrice);
 }

 if (pStock.value.trim() === "") {
  showError(pStock, "pStockError", "Stock is required.");
  valid = false;
 } else if (!Number.isInteger(stock) || stock < 0 || stock > 1000) {
  showError(pStock, "pStockError", "Enter a whole number from 0 to 1000.");
  valid = false;
 } else {
  showSuccess(pStock);
 }

 if (condition === null) {
  document.getElementById("conditionError").innerHTML = "Please select New or Used.";
  valid = false;
 }

 if (delivery.length === 0) {
  document.getElementById("deliveryError").innerHTML = "Select at least 1 delivery option.";
  valid = false;
 } else if (delivery.length > 3) {
  document.getElementById("deliveryError").innerHTML = "You can select at most 3 options.";
  valid = false;
 }

 if (valid) {
  let list = [];
  delivery.forEach(function (box) {
   list.push(box.value);
  });
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.push({ seller: seller.email, name: pName.value.trim(), category: pCategory.value,
   price: price, stock: stock, condition: condition.value, delivery: list.join(", ") });
  localStorage.setItem("products", JSON.stringify(products));

  let message = "Product added: " + pName.value.trim() + " (" + stock + " in stock)";
  productForm.reset();
  clearErrors();
  document.getElementById("productResult").innerHTML = message;
  showProducts();
 }
});

function showError(input, errorId, message) {
 input.classList.add("errorBorder");
 input.classList.remove("successBorder");
 document.getElementById(errorId).innerHTML = message;
}

function showSuccess(input) {
 input.classList.remove("errorBorder");
 input.classList.add("successBorder");
}

function clearErrors() {
 let errors = document.querySelectorAll(".error");
 errors.forEach(function (item) {
  item.innerHTML = "";
 });
 let fields = document.querySelectorAll("input, select");
 fields.forEach(function (field) {
  field.classList.remove("errorBorder");
  field.classList.remove("successBorder");
 });
 let results = document.querySelectorAll(".result");
 results.forEach(function (item) {
  item.innerHTML = "";
 });
}

function showPage(page) {
 document.getElementById("registerPage").classList.add("hidden");
 document.getElementById("loginPage").classList.add("hidden");
 document.getElementById("dashboardPage").classList.add("hidden");
 document.getElementById("logoutBtn").classList.add("hidden");
 document.getElementById("shopTitle").innerHTML = "ShopSphere - Seller Centre";

 if (page === "dashboard") {
  document.getElementById("dashboardPage").classList.remove("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  document.getElementById("shopTitle").innerHTML = "Welcome, " + seller.name;
  showProducts();
 } else {
  document.getElementById(page + "Page").classList.remove("hidden");
 }
}

function showProducts() {
 let products = JSON.parse(localStorage.getItem("products")) || [];
 let body = document.getElementById("productBody");
 body.innerHTML = "";
 products.forEach(function (p) {
  if (p.seller === seller.email) {
   body.innerHTML += "<tr><td>" + p.name + "</td><td>" + p.category + "</td><td>" + p.price +
    "</td><td>" + p.stock + "</td><td>" + p.condition + "</td><td>" + p.delivery + "</td></tr>";
  }
 });
}

document.getElementById("toLogin").addEventListener("click", function (event) {
 event.preventDefault();
 clearErrors();
 showPage("login");
});
document.getElementById("toRegister").addEventListener("click", function (event) {
 event.preventDefault();
 clearErrors();
 showPage("register");
});
document.getElementById("logoutBtn").addEventListener("click", function () {
 seller = null;
 clearErrors();
 showPage("login");
});