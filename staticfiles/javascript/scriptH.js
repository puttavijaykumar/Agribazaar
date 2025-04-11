document.addEventListener("DOMContentLoaded", function () {
    // Search bar functionality
    const searchInput = document.querySelector(".navbar .form-control");
    const resultsDiv = document.getElementById("searchResults");
    const warningDiv = document.getElementById("warningMessage");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = searchInput.value.trim();

            console.log("User is searching for:", query); // Logging search input

            if (query === "") {
                resultsDiv.innerHTML = "";
                warningDiv.textContent = "";
                return;
            }

            fetch(`/search-products/?q=${encodeURIComponent(query)}`)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw err;
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    warningDiv.textContent = "";
                    resultsDiv.innerHTML = data.results.map(product =>
                        `<div class="card mb-2 p-2 d-flex flex-row align-items-center">
                            <img src="${product.image}" width="60" height="60" class="me-3" style="object-fit: cover; border-radius: 8px;">
                            <div>
                                <h6 class="mb-0">${product.name}</h6>
                                <small>₹${product.price}</small>
                            </div>
                        </div>`
                    ).join("");
                })
                .catch(err => {
                    warningDiv.textContent = err.error || "Something went wrong.";
                    resultsDiv.innerHTML = "";
                });
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
