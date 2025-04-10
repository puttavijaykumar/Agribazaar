// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    // Search bar logging
    const searchInput = document.querySelector(".navbar .form-control");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            console.log("User is searching for:", searchInput.value);
        });
    }

    // Change navbar background color on scroll
    window.addEventListener("scroll", function () {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.classList.add("bg-success");
        } else {
            navbar.classList.remove("bg-success");
        }
    });

    // Navbar toggler toggle logic
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener("click", function () {
            navbarCollapse.classList.toggle("show");
        });
    }

    // Disable feature links for unauthorized users
    const disabledLinks = document.querySelectorAll("a.disabled-link");

    disabledLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Stop the navigation
            alert("Please login to access this feature.");
        });
    });
});
