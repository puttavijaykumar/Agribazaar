document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("productBox").addEventListener("click", function () {
        navigateToPage("/products/list/");  // Navigate directly
    });

    document.getElementById("accountsBox").addEventListener("click", function () {
        navigateToPage("/farmer/account/");  // Navigate directly
    });

    function navigateToPage(url) {
        window.location.href = url;
    }
});
