function productOnClick(){
    window.location.href = "./productview.html";
}

var products = document.querySelectorAll('.product');

products.forEach(element => {
    element.addEventListener('click', productOnClick);
});

