// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    // Access the search bar
    const searchInput = document.querySelector(".navbar .form-control");

    // Ensure the search input exists before adding an event listener
    if (searchInput) {
        // Listen for input in the search bar
        searchInput.addEventListener("input", function () {
            console.log("User is searching for:", searchInput.value);
        });
    }

    // Change navbar color on scroll
    window.addEventListener("scroll", function () {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.classList.add("bg-success"); // Add Bootstrap 'bg-success' class for a darker green
        } else {
            navbar.classList.remove("bg-success"); // Remove the class to revert to the original color
        }
    });

    // Initialize Bootstrap's navbar toggler
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    // Ensure the navbar toggler and collapse elements exist
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener("click", function () {
            navbarCollapse.classList.toggle("show");
        });
    }
});
