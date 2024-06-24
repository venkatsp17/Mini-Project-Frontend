document.getElementById('openModalBtn').onclick = function() {
    document.getElementById('orderModal').style.display = "block";
}

document.querySelector('.close-btn').onclick = function() {
    document.getElementById('orderModal').style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('orderModal')) {
        document.getElementById('orderModal').style.display = "none";
    }
}
