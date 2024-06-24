import { getLoginInfo } from "./Utils/auth.js";

async function LoadContent() {
  try {
    const headerResponse = await fetch("../pages/header.html");
    if (!headerResponse.ok) {
      throw new Error("Failed to fetch header");
    }
    const headerHtml = await headerResponse.text();
    document.getElementsByClassName("header")[0].innerHTML = headerHtml;
  } catch (error) {
    console.error("Error fetching header:", error);
  }

  try {
    const footerResponse = await fetch("../pages/footer.html");
    if (!footerResponse.ok) {
      throw new Error("Failed to fetch footer");
    }
    const footerHtml = await footerResponse.text();
    document.getElementsByClassName("footer")[0].innerHTML = footerHtml;
  } catch (error) {
    console.error("Error fetching footer:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await LoadContent();

  const sideMenu = document.querySelector(".side-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".close-btn");

  // Menu Toggle Open Close
  menuToggle.addEventListener("click", function () {
    sideMenu.classList.add("open");
  });

  closeBtn.addEventListener("click", function () {
    sideMenu.classList.remove("open");
  });

  const cartOverlay = document.getElementById("cartOverlay");
  const cartElement = cartOverlay.querySelector(".cart");
  const cartToggleBtn = document.querySelector(".cart-btn");
  const profileBtn = document.querySelector(".profile-btn");
  const logo = document.querySelector(".logo");

  //Check cart Login
  var userDetails = getLoginInfo();
  if (userDetails == null) {
    cartElement.innerHTML = `
                            <div class="cart-header">
                            <h2>Bag</h2>
                            <button class="close-cart">X</button>
                            </div>
                            <div class="cart-body">
                                <h3><a href='./login.html'>Login / SignUp </a></h3>
                             </div>`;
  } else {
    cartElement.innerHTML = `<div class="cart-header">
            <h2>Bag</h2>
            <button class="close-cart">X</button>
        </div>
        <div class="cart-item">
            <img src="../assets/image.png" alt="Product Image">
            <div class="item-details">
                <p>Plaided Light Blue Check Shirt</p>
                <p>Color: Blue</p>
                <p>Size: L</p>
                <div class="quantity">
                    <button class="quantity-btn">-</button>
                    <span>1</span>
                    <button class="quantity-btn">+</button>
                </div>
                <p>INR 1,199</p>
            </div>
        </div>
        <div class="cart-summary">
            <p>Subtotal: INR 1,199</p>
            <p>Shipping, taxes, and discount codes calculated at checkout.</p>
            <button class="checkout-button">Proceed to Checkout</button>
        </div>`;
  }

  logo.addEventListener("click", function () {
    window.location = "./index.html";
  });

  cartToggleBtn.addEventListener("click", function () {
    cartOverlay.classList.add("active");
    setTimeout(() => {
      cartElement.classList.add("active");
    }, 0);
  });

  profileBtn.addEventListener("click", function () {
    var userDetails = getLoginInfo();
    // console.log(userDetails);
    if (userDetails == null) {
      window.location.href = "./login.html";
    } else {
      window.location.href = "./profile.html";
    }
  });
  const closeCartBtn = cartOverlay.querySelector(".close-cart");

  closeCartBtn.addEventListener("click", function () {
    cartElement.classList.remove("active");
    setTimeout(() => {
      cartOverlay.classList.remove("active");
    }, 300);
  });

  const headers = document.querySelectorAll(".footer-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const parentSection = header.parentElement;
      parentSection.classList.toggle("active");
      const content = header.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  });

  const widthMatch = window.matchMedia("(min-width: 768px)");
  function handleWidthChange(mm) {
    if (mm.matches) {
      headers.forEach((header) => {
        const parentSection = header.parentElement;
        parentSection.classList.add("active");
        const content = header.nextElementSibling;
        content.style.display = "block";
        header.disabled = true;
      });
    } else {
      headers.forEach((header) => {
        const parentSection = header.parentElement;
        parentSection.classList.remove("active");
        const content = header.nextElementSibling;
        content.style.display = "none";
        header.disabled = false;
      });
    }
  }

  handleWidthChange(widthMatch);

  widthMatch.addEventListener("change", handleWidthChange);
});
