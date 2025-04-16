document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('search-input');
    const resultsDiv = document.getElementById('search-results');

    if (!input || !resultsDiv) return;

    input.addEventListener('keyup', function () {
        const query = input.value.trim();

        if (query.length === 0) {
            resultsDiv.innerHTML = '';
            return;
        }

        fetch(`/ajax/search-products/?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = '';

                if (data.error) {
                    resultsDiv.innerHTML = `<div class="search-error">${data.error}</div>`;
                    return;
                }

                if (data.products.length > 0) {
                    data.products.forEach(product => {
                        const item = document.createElement('div');
                        item.classList.add('search-suggestion');
                        item.innerHTML = `
                            <strong>${product.name}</strong><br>
                            ₹${product.price}
                        `;
                        resultsDiv.appendChild(item);
                    });
                } else {
                    resultsDiv.innerHTML = '<p>No related products found</p>';
                }
            });
    });
});
