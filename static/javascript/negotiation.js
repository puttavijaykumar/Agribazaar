document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.getElementById('add-to-cart');
    
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const csrfToken = document.getElementById('csrf-token').value;

            fetch('/add-to-cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ product_id: productId })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not OK');
                }
            })
            .then(data => {
                alert(data.message); // You can also update UI instead of alert
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                alert('Something went wrong. Please try again.');
            });
        });
    }
});
