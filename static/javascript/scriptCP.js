// CSRF token utility
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrfToken = getCookie('csrftoken');

// Add to Cart for Category Products
function addToCart(productId) {
  fetch("/add-to-cart-category-product/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': csrfToken
    },
    body: `product_id=${productId}&quantity=1`
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || 'Added to cart!');
  })
  .catch(err => {
    alert("Error adding to cart.");
    console.error(err);
  });
}

// Buy Now for Category Products
function buyNow(productId) {
  fetch("/buy-category-product-now/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': csrfToken
    },
    body: `product_id=${productId}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.redirect_url) {
      window.location.href = data.redirect_url;
    } else {
      alert('Purchase failed.');
    }
  })
  .catch(err => {
    alert("Error processing purchase.");
    console.error(err);
  });
}
