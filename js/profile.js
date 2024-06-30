import { getCustomerInfo, getLoginInfo } from "./Utils/auth.js";

// Function to update the clock
function updateClock() {
  const clockElement = document.getElementById("clock");
  const now = new Date();

  // Format the time as HH:MM:SS
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately when the page loads
updateClock();

document.addEventListener("DOMContentLoaded", async function () {
  var profileSection = document.querySelector(".section-profile");
  var ordersSection = document.querySelector(".section-orders");
  var passwordSection = document.querySelector(".section-changepassword");
  var profilebtn = document.querySelectorAll(".profile-btn");
  var orderbtn = document.querySelectorAll(".order-btn");
  var passwordbtn = document.querySelectorAll(".password-btn");
  var logoutbtn = document.querySelectorAll(".logout-btn");

  var activebtn = document.getElementById("header-1-active");
  var completedbtn = document.getElementById("header-2-completed");
  var canceledbtn = document.getElementById("header-3-canceled");

  activebtn.addEventListener("click", async function () {
    activebtn.classList.add("active");
    completedbtn.classList.remove("active");
    canceledbtn.classList.remove("active");

    orderURL = `http://localhost:5083/api/CustomerOrder/ViewCurrentOrders?CustomerID=${CustomerID}`;
    await LoadOrderContent("active");
  });

  completedbtn.addEventListener("click", async function () {
    activebtn.classList.remove("active");
    completedbtn.classList.add("active");
    canceledbtn.classList.remove("active");

    orderURL = `http://localhost:5083/api/CustomerOrder/ViewOrderHistory?CustomerID=${CustomerID}`;
    await LoadOrderContent("completed");
  });

  canceledbtn.addEventListener("click", async function () {
    activebtn.classList.remove("active");
    completedbtn.classList.remove("active");
    canceledbtn.classList.add("active");

    orderURL = `http://localhost:5083/api/CustomerOrder/ViewOrderHistory?CustomerID=${CustomerID}`;
    await LoadOrderContent("canceled");
  });

  profileSection.classList.add("active");

  profilebtn.forEach((element) => {
    element.addEventListener("click", function () {
      profileSection.classList.add("active");
      ordersSection.classList.remove("active");
      passwordSection.classList.remove("active");
    });
  });

  orderbtn.forEach((element) => {
    element.addEventListener("click", function () {
      ordersSection.classList.add("active");
      profileSection.classList.remove("active");
      passwordSection.classList.remove("active");
    });
  });

  passwordbtn.forEach((element) => {
    element.addEventListener("click", function () {
      passwordSection.classList.add("active");
      profileSection.classList.remove("active");
      ordersSection.classList.remove("active");
    });
  });

  logoutbtn.forEach((element) => {
    element.addEventListener("click", function () {
      window.localStorage.clear();
      window.location.href = "./login.html";
    });
  });

  await LoadProfileContent();
  activebtn.click();
});

var CustomerID;

async function LoadProfileContent() {
  var userDetails = getLoginInfo();
  var customerInfo = getCustomerInfo();
  if (userDetails.token == undefined || customerInfo == null) {
    window.location.href = "./login.html";
  }
  const id = userDetails.id;
  const token = userDetails.token;
  await fetch(
    `http://localhost:5083/api/User/GetCustomerProfile?UserID=${id}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then(function (result) {
      if (result == null) {
        console.error("Error fetching profile:", result);
        return;
      }
      CustomerID = result.customerID;
      const valueArray = [
        result.name,
        result.address,
        result.email,
        result.phone_Number,
        getFormattedDate(result.date_of_Birth),
        result.gender,
      ];
      const elements = document.querySelectorAll(".profile-values");
      let i = 0;
      elements.forEach((element) => {
        element.innerHTML = valueArray[i];
        i++;
      });
    })
    .catch((error) => {
      console.error("Error fetching profile:", error);
    });
}

var orders = [];
var orderURL = `http://localhost:5083/api/CustomerOrder/ViewCurrentOrders?CustomerID=${CustomerID}`;

async function LoadOrderContent(status) {

  var userDetails = getLoginInfo();
  var customerInfo = getCustomerInfo();
  if (userDetails == null || customerInfo == null) {
    window.location.href = "./login.html";
  }
  const token = userDetails.token;
  await fetch(orderURL, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then(async function (result) {
      console.log(result);
      if (result == null || result.length === 0) {
        console.error("Error fetching profile:", result);
        const element = document.querySelector(".order-details-orders");
        element.innerHTML = `<center style="margin:15px"><h1>No Orders Available!</h1></center>`;
        return;
      }
      orders = result;
      if(status == "completed"){
        orders = orders.filter(order => order.status !== 4);
      }
      else if(status == "canceled"){
        orders = orders.filter(order => order.status == 4);
      }
      const element = document.querySelector(".order-details-orders");
      element.innerHTML = "";
      for (const order of orders) {
        var orderElement = document.createElement("div");
        orderElement.classList.add("order-card");

        var orderDetailsHTML = "";
        for (const detail of order.orderDetails) {
          const imageUrl = await fetchImage(detail.product.image_URL, token);
          orderDetailsHTML += ` 
            <div class="item-list">
              <img src="${imageUrl}" alt="Product Image" />
              <div class="item-details">
                <p>${detail.product.name}</p>
                <p class="light-text">Size: L</p>
                <p class="light-text">Quantity: ${detail.quantity}</p>
                <p>INR ${detail.price}</p>
              </div>
            </div>`;
        }

        orderElement.innerHTML = `
          <div class="card-split-1">
            ${orderDetailsHTML}
          </div>
          <div class="card-split-2">
            <div class="card-split-2-top">
              <div>
                <h2>Status : </h2>
                <span>${statusConversion(order.status)}</span>
              </div>
              <div>
                <h2>Date : </h2>
                <span>${getFormattedDate(order.order_Date)}</span>
              </div>
              <div>
                <h2>Sub Total : </h2>
                <span>${order.total_Amount - order.shipping_Cost}</span>
              </div>
              <div>
                <h2>Shipping Cost: </h2>
                <span>${order.shipping_Cost}</span>
              </div>
            </div>
            <div class="card-split-2-bottom">
              <h1>Total : </h1>
              <h1>${order.total_Amount}</h1>
            </div>
          </div>`;

        element.append(orderElement);
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
    });
}

async function fetchImage(imageId, token) {
  const response = await fetch(
    `http://localhost:5083/api/ImageAPI/${imageId}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

function statusConversion(status) {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Processing";
    case 2:
      return "Shipped";
    case 3:
      return "Delivered";
    case 4:
      return "Canceled";
    case 5:
      return "Refunded";
    case 6:
      return "Failed";
    default:
      return "Unknown";
  }
}

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}
