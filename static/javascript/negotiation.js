// ✅ 1. First: Get CSRF Token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrfToken = getCookie('csrftoken');

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.getElementById('add-to-cart');

    // ✅ 2. Add to Cart button logic
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const csrfToken = document.getElementById('csrf-token').value;
            const productType = this.getAttribute('data-product-type');

            fetch('/addtocart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    product_id: productId,
                    product_type: productType
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not OK');
                }
            })
            .then(data => {
                alert(data.message); // Optional: better to show a toast or small message
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                alert('Something went wrong. Please try again.');
            });
        });
    }
});
