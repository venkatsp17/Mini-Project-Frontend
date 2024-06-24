import { saveLoginInfo } from './Utils/auth.js';

document.addEventListener("DOMContentLoaded", function () {
  const customerBtn = document.getElementById("customerBtn");
  const sellerBtn = document.getElementById("sellerBtn");
  const customerLogin = document.getElementById("customerLogin");
  const sellerLogin = document.getElementById("sellerLogin");

  customerBtn.addEventListener("click", function () {
    customerLogin.style.display = "block";
    sellerLogin.style.display = "none";
    customerBtn.classList.add("active");
    sellerBtn.classList.remove("active");
  });

  sellerBtn.addEventListener("click", function () {
    sellerLogin.style.display = "block";
    customerLogin.style.display = "none";
    sellerBtn.classList.add("active");
    customerBtn.classList.remove("active");
  });

  // Ensure animations are applied after content is loaded
  document.body.style.opacity = "1";
});

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

document.getElementById("customer-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const customerEmailInput = document.getElementById("customer-email").value;
  const customerPasswordInput = document.getElementById("customer-password").value;

  if (!customerEmailInput || !customerPasswordInput) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!isValidEmail(customerEmailInput)) {
    alert("Please enter a valid email address.");
    return;
  }

  await fetch("http://localhost:5083/api/User/Customerlogin", {
    method: "POST",
    body: JSON.stringify({
      email: customerEmailInput,
      password: customerPasswordInput,
    }),
    headers: { 
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(response => response.json())
    .then(function(result) {
      saveLoginInfo(result);
      window.location.href = './index.html';
    });
});

document.getElementById("seller-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const sellerEmailInput = document.getElementById("seller-email").value;
  const sellerPasswordInput = document.getElementById("seller-password").value;

  if (!sellerEmailInput || !sellerPasswordInput) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!isValidEmail(sellerEmailInput)) {
    alert("Please enter a valid email address.");
    return;
  }

  await fetch("http://localhost:5083/api/User/Sellerlogin", {
    method: "POST",
    body: JSON.stringify({
      email: sellerEmailInput,
      password: sellerPasswordInput,
    }),
    headers: { 
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(response => response.json())
    .then(function(result) {
      saveLoginInfo(result);
      window.location.href = './index.html';
    });
});

document.getElementById("customer-email-signin").addEventListener("click", function () {
  const queryString = new URLSearchParams({role:0}).toString();
  window.location.href = `./register.html?${queryString}`;
});

document.getElementById("seller-email-signin").addEventListener("click", function () {
    const queryString = new URLSearchParams({role:1}).toString();
    window.location.href = `./register.html?${queryString}`;
});
