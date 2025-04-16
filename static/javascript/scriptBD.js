const searchForm = document.querySelector("form.d-flex");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", function(event) {
  event.preventDefault(); 
  const query = searchInput.value.trim(); 

  if(query){ 
    // Send data to backend
    fetch("{% url 'search_products' %}", {  // Use Django template tag for URL reversal
      method: "POST",  // or GET depending on your backend setup
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken")  // Required for Django CSRF protection
      },
      body: JSON.stringify({
        search_query: query
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      // Handle successful response
      search_products(data);  // Call your backend function with received data
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      // Don't try to call error.json() here
    });
  }
  else {
    alert("Please enter a search term.");
  }
});

// Function to get CSRF token (required for Django)
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