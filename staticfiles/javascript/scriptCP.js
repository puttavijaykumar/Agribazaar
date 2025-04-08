document.addEventListener("DOMContentLoaded", function () {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');

    cartButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            alert("Added to cart! (Feature under development)");
        });
    });
});
