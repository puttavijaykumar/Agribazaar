// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Access the search bar
    const searchInput = document.querySelector(".navbar .form-control");

    // Listen for input in the search bar
    searchInput.addEventListener("input", function () {
        console.log("User is searching for:", searchInput.value);
    });

    // Change navbar color on scroll
    window.addEventListener("scroll", function () {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = "#1e7e34"; // Darker green on scroll
        } else {
            navbar.style.backgroundColor = "#28a745"; // Original color
        }
    });
});
