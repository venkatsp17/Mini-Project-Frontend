import { getCustomerInfo, getLoginInfo } from "./Utils/auth.js";

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

function addCloseCartListener() {
  const closeCartBtn = document.querySelector(".close-cart");
  const cartElement = cartOverlay.querySelector(".cart");
  closeCartBtn.addEventListener("click", function () {
    cartElement.classList.remove("active");
    setTimeout(() => {
      cartOverlay.classList.remove("active");
    }, 300);
  });
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
 

  logo.addEventListener("click", function () {
    window.location = "./index.html";
  });

  cartToggleBtn.addEventListener("click",async function (event) {
    cartOverlay.classList.add("active");
    cartElement.classList.add("active");
    // setTimeout(() => {
    //   cartElement.classList.add("active");
    // }, 0);
    await GetCartItems(event);
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





//Toast

let icon = { 
  success: 
  '<span class="material-symbols-outlined">✓</span>', 
  danger: 
  '<span class="material-symbols-outlined">error</span>', 
  warning: 
  '<span class="material-symbols-outlined">warning</span>', 
  info: 
  '<span class="material-symbols-outlined">info</span>', 
}; 

const showToast = ( 
  message = "Sample Message", 
  toastType = "info", 
  duration = 5000) => { 
  if ( 
      !Object.keys(icon).includes(toastType)) 
      toastType = "info"; 

  let box = document.createElement("div"); 
  box.classList.add( 
      "toast", `toast-${toastType}`); 
  box.innerHTML = ` <div class="toast-content-wrapper"> 
                    <div class="toast-icon"> 
                    ${icon[toastType]} 
                    </div> 
                    <div class="toast-message">${message}</div> 
                    <div class="toast-progress"></div> 
                    </div>`; 
  duration = duration || 5000; 
  box.querySelector(".toast-progress").style.animationDuration = 
          `${duration / 1000}s`; 

  let toastAlready =  
      document.body.querySelector(".toast"); 
  if (toastAlready) { 
      toastAlready.remove(); 
  } 

  document.body.appendChild(box)}; 

export function ShowToastNotification(event, type, message) {
    event.preventDefault(); 
    showToast(message,type,3000); 
}


var cartData;

async function GetCartItems(event) {
  const userDetails = getLoginInfo();
  const customerID = getCustomerInfo().CustomerID;
  const cartOverlay = document.getElementById("cartOverlay");
  const cartElement = cartOverlay.querySelector(".cart");

  if (userDetails == null || customerID == undefined) {
    cartElement.innerHTML = `
      <div class="cart-header">
        <h2>Bag</h2>
        <button class="close-cart">X</button>
      </div>
      <div class="cart-body">
        <h3><a href='./login.html'>Login / SignUp </a></h3>
      </div>`;
      addCloseCartListener();
    return;
  }

  const token = userDetails.token;

  $.ajax({
    url: `http://localhost:5083/api/CustomerCart/GetCart?customerID=${customerID}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    success:async function(response) {
      cartData = response;
      console.log(response);
      const cartItemsHtml = await Promise.all(cartData.cartItems.map(async item => {
        const imageUrl = await fetchImage(item.product.image_URL);
        return `
          <div class="cart-item">
            <img src="${imageUrl}" alt="Product Image">
            <div class="item-details">
              <p>${item.product.name}</p>
              <p>Size: ${item.size}</p>
              <div class="quantity">
                <button class="quantity-btn" data-action="decrease" data-id="${item.cartItemID}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-id="${item.cartItemID}">+</button>
              </div>
              <p class="price">INR ${item.price}</p>
            </div>
          </div>`;
      }));
      
      const subtotal = cartData.cartItems.reduce((sum, item) => sum + item.price, 0);

      cartElement.innerHTML = `
        <div class="cart-header">
          <h2>Bag</h2>
          <button class="close-cart">X</button>
        </div>
          ${cartItemsHtml}
        <div class="cart-summary">
          <h3 class="price">Subtotal: INR ${subtotal}</h3>
          <p>Shipping, taxes, and discount codes calculated at checkout.</p>
          <button class="checkout-button">Proceed to Checkout</button>
        </div>`;
        addCloseCartListener();
      // Add event listeners for quantity buttons
      $('.quantity-btn').click(function(event) {
        const action = $(this).data('action');
        const id = $(this).data('id');
        updateQuantity(id, action, event);
      });

    },
    error: function(xhr, status, error) {
      ShowToastNotification(event, 'danger', "Something went wrong!");
    }
  });

}

function updateQuantity(id, action, event) {
  var userDetails = getLoginInfo();
  const item = cartData.cartItems.find(item => item.cartItemID === id);
  if (!item) {
    console.error('Item not found in cart');
    return;
  }

  let newQuantity = item.quantity;
  if (action === 'increase') {
    newQuantity += 1;
  } else if (action === 'decrease' && newQuantity > 0) {
    newQuantity -= 1;
  }

  if (newQuantity < 0) {
    newQuantity = 0;
  }

  $.ajax({
    url: `http://localhost:5083/api/CustomerCart/UpdateCartItemQuantity?CartItemID=${id}&Quantity=${newQuantity}`,
    method: 'PUT', 
    headers: {
      "Content-type": "application/json; charset=UTF-8",
       Authorization: `Bearer ${userDetails.token}`,
    },
    success: function(response) {
      // Update the cart HTML
      GetCartItems();
    },
    error: function(xhr, status, error) {
      console.error('Failed to update item quantity:', error);
      ShowToastNotification(event, 'danger', "Failed to update item quantity!");
    }
  });
}



async function fetchImage(imageId) {
  const response = await fetch(
    `http://localhost:5083/api/ImageAPI/${imageId}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        // Authorization: `Bearer ${token}`,
      },
    }
  );
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}