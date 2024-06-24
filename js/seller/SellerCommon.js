async function LoadContent() {
  try {
    const headerResponse = await fetch("../seller/SellerHeader.html");
    if (!headerResponse.ok) {
      throw new Error("Failed to fetch header");
    }
    const headerHtml = await headerResponse.text();
    document.getElementsByClassName("header")[0].innerHTML = headerHtml;
  } catch (error) {
    console.error("Error fetching header:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await LoadContent();


});
window.addEventListener("load", () => {
    document.querySelector("body").classList.add("fade-in");
  });