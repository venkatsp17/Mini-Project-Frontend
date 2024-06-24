document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;

    const email = document.getElementById("email");
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const phone_number = document.getElementById("phone_number");
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    // Clear previous error messages
    document
      .querySelectorAll(".error-message")
      .forEach((error) => (error.style.display = "none"));

    // Email validation
    if (!email.validity.valid) {
      document.getElementById("email-error").textContent =
        "Please enter a valid email.";
      document.getElementById("email-error").style.display = "block";
      valid = false;
    }

    // Name validation
    if (!name.value.trim()) {
      document.getElementById("name-error").textContent = "Name is required.";
      document.getElementById("name-error").style.display = "block";
      valid = false;
    }

    // Address validation
    if (!address.value.trim()) {
      document.getElementById("address-error").textContent =
        "Address is required.";
      document.getElementById("address-error").style.display = "block";
      valid = false;
    }

    // Phone number validation
    if (!phone_number.validity.valid) {
      document.getElementById("phone_number-error").textContent =
        "Please enter a valid 10 digit phone number.";
      document.getElementById("phone_number-error").style.display = "block";
      valid = false;
    }

    // Username validation
    if (!username.value.trim()) {
      document.getElementById("username-error").textContent =
        "Username is required.";
      document.getElementById("username-error").style.display = "block";
      valid = false;
    }

    // Password validation
    if (!password.value.trim()) {
      document.getElementById("password-error").textContent =
        "Password is required.";
      document.getElementById("password-error").style.display = "block";
      valid = false;
    }

    if (profile_picture_url.files.length === 0) {
      document.getElementById("profile_picture_url-error").textContent =
        "Profile picture is required.";
      document.getElementById("profile_picture_url-error").style.display =
        "block";
      valid = false;
    }

    if (valid) {
      alert("Registration successful!");
      // Here you can add your code to submit the form data to the server
      const params = new URLSearchParams(window.location.search);
      const role = params.get("role");

    }
  });

document
  .getElementById("profile_picture_url")
  .addEventListener("change", function () {
    const fileLabel = this.nextElementSibling;
    const fileName = this.files.length > 0 ? this.files[0].name : "Choose File";
    fileLabel.textContent = fileName;

    const thumbnailContainer = document.getElementById("thumbnail-container");
    thumbnailContainer.innerHTML = ""; // Clear previous thumbnail

    if (this.files.length > 0) {
      const file = this.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        thumbnailContainer.appendChild(img);
      };

      reader.readAsDataURL(file);
    }
  });

  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");
  console.log(role);