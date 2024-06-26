import { getLoginInfo } from "./Utils/auth.js";

var CustomerID = "";
$(document).ready(async function () {
  const productData = JSON.parse(localStorage.getItem("ProductInfo"));
  console.log(productData);
  const userDetails = getLoginInfo();
  if (userDetails == null) {
    window.location.href = "./login.html";
    return;
  }
  const id = userDetails.id;
  const token = userDetails.token;
  FetchCustomerID(id, token);

  if (productData) {
    LoadContent(productData, userDetails);
  }

  $(".add-to-cart").click(function(){
    addToCart(productData, token);
    $(".cart-btn").click();
  });
  

});


function FetchCustomerID(id, token) {
    $.ajax({
        url: `http://localhost:5083/api/User/GetCustomerProfile?UserID=${id}`, // Replace with your actual image URL endpoint
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(response) {
            // console.log(response);
            CustomerID = response.customerID;
        },
        error: function(xhr, status, error) {
            console.error('Error fetching image:', error);
        }
    });
}

function addToCart(product, token) {
    $.ajax({
        url: `http://localhost:5083/api/CustomerCart/AddItemToCart?CustomerID=${CustomerID}`, 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify({
            productID: product.productID,
            quantity: 3,
            size: "9"
        }),
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            console.log('Product added to cart:', response);
            alert('Product added to cart!');
        },
        error: function(xhr, status, error) {
            console.error('Error adding product to cart:', error);
        }
    });
}

async function LoadContent(productData, userDetails){
    const imageUrl = await fetchImage(productData.image_URL, userDetails.token);
    $("#product-img").attr("src", `${imageUrl}`); // Update the image URL to your actual endpoint
    $("#product-title").text(productData.name);
    $("#product-brand").text(productData.brand);
    $("#product-price").text(`INR ${productData.price}`);
    $(".product-description").text(productData.description);
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
