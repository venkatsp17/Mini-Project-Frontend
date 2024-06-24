// script.js
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();

    // Format the time as HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately when the page loads
updateClock();


document.addEventListener('DOMContentLoaded', function () {
    var profileSection = document.querySelector('.section-profile');
    var ordersSection = document.querySelector('.section-orders');
    var passwordSection = document.querySelector('.section-changepassword');
    var profilebtn = document.querySelectorAll('.profile-btn');
    var orderbtn = document.querySelectorAll('.order-btn');
    var passwordbtn = document.querySelectorAll('.password-btn');
    var logoutbtn = document.querySelectorAll('.logout-btn');
    
    profileSection.classList.add('active');
    
    profilebtn.forEach(element => {
        element.addEventListener('click', function () {
            profileSection.classList.add('active');
            ordersSection.classList.remove('active');
            passwordSection.classList.remove('active');
        });
    });

    orderbtn.forEach(element => {
        element.addEventListener('click', function () {
            ordersSection.classList.add('active');
            profileSection.classList.remove('active');
            passwordSection.classList.remove('active');
        });
    });
     
    passwordbtn.forEach(element => {
        element.addEventListener('click', function () {
            passwordSection.classList.add('active');
            profileSection.classList.remove('active');
            ordersSection.classList.remove('active');
        });
    });

    logoutbtn.forEach(element => {
        element.addEventListener('click', function () {
           window.localStorage.clear();
           window.location.href = './login.html';
        });
    });
});


