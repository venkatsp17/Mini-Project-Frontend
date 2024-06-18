async function LoadContent(){
    try {
        const headerResponse = await fetch('../pages/header.html');
        if (!headerResponse.ok) {
            throw new Error('Failed to fetch header');
        }
        const headerHtml = await headerResponse.text();
        document.getElementsByClassName('header')[0].innerHTML = headerHtml;
    } catch (error) {
        console.error('Error fetching header:', error);
    }
    
    try {
        const footerResponse = await fetch('../pages/footer.html');
        if (!footerResponse.ok) {
            throw new Error('Failed to fetch footer');
        }
        const footerHtml = await footerResponse.text();
        document.getElementsByClassName('footer')[0].innerHTML = footerHtml;
    } catch (error) {
        console.error('Error fetching footer:', error);
    }
}

document.addEventListener("DOMContentLoaded",async function() {
  
    await LoadContent();
    const sideMenu = document.querySelector(".side-menu");
const menuToggle = document.querySelector(".menu-toggle");
const closeBtn = document.querySelector(".close-btn");

//Menu Toggle Open Close
menuToggle.addEventListener("click", function() {
    sideMenu.classList.add("open");
});

closeBtn.addEventListener("click", function() {
    sideMenu.classList.remove("open");
});

    const cartOverlay = document.getElementById('cartOverlay');
    const cartElement = cartOverlay.querySelector('.cart');
    const cartToggleBtn = document.querySelector('.cart-btn');
    const closeCartBtn = cartOverlay.querySelector('.close-cart');

    cartToggleBtn.addEventListener('click', function() {
        cartOverlay.classList.add('active');
        setTimeout(() => {
            cartElement.classList.add('active');
        }, 0); 
    });

    closeCartBtn.addEventListener('click', function() {
        cartElement.classList.remove('active');
        setTimeout(() => {
            cartOverlay.classList.remove('active');
        }, 300); 
    });
    const headers = document.querySelectorAll('.footer-header');

    headers.forEach(header => {
      header.addEventListener('click', () => {
        const parentSection = header.parentElement;
        parentSection.classList.toggle('active');
        const content = header.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    });

});

function toggleCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay.style.display === 'flex') {
        cartOverlay.style.display = 'none';
    } else {
        cartOverlay.style.display = 'flex';
    }
}

let widthMatch = window.matchMedia("(min-width: 768px)");
widthMatch.addEventListener('change', function(mm) {
    const headers = document.querySelectorAll('.footer-header');
    if (mm.matches) {
        headers.forEach(header => {
            const parentSection = header.parentElement;
            parentSection.classList.toggle('active');
            const content = header.nextElementSibling;
            content.style.display = "block";
            header.disabled = true;
        });
    } else {
        headers.forEach(header => {
            const parentSection = header.parentElement;
            parentSection.classList.toggle('active');
            const content = header.nextElementSibling;
            content.style.display = "none";
            header.disabled = false;
        });
    }
});


