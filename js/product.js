import { getLoginInfo } from "./Utils/auth.js";

function productOnClick(product){
    window.localStorage.setItem('ProductInfo', JSON.stringify(product));
    window.location.href = "./productview.html";
}

const pageSize = 5; 
let currentPage = 1;
let isFetching = false; // Flag to track if a fetch is in progress

async function fetchProducts(page) {
    try {
        const response = await fetch(`http://localhost:5083/api/CustomerProduct/GetAllProducts?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(await response.json());
        return await response.json(); 
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; 
    }
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

async function renderProducts(products) {
    const productsContainer = document.querySelector('.products');
    // const userDetails = getLoginInfo();
    // if (userDetails == null) {
    //     window.location.href = './login.html';
    //     return;
    // }
    for (const product of products) {
        const imageUrl = await fetchImage(product.image_URL);
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}">
            <h2>${product.name}</h2>
            <div class="price">
                <span><b>Brand:</b> ${product.brand}</span>
                <span class="discounted-price">₹${product.price}</span>
            </div>`;
        productElement.addEventListener('click',()=> productOnClick(product));
        productsContainer.appendChild(productElement);


    }
}

function handleScroll() {
    const footer = document.querySelector('.footer'); 
    const footerHeight = footer ? footer.offsetHeight : 0;

    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - footerHeight) && !isFetching) {
        isFetching = true; 
        currentPage++;
        fetchProducts(currentPage)
            .then(products => {
                renderProducts(products);
                isFetching = false; 
            })
            .catch(error => {
                console.error('Error fetching more products:', error);
                isFetching = false; 
            });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const initialProducts = await fetchProducts(currentPage);
    renderProducts(initialProducts);
    window.addEventListener('scroll', handleScroll);
});
